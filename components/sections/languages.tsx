"use client";

import { useState, useEffect } from "react";
import type { LanguageItem } from "@/types";
import { Trash2 } from "lucide-react";

interface LanguagesProps {
  data: LanguageItem[];
  updateData: (data: LanguageItem[]) => void;
}

export default function Languages({ data, updateData }: LanguagesProps) {
  const [localData, setLocalData] = useState<LanguageItem[]>(data);

  // Update local state when parent data changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (
    index: number,
    field: keyof LanguageItem,
    value: string
  ) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const addLanguage = () => {
    const newItem: LanguageItem = {
      name: "",
      level: "Débutant",
    };
    const newData = [...localData, newItem];
    setLocalData(newData);
    updateData(newData);
  };

  const removeLanguage = (index: number) => {
    const newData = localData.filter((_, i) => i !== index);
    setLocalData(newData);
    updateData(newData);
  };

  return (
    <div className="p-4 space-y-4">
      {localData.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langue
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => removeLanguage(index)}
              className="ml-4 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau
            </label>
            <select
              value={item.level}
              onChange={(e) => handleChange(index, "level", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
              <option value="Bilingue">Bilingue</option>
              <option value="Langue maternelle">Langue maternelle</option>
            </select>
          </div>
        </div>
      ))}

      <button
        onClick={addLanguage}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
      >
        + Ajouter une langue
      </button>
    </div>
  );
}
