"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const languages = [
  { code: "en", label: "English", flag: "/flags/usa.webp" },
  { code: "fr", label: "French", flag: "/flags/france.webp" },
  // Add more languages here
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm font-medium hover:text-brand-500 transition-colors"
      >
        <Image
          src={selectedLanguage?.flag}
          alt={language}
          width={20}
          height={15}
          className="rounded-full object-cover h-5 w-5"
        />
        <span>{selectedLanguage?.label}</span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-32 bg-white border rounded shadow-md z-10">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
            >
              <Image
                src={lang.flag}
                alt={lang.label}
                width={20}
                height={15}
                className="rounded-full object-cover h-5 w-5 mr-2"
              />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
