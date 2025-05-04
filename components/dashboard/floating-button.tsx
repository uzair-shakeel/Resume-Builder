"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Mail, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="lg:hidden fixed right-6 bottom-20 z-50">
      {/* Floating Menu Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col items-end space-y-4 mb-2">
          <Link
            href="/cv/create"
            className="flex items-center bg-gray-700 text-white py-2 px-4 rounded-full transform transition-transform hover:bg-gray-800"
          >
            <span className="mr-2">
              {t("site.dashboard.sidebar.create_resume")}
            </span>
            <FileText size={18} />
          </Link>
          <Link
            href="/cover-letter/create"
            className="flex items-center bg-gray-700 text-white py-2 px-4 rounded-full transform transition-transform hover:bg-gray-800"
          >
            <span className="mr-2">
              {t("site.dashboard.sidebar.create_cover_letter")}
            </span>
            <Mail size={18} />
          </Link>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={toggleMenu}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? "bg-gray-800 text-white rotate-45" : "bg-blue-600 text-white"
        }`}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
};

export default FloatingButton;
