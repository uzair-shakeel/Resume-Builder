"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Home,
  FileText,
  Mail,
  LogOut,
  User,
  Plus,
  HelpCircle,
  BriefcaseIcon,
  CircleHelp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface SidebarProps {
  user: {
    name: string;
    email: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="lg:flex hidden w-64 min-h-screen bg-[#1f1f1f] fixed left-0 top-0">
      <div className="flex-col h-full text-gray-300">
        {/* Header */}
        <div className="p-3 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center text-gray-900 h-8 ps-2"
          >
            <Image
              src="/assets/logo-white-text.svg"
              alt="logo"
              width={85.48}
              height={32}
            />
          </Link>
          {/* Question mark */}
          <div className="flex items-center justify-center">
            <CircleHelp size={20} />
          </div>
        </div>

        {/* New Button with Dropdown */}
        <div className="px-3 mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full bg-transparent hover:bg-gray-800 text-white border border-gray-700 rounded-lg p-3 flex items-center justify-center space-x-2 transition-colors">
              <Plus size={20} />
              <span>Nouveau</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/cv/create" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Créer un CV</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/cover-letter/create" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Créer une lettre de motivation</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/applications/create" className="flex items-center">
                  <BriefcaseIcon className="mr-2 h-4 w-4" />
                  <span>Ajouter une candidature</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 px-3 space-y-1">
          <Link
            href="/dashboard"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive("/dashboard")
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Home size={20} />
            <span>Tableau de bord</span>
          </Link>

          <Link
            href="/cv"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive("/cv")
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <FileText size={20} />
            <span>Curriculum vitae</span>
          </Link>

          <Link
            href="/cover-letter"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive("/cover-letter")
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Mail size={20} />
            <span>Lettres de motivation</span>
          </Link>
        </nav>

        {/* Help */}
        <div className="px-3 mb-4">
          <Link
            href="/help"
            className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <HelpCircle size={20} />
            <span>Aide</span>
          </Link>
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-700 rounded-full p-2">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-4 w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
