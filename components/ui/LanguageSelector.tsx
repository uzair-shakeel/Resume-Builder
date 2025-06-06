"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, ChevronUp, ChevronDown, GripVertical } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [position, setPosition] = useState({
    x: 24,
    y: 0, // Temporary fallback
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Set initial position on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPosition({
        x: 24,
        y: window.innerHeight - 100,
      });
    }
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (newLanguage: "en" | "fr") => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrag = (e: globalThis.MouseEvent) => {
    if (isDragging && typeof window !== "undefined") {
      const newX = Math.min(
        Math.max(0, e.clientX - dragStart.x),
        window.innerWidth - 150
      );
      const newY = Math.min(
        Math.max(0, e.clientY - dragStart.y),
        window.innerHeight - 60
      );

      setPosition({
        x: newX,
        y: newY,
      });
    }
  };

  useEffect(() => {
    if (isDragging && typeof window !== "undefined") {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);

      return () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleDragEnd);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

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
      className={`fixed z-50 bottom-4 left-4 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-24"
      }`}
    >
      <div className="relative group">
        <button
          className="flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full shadow-lg transition-colors"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <div onClick={toggleDropdown} className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="font-medium">
              {t("site.builder.language.name")}
            </span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {isOpen && (
          <div className="absolute bottom-9  mb-2 right-2 bg-white rounded-lg shadow-md overflow-hidden min-w-[90px]">
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
                    className="h-5 w-5 rounded-full"
                  />
                  {t("site.builder.language.english")}
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
                    className="h-5 w-5 rounded-full"
                  />
                  {t("site.builder.language.french")}
                </button>
              </div>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
