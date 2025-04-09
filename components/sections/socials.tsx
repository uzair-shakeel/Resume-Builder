"use client";

import { useState } from "react";
import type { Social } from "@/types/index";
import { MoreVertical, ChevronUp, Trash2, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SocialsProps {
  data: Social[];
  updateData: (data: Social[]) => void;
}

export default function Socials({ data, updateData }: SocialsProps) {
  const [localData, setLocalData] = useState<Social[]>(data || []);
  const { t } = useLanguage();

  const platformOptions = [
    "LinkedIn",
    "Twitter",
    "GitHub",
    "Portfolio",
    "Instagram",
    "Facebook",
    "Medium",
    "Dribbble",
    "Behance",
  ];

  const addSocial = (platform: string = "") => {
    const newItem: Social = {
      platform: platform || "LinkedIn",
      url: "",
    };
    setLocalData([...localData, newItem]);
    updateData([...localData, newItem]);
  };

  const updateSocial = (index: number, field: keyof Social, value: string) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const removeSocial = (index: number) => {
    const newData = localData.filter((_, i) => i !== index);
    setLocalData(newData);
    updateData(newData);
  };

  return (
    <div className="bg-white rounded-md">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">:</span>
          <h2 className="text-lg font-medium">{t("sections.socials")}</h2>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-md hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <ChevronUp className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {localData.map((item, index) => (
          <div key={index} className="p-4 border rounded-md">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <select
                  value={item.platform}
                  onChange={(e) =>
                    updateSocial(index, "platform", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {platformOptions.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => removeSocial(index)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("socials_form.url")}
              </label>
              <input
                type="url"
                value={item.url}
                onChange={(e) => updateSocial(index, "url", e.target.value)}
                placeholder={`www.${item.platform.toLowerCase()}.com/yourprofile`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          {platformOptions.map((platform) => (
            <button
              key={platform}
              onClick={() => addSocial(platform)}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span className="mr-1">+</span> {platform}
            </button>
          ))}
        </div>

        <button
          onClick={() => addSocial()}
          className="flex items-center justify-center w-full px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("socials_form.add_social")}
        </button>
      </div>
    </div>
  );
}
