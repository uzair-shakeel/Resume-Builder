import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import Footer from "@/components/dashboard/footer";
import FloatingButton from "@/components/dashboard/floating-button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="flex h-screen bg-[#f3f2ef]">
      {/* Language Switcher - Positioned absolutely */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher compact />
      </div>

      {/* Header - visible on mobile */}
      <Header />

      {/* Left Sidebar */}
      <Sidebar
        user={{
          name: session.user.name || "",
          email: session.user.email || "",
        }}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <main className="p-8 max-w-[1200px] mx-auto">{children}</main>
      </div>

      <Footer
        user={{
          name: session.user.name || "",
          email: session.user.email || "",
        }}
      />

      {/* Floating Action Button - Mobile only */}
      <FloatingButton />
    </div>
  );
}
