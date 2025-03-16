"use client";

import { FileSpreadsheet, Home, LogOut, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface FooterProps {
  user: {
    name: string;
    email: string;
  };
}

const Footer = ({ user }: FooterProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1f1f1f] z-40">
      <nav className="flex justify-around items-center h-16">
        <Link
          href="/dashboard"
          className="flex flex-col items-center text-blue-600"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Tableau</span>
        </Link>
        <Link href="/cv" className="flex flex-col items-center text-gray-300">
          <FileSpreadsheet className="w-6 h-6" />
          <span className="text-xs">CV</span>
        </Link>
        <Link
          href="/lettres"
          className="flex flex-col items-center text-gray-300"
        >
          <Mail className="w-6 h-6" />
          <span className="text-xs">Lettres</span>
        </Link>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex flex-col items-center text-gray-300 focus:outline-none"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>

          {showUserMenu && (
            <div className="absolute bottom-full mb-2 right-0 w-64 bg-[#1f1f1f] rounded-lg shadow-lg border border-gray-800">
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 rounded-full p-2">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
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
          )}
        </div>
      </nav>
    </div>
  );
};

export default Footer;
