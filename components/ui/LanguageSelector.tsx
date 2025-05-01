"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, ChevronUp, ChevronDown } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (newLanguage: "en" | "fr") => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  // Handle scroll behavior - hide when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

      // Only hide when scrolling down and already scrolled some distance
      if (isScrollingDown && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-24"
      }`}
    >
      <div className="relative">
        <button
          className="flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full shadow-lg transition-colors"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <Globe className="w-5 h-5" />
          <span className="font-medium">{t("site.language.name")}</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {isOpen && (
          <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg overflow-hidden min-w-[150px]">
            <ul className="py-1">
              <div>
                <button
                  className={`w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100 ${
                    language === "en" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  onClick={() => changeLanguage("en")}
                >
                  <img
                    src="/flags/usa.webp"
                    alt=""
                    className="h-5 w-5 rounded-full "
                  />
                  {t("site.language.english")}
                </button>
              </div>
              <div>
                <button
                  className={`w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100 ${
                    language === "fr" ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  onClick={() => changeLanguage("fr")}
                >
                  <img
                    src="/flags/france.webp"
                    alt=""
                    className="h-5 w-5 rounded-full "
                  />
                  {t("site.language.french")}
                </button>
              </div>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
