"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Home, FileText, Mail, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface FooterProps {
  user: {
    name: string;
    email: string;
  };
}

const Footer = ({ user }: FooterProps) => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1f1f1f] border-t border-gray-800 z-40">
      {/* Navigation */}
      <nav className="flex justify-around items-center h-16 px-4">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center space-y-1 ${
            isActive("/dashboard") ? "text-white" : "text-gray-400"
          }`}
        >
          <Home size={20} />
          <span className="text-xs">
            {t("site.dashboard.sidebar.dashboard")}
          </span>
        </Link>

        <Link
          href="/cv"
          className={`flex flex-col items-center justify-center space-y-1 ${
            isActive("/cv") ? "text-white" : "text-gray-400"
          }`}
        >
          <FileText size={20} />
          <span className="text-xs">{t("site.dashboard.sidebar.resumes")}</span>
        </Link>

        <Link
          href="/cover-letter"
          className={`flex flex-col items-center justify-center space-y-1 ${
            isActive("/cover-letter") ? "text-white" : "text-gray-400"
          }`}
        >
          <Mail size={20} />
          <span className="text-xs">
            {t("site.dashboard.sidebar.cover_letters")}
          </span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex flex-col items-center justify-center space-y-1 text-gray-400"
        >
          <LogOut size={20} />
          <span className="text-xs">
            {t("site.dashboard.sidebar.sign_out")}
          </span>
        </button>
      </nav>
    </footer>
  );
};

export default Footer;
