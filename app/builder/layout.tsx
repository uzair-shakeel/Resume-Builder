import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to login
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="relative min-h-screen">
      

      {/* Main Content */}
      {children}
    </div>
  );
}
