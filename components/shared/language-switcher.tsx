"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

type LanguageSwitcherProps = {
  compact?: boolean;
  className?: string;
};

export function LanguageSwitcher({ compact = false, className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  if (compact) {
    return (
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleLanguage}
        className={className}
        title={language === "en" ? "Switch to French" : "Passer à l'anglais"}
      >
        <Globe className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={toggleLanguage}
      className={`flex items-center gap-2 ${className}`}
    >
      <Globe className="h-4 w-4" />
      {language === "en" ? "Français" : "English"}
    </Button>
  );
} 