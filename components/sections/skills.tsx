"use client";

import { useState, useEffect } from "react";
import type { SkillItem } from "@/types";
import { MoreVertical, ChevronUp, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SkillsProps {
  data: SkillItem[];
  updateData: (data: SkillItem[]) => void;
}

export default function Skills({ data, updateData }: SkillsProps) {
  const [localData, setLocalData] = useState<SkillItem[]>(data);
  const [newSkill, setNewSkill] = useState<string>("");
  const { t } = useLanguage();

  // Update local state when parent data changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (
    index: number,
    field: keyof SkillItem,
    value: string | number
  ) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const addSkill = () => {
    const newItem: SkillItem = {
      name: "",
      level: 3,
    };
    const newData = [...localData, newItem];
    setLocalData(newData);
    updateData(newData);
  };

  const removeSkill = (index: number) => {
    const newData = localData.filter((_, i) => i !== index);
    setLocalData(newData);
    updateData(newData);
  };

  return (
    <div className="bg-white rounded-md">
      {/* <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">:</span>
          <h2 className="text-lg font-medium">Compétences</h2>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-md hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <ChevronUp className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div> */}

      <div className="p-4 space-y-4">
        {localData.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md p-4 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("site.builder.forms.skills.fields.name")}
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder={t(
                  "site.builder.forms.skills.fields.name_placeholder"
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("site.builder.forms.skills.fields.level")}
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={item.level}
                  onChange={(e) =>
                    handleChange(index, "level", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {item.level}/5
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => removeSkill(index)}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Trash2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addSkill}
          className="flex items-center justify-center w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <span className="mr-1">+</span>{" "}
          {t("site.builder.forms.skills.fields.add_skill")}
        </button>
      </div>
    </div>
  );
}
