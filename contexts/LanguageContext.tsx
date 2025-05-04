"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "fr";

interface TranslationCategory {
  category: string;
  description: string;
  translations: Record<string, any>;
}

interface TranslationPage {
  [pageName: string]: TranslationCategory[] | Record<string, any>;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { returnObjects?: boolean }) => any; // Allow returning any type
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("fr");
  const [translations, setTranslations] = useState<TranslationPage>({});

  useEffect(() => {
    // Try to get the stored language preference
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguage(savedLanguage);
    }

    // Load translations based on language
    const loadTranslations = async () => {
      const translationModule = await import(
        `../translations/${language}.json`
      );
      setTranslations(translationModule.default);
    };

    loadTranslations();
  }, [language]);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key: string, options: { returnObjects?: boolean } = {}): any => {
    // key format: "site.dashboard.path.to.value"
    const parts = key.split(".");

    // Start with the entire translations object
    let result = translations;

    // Navigate through each part of the path
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (!result || typeof result !== "object") {
        console.warn(
          `Translation not found for key: ${key}, failed at part: ${part}`
        );
        return options.returnObjects ? [] : key;
      }

      // Move to the next level
      result = result[part];

      // If undefined at any level, return the key
      if (result === undefined) {
        console.warn(
          `Translation not found for key: ${key}, missing part: ${part}`
        );
        return options.returnObjects ? [] : key;
      }
    }

    // If returnObjects is true, return the raw result
    if (options.returnObjects) {
      return result || [];
    }

    // Otherwise, ensure we return a string
    return typeof result === "string" ? result : key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: changeLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
