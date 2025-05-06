"use client";

import { useState, useEffect } from "react";
import type { LanguageItem } from "@/types";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguagesProps {
  data: LanguageItem[];
  updateData: (data: LanguageItem[]) => void;
}

export default function Languages({ data, updateData }: LanguagesProps) {
  const [localData, setLocalData] = useState<LanguageItem[]>(data);
  const { t } = useLanguage();

  // Update local state when parent data changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (
    index: number,
    field: keyof LanguageItem,
    value: string | number
  ) => {
    const newData = [...localData];

    if (field === "level" && typeof value === "number") {
      // Convert numeric level to string representation
      const levelMap = {
        1: t("site.builder.forms.languages.levels.elementary"),
        2: t("site.builder.forms.languages.levels.limited_working"),
        3: t("site.builder.forms.languages.levels.professional_working"),
        4: t("site.builder.forms.languages.levels.full_professional"),
        5: t("site.builder.forms.languages.levels.native_bilingual"),
      };
      newData[index] = {
        ...newData[index],
        [field]: levelMap[value as 1 | 2 | 3 | 4 | 5],
      };
    } else {
      newData[index] = { ...newData[index], [field]: value };
    }

    setLocalData(newData);
    updateData(newData);
  };

  const addLanguage = () => {
    const defaultLevel = 3;
    const levelMap = {
      1: t("site.builder.forms.languages.levels.elementary"),
      2: t("site.builder.forms.languages.levels.limited_working"),
      3: t("site.builder.forms.languages.levels.professional_working"),
      4: t("site.builder.forms.languages.levels.full_professional"),
      5: t("site.builder.forms.languages.levels.native_bilingual"),
    };

    const newItem: LanguageItem = {
      name: "",
      level: levelMap[defaultLevel as 3],
    };
    setLocalData([...localData, newItem]);
    updateData([...localData, newItem]);
  };

  const removeLanguage = (index: number) => {
    const newData = localData.filter((_, i) => i !== index);
    setLocalData(newData);
    updateData(newData);
  };

  // Map the language level string back to a number for the select component
  const getLevelValue = (levelString: string): number => {
    // Create an array of all possible translated level names
    const levelTranslations = [
      t("site.builder.forms.languages.levels.elementary"),
      t("site.builder.forms.languages.levels.limited_working"),
      t("site.builder.forms.languages.levels.professional_working"),
      t("site.builder.forms.languages.levels.full_professional"),
      t("site.builder.forms.languages.levels.native_bilingual"),
    ];

    // Alternative way to detect the level: check if the string contains any part of the level name
    if (
      levelString.includes("Elementary") ||
      levelString.includes("elementary") ||
      levelTranslations[0].includes(levelString)
    ) {
      return 1;
    } else if (
      levelString.includes("Limited") ||
      levelString.includes("limited") ||
      levelTranslations[1].includes(levelString)
    ) {
      return 2;
    } else if (
      levelString.includes("Professional Working") ||
      levelString.includes("professional working") ||
      levelTranslations[2].includes(levelString)
    ) {
      return 3;
    } else if (
      levelString.includes("Full Professional") ||
      levelString.includes("full professional") ||
      levelTranslations[3].includes(levelString)
    ) {
      return 4;
    } else if (
      levelString.includes("Native") ||
      levelString.includes("native") ||
      levelString.includes("Bilingual") ||
      levelString.includes("bilingual") ||
      levelTranslations[4].includes(levelString)
    ) {
      return 5;
    }

    // If we couldn't detect the level, fall back to a generic approach
    const levelMap = {
      [t("site.builder.forms.languages.levels.elementary").toLowerCase()]: 1,
      [t(
        "site.builder.forms.languages.levels.limited_working"
      ).toLowerCase()]: 2,
      [t(
        "site.builder.forms.languages.levels.professional_working"
      ).toLowerCase()]: 3,
      [t(
        "site.builder.forms.languages.levels.full_professional"
      ).toLowerCase()]: 4,
      [t(
        "site.builder.forms.languages.levels.native_bilingual"
      ).toLowerCase()]: 5,
      // Add English defaults as fallbacks
      elementary: 1,
      "limited working": 2,
      "professional working": 3,
      "full professional": 4,
      native: 5,
      bilingual: 5,
    };

    // Try to match the lowercase level string
    return levelMap[levelString.toLowerCase()] || 3; // Default to Professional Working
  };

  return (
    <div className="p-4 space-y-4">
      {localData.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-md p-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("site.builder.forms.languages.fields.name")}
            </label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              placeholder={t(
                "site.builder.forms.languages.fields.name_placeholder"
              )}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("site.builder.forms.languages.fields.level")}
            </label>
            <select
              value={getLevelValue(item.level)}
              onChange={(e) =>
                handleChange(index, "level", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">
                {t("site.builder.forms.languages.levels.elementary")}
              </option>
              <option value="2">
                {t("site.builder.forms.languages.levels.limited_working")}
              </option>
              <option value="3">
                {t("site.builder.forms.languages.levels.professional_working")}
              </option>
              <option value="4">
                {t("site.builder.forms.languages.levels.full_professional")}
              </option>
              <option value="5">
                {t("site.builder.forms.languages.levels.native_bilingual")}
              </option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => removeLanguage(index)}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Trash2 className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addLanguage}
        className="flex items-center justify-center w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <span className="mr-1">+</span>{" "}
        {t("site.builder.forms.languages.fields.add_language")}
      </button>
    </div>
  );
}
