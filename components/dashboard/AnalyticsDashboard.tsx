import { useState, useEffect } from "react";
import { getAnalyticsCounts } from "@/lib/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
  totalCVs: number;
  totalCoverLetters: number;
  downloads: {
    cvs: number;
    coverLetters: number;
    uniqueCVsDownloaded: number;
    uniqueCoverLettersDownloaded: number;
  };
}

export function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const data = await getAnalyticsCounts();
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return <AnalyticsLoading />;
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

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      <p className="text-muted-foreground">
        View statistics about resumes and cover letters in the system
      </p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cv">CVs</TabsTrigger>
          <TabsTrigger value="cover-letter">Cover Letters</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <OverviewCard
              title="Total Documents"
              value={analyticsData.totalCVs + analyticsData.totalCoverLetters}
              description="Total number of CVs and Cover Letters"
            />
            <OverviewCard
              title="Total Downloads"
              value={
                analyticsData.downloads.cvs +
                analyticsData.downloads.coverLetters
              }
              description="Total number of downloads"
            />
          </div>
        </TabsContent>

        <TabsContent value="cv" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <OverviewCard
              title="Total CVs"
              value={analyticsData.totalCVs}
              description="Total number of CVs created"
            />
            <OverviewCard
              title="CV Downloads"
              value={analyticsData.downloads.cvs}
              description="Total number of CV downloads"
            />
            <OverviewCard
              title="Unique CVs Downloaded"
              value={analyticsData.downloads.uniqueCVsDownloaded}
              description="Number of different CVs downloaded"
            />
          </div>
        </TabsContent>

        <TabsContent value="cover-letter" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <OverviewCard
              title="Total Cover Letters"
              value={analyticsData.totalCoverLetters}
              description="Total number of Cover Letters created"
            />
            <OverviewCard
              title="Cover Letter Downloads"
              value={analyticsData.downloads.coverLetters}
              description="Total number of Cover Letter downloads"
            />
            <OverviewCard
              title="Unique Cover Letters Downloaded"
              value={analyticsData.downloads.uniqueCoverLettersDownloaded}
              description="Number of different Cover Letters downloaded"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function AnalyticsLoading() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      <p className="text-muted-foreground">Loading statistics...</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-4 w-[180px] mt-2" />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
