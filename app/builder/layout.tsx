import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect to sign-in page if user is not authenticated
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="min-h-screen">
      {/* Language Switcher - Positioned absolutely */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher compact />
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
}
