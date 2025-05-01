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
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const addLanguage = () => {
    const newItem: LanguageItem = {
      name: "",
      level: 3,
    };
    setLocalData([...localData, newItem]);
    updateData([...localData, newItem]);
  };

  const removeLanguage = (index: number) => {
    const newData = localData.filter((_, i) => i !== index);
    setLocalData(newData);
    updateData(newData);
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
              value={item.level}
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
