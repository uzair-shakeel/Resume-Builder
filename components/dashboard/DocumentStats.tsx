import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

interface MonthlyData {
  year: number;
  month: number;
  monthName: string;
  count: number;
}

interface DocumentStatsData {
  totalCVs: number;
  totalCoverLetters: number;
  downloads: {
    uniqueCVs: number;
    uniqueCoverLetters: number;
    totalCVDownloads: number;
    totalCoverLetterDownloads: number;
  };
  monthly: {
    cvs: {
      created: MonthlyData[];
      downloaded: MonthlyData[];
    };
    coverLetters: {
      created: MonthlyData[];
      downloaded: MonthlyData[];
    };
  };
}

interface UserStatsData {
  totalUsers: number;
  currentMonthUsers: number;
  monthlyAverage: number;
  monthly: MonthlyData[];
}

export function DocumentStats() {
  const [stats, setStats] = useState<DocumentStatsData | null>(null);
  const [userStats, setUserStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        // Fetch document statistics
        const docResponse = await fetch("/api/analytics/totals");
        if (!docResponse.ok) {
          throw new Error("Failed to fetch document statistics");
        }
        const docData = await docResponse.json();
        setStats(docData);

        // Fetch user statistics
        const userResponse = await fetch("/api/analytics/users");
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user statistics");
        }
        const userData = await userResponse.json();
        setUserStats(userData);

        setError(null);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <StatsLoading />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const totalDocuments = stats.totalCVs + stats.totalCoverLetters;
  const totalDownloads =
    stats.downloads.totalCVDownloads +
    stats.downloads.totalCoverLetterDownloads;

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Documents"
          value={totalDocuments}
          description="Total CVs and Cover Letters"
        />
        <StatCard
          title="Total Downloads"
          value={totalDownloads}
          description="All document downloads"
        />
        {userStats && (
          <StatCard
            title="Total Users"
            value={userStats.totalUsers}
            description="Registered users"
          />
        )}
        <StatCard
          title="CV Download Rate"
          value={`${
            stats.totalCVs
              ? Math.round((stats.downloads.uniqueCVs / stats.totalCVs) * 100)
              : 0
          }%`}
          description="% of CVs downloaded"
        />
      </div>

      {/* Tabs for Documents, Downloads, Users */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Activity</TabsTrigger>
          {userStats && <TabsTrigger value="users">Users</TabsTrigger>}
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total CVs"
              value={stats.totalCVs}
              description="Total CVs created"
            />
            <StatCard
              title="Total Cover Letters"
              value={stats.totalCoverLetters}
              description="Total Cover Letters created"
            />
            <StatCard
              title="Unique CVs Downloaded"
              value={stats.downloads.uniqueCVs}
              description="Unique CV documents downloaded"
            />
            <StatCard
              title="Unique Cover Letters Downloaded"
              value={stats.downloads.uniqueCoverLetters}
              description="Unique Cover Letter documents downloaded"
            />
          </div>
        </TabsContent>

        {/* Downloads Tab */}
        <TabsContent value="downloads" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="CV Downloads"
              value={stats.downloads.totalCVDownloads}
              description="Total CV download operations"
            />
            <StatCard
              title="Cover Letter Downloads"
              value={stats.downloads.totalCoverLetterDownloads}
              description="Total Cover Letter download operations"
            />
            <StatCard
              title="Average Downloads per CV"
              value={(stats.totalCVs
                ? stats.downloads.totalCVDownloads / stats.totalCVs
                : 0
              ).toFixed(1)}
              description="Average downloads per CV"
            />
            <StatCard
              title="Average Downloads per Cover Letter"
              value={(stats.totalCoverLetters
                ? stats.downloads.totalCoverLetterDownloads /
                  stats.totalCoverLetters
                : 0
              ).toFixed(1)}
              description="Average downloads per Cover Letter"
            />
          </div>
        </TabsContent>

        {/* Monthly Activity Tab */}
        <TabsContent value="monthly" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyChart
              title="Monthly CV Activity"
              createdData={stats.monthly.cvs.created}
              downloadedData={stats.monthly.cvs.downloaded}
            />
            <MonthlyChart
              title="Monthly Cover Letter Activity"
              createdData={stats.monthly.coverLetters.created}
              downloadedData={stats.monthly.coverLetters.downloaded}
            />
          </div>
        </TabsContent>

        {/* Users Tab */}
        {userStats && (
          <TabsContent value="users" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Total Users"
                value={userStats.totalUsers}
                description="Registered users"
              />
              <StatCard
                title="Current Month Users"
                value={userStats.currentMonthUsers}
                description="New users this month"
              />
              <StatCard
                title="Monthly Average"
                value={userStats.monthlyAverage}
                description="Average new users per month"
              />
            </div>
            <Card className="w-full mt-6">
              <CardHeader>
                <CardTitle>Monthly User Registrations</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userStats.monthly}>
                    <XAxis dataKey="monthName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="New Users" fill="#4361ee" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number | string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function MonthlyChart({
  title,
  createdData,
  downloadedData,
}: {
  title: string;
  createdData: MonthlyData[];
  downloadedData: MonthlyData[];
}) {
  // Prepare data for the chart
  const chartData = createdData.map((item, index) => ({
    name: item.monthName,
    created: item.count,
    downloaded: downloadedData[index]?.count || 0,
  }));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="created" name="Created" fill="#4361ee" />
            <Bar dataKey="downloaded" name="Downloaded" fill="#3a86ff" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function StatsLoading() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[140px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-4 w-[100px] mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-80 w-full" />
    </div>
  );
}
