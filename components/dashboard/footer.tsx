import {
  Briefcase,
  FileSpreadsheet,
  Home,
  Mail,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const footer = () => {
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
        <Link
          href="/offres"
          className="flex flex-col items-center text-gray-300"
        >
          <Briefcase className="w-6 h-6" />
          <span className="text-xs">Offres</span>
        </Link>
        <Link
          href="/candidatures"
          className="flex flex-col items-center text-gray-300"
        >
          <UserCircle className="w-6 h-6" />
          <span className="text-xs">Candidatures</span>
        </Link>
      </nav>
    </div>
  );
};

export default footer;
