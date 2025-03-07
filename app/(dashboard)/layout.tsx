import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-screen bg-[#f3f2ef]">
      {/* Left Sidebar */}
      <div className="w-64 min-h-screen bg-[#1f1f1f] fixed left-0 top-0">
        <Sidebar
          user={{
            name: session.user.name || "",
            email: session.user.email || "",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main className="p-8 max-w-[1200px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
