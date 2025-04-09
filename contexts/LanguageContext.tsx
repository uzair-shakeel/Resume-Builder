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
    // key format: "category.path.to.value"
    const parts = key.split(".");
    const categoryName = parts[0];

    // Find the category in our translations across all pages
    let categoryObj: TranslationCategory | undefined;
    let result: any;

    // Search through all pages to find the category
    for (const pageName in translations) {
      const page = translations[pageName];

      // Handle both array and object structures
      if (Array.isArray(page)) {
        const foundCategory = page.find((cat) => cat.category === categoryName);
        if (foundCategory) {
          categoryObj = foundCategory;
          result = foundCategory.translations;
          break;
        }
      } else if (typeof page === "object" && page !== null) {
        // Direct object structure (like in Placeholder-CV)
        if (pageName === categoryName || page[categoryName]) {
          result = pageName === categoryName ? page : page[categoryName];
          break;
        }
      }
    }

    if (!result) return options.returnObjects ? [] : key;

    // Navigate through the object based on the key path
    for (let i = 1; i < parts.length; i++) {
      // Handle array indices (e.g., "items[0]")
      const part = parts[i];
      const match = part.match(/^(\w+)\[(\d+)\]$/);
      if (match) {
        const arrayKey = match[1];
        const index = parseInt(match[2], 10);
        if (result[arrayKey] && Array.isArray(result[arrayKey])) {
          result = result[arrayKey][index];
        } else {
          return options.returnObjects ? [] : key;
        }
      } else {
        if (result[part] === undefined) return options.returnObjects ? [] : key;
        result = result[part];
      }
    }

    // If returnObjects is true, return the raw result (could be array, object, etc.)
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
