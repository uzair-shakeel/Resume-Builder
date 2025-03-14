"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, Mail, X } from "lucide-react";

export default function FloatingButton() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}

      <div className="lg:hidden fixed right-4 bottom-20 flex flex-col items-end space-y-2 z-50">
        {isMenuOpen && (
          <>
            <button
              onClick={() => {
                router.push("/builder");
                setIsMenuOpen(false);
              }}
              className="flex items-center bg-white text-blue-600 rounded-full shadow-lg px-4 py-2"
            >
              <FileText className="w-5 h-5 mr-2" />
              <span>Créer un CV</span>
            </button>

            <button
              onClick={() => {
                router.push("/builder/cover-letter");
                setIsMenuOpen(false);
              }}
              className="flex items-center bg-white text-blue-600 rounded-full shadow-lg px-4 py-2"
            >
              <Mail className="w-5 h-5 mr-2" />
              <span>Créer une lettre</span>
            </button>
          </>
        )}

        <button
          onClick={toggleMenu}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
}
