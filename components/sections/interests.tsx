"use client";

import { useState, useEffect } from "react";
import type { InterestItem } from "@/types";
import { MoreVertical, ChevronUp, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InterestsProps {
  data: InterestItem[];
  updateData: (data: InterestItem[]) => void;
}

export default function Interests({ data, updateData }: InterestsProps) {
  const [localData, setLocalData] = useState<InterestItem[]>(data);
  const { t } = useLanguage();

  // Update local state when parent data changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (
    index: number,
    field: keyof InterestItem,
    value: string
  ) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const addInterest = () => {
    const newItem: InterestItem = {
      name: "",
    };
    const newData = [...localData, newItem];
    setLocalData(newData);
    updateData(newData);
  };

  const removeInterest = (index: number) => {
    const newData = localData.filter((_, i) => i !== index);
    setLocalData(newData);
    updateData(newData);
  };

  // Use hardcoded options for now since the translation keys for options aren't in the file
  const interestOptions = [
    "Courses",
    "Internships",
    "Extracurricular Activities",
    "References",
    "Qualities",
    "Certificates",
    "Achievements",
    "Signature",
    "Footer",
  ];

  return (
    <div className="bg-white rounded-md">
      {/* <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">:</span>
          <h2 className="text-lg font-medium">Centres d'intérêt</h2>
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
          <div key={index} className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("interests_form.interest_name")}
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => removeInterest(index)}
                className="ml-4 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => handleChange(localData.length, "name", interest)}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span className="mr-1">+</span> {interest}
            </button>
          ))}
        </div>

        <button
          onClick={addInterest}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
        >
          + {t("interests_form.add_interest")}
        </button>
      </div>
    </div>
  );
}
