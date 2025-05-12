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
    y: window.innerHeight - 100,
  }); // Initial position
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  const handleDrag = (e: MouseEvent) => {
    if (isDragging) {
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
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);

      return () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleDragEnd);
      };
    }
  }, [isDragging]);

  // Handle scroll behavior - hide when scrolling down, show when scrolling up
  useEffect(() => {
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
      className={`fixed z-50 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-24"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? "none" : "all 0.3s ease-in-out",
      }}
    >
      <div className="relative group">
        <button
          className="flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full shadow-lg transition-colors"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {/* Drag Handle */}
          <div className=" cursor-move" onMouseDown={handleDragStart}>
            <GripVertical className="w-5 h-5 hidden group-hover:block text-gray-700 hover:text-gray-900" />
          </div>
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
