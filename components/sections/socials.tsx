"use client";

import { useState } from "react";
import type { SocialItem } from "@/types";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SocialsProps {
  data: SocialItem[];
  updateData: (data: SocialItem[]) => void;
}

export default function Socials({ data, updateData }: SocialsProps) {
  const [localData, setLocalData] = useState<SocialItem[]>(data);
  const { t } = useLanguage();

  const handleChange = (
    index: number,
    field: keyof SocialItem,
    value: string
  ) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const addSocial = () => {
    const newItem: SocialItem = {
      network: "",
      username: "",
      url: "",
    };
    setLocalData([...localData, newItem]);
    updateData([...localData, newItem]);
  };

  const removeSocial = (index: number) => {
    const newData = localData.filter((_, i) => i !== index);
    setLocalData(newData);
    updateData(newData);
  };

  return (
    <div className="p-4 space-y-6">
      {localData.map((item, index) => (
        <div key={index} className="border rounded-md p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("site.builder.forms.socials.fields.network")}
              </label>
              <select
                value={item.network}
                onChange={(e) => handleChange(index, "network", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {t("site.builder.forms.socials.fields.select_network")}
                </option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="GitHub">GitHub</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="Dribbble">Dribbble</option>
                <option value="Behance">Behance</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Blog">Blog</option>
                <option value="Other">
                  {t("site.builder.forms.socials.fields.other")}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("site.builder.forms.socials.fields.username")}
              </label>
              <input
                type="text"
                value={item.username}
                onChange={(e) =>
                  handleChange(index, "username", e.target.value)
                }
                placeholder={t(
                  "site.builder.forms.socials.fields.username_placeholder"
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("site.builder.forms.socials.fields.url")}
              </label>
              <input
                type="url"
                value={item.url}
                onChange={(e) => handleChange(index, "url", e.target.value)}
                placeholder={t(
                  "site.builder.forms.socials.fields.url_placeholder"
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => removeSocial(index)}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Trash2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addSocial}
        className="flex items-center justify-center w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <span className="mr-1">+</span>{" "}
        {t("site.builder.forms.socials.fields.add_social")}
      </button>
    </div>
  );
}
