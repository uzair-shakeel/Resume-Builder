"use client";

import { useState } from "react";
import type { ReferenceItem } from "@/types";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReferencesProps {
  data: ReferenceItem[];
  updateData: (data: ReferenceItem[]) => void;
}

export default function References({ data, updateData }: ReferencesProps) {
  const [localData, setLocalData] = useState<ReferenceItem[]>(data);
  const { t } = useLanguage();

  const handleChange = (
    index: number,
    field: keyof ReferenceItem,
    value: string
  ) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const addReference = () => {
    const newItem: ReferenceItem = {
      name: "",
      position: "",
      company: "",
      email: "",
      phone: "",
    };
    setLocalData([...localData, newItem]);
    updateData([...localData, newItem]);
  };

  const removeReference = (index: number) => {
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
                {t("site.builder.forms.references.fields.name")}
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder={t(
                  "site.builder.forms.references.fields.name_placeholder"
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("site.builder.forms.references.fields.position")}
              </label>
              <input
                type="text"
                value={item.position}
                onChange={(e) =>
                  handleChange(index, "position", e.target.value)
                }
                placeholder={t(
                  "site.builder.forms.references.fields.position_placeholder"
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("site.builder.forms.references.fields.company")}
              </label>
              <input
                type="text"
                value={item.company}
                onChange={(e) => handleChange(index, "company", e.target.value)}
                placeholder={t(
                  "site.builder.forms.references.fields.company_placeholder"
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("site.builder.forms.references.fields.email")}
                </label>
                <input
                  type="email"
                  value={item.email}
                  onChange={(e) => handleChange(index, "email", e.target.value)}
                  placeholder={t(
                    "site.builder.forms.references.fields.email_placeholder"
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("site.builder.forms.references.fields.phone")}
                </label>
                <input
                  type="tel"
                  value={item.phone}
                  onChange={(e) => handleChange(index, "phone", e.target.value)}
                  placeholder={t(
                    "site.builder.forms.references.fields.phone_placeholder"
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => removeReference(index)}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Trash2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addReference}
        className="flex items-center justify-center w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <span className="mr-1">+</span>{" "}
        {t("site.builder.forms.references.fields.add_reference")}
      </button>
    </div>
  );
}
