"use client";

import { useState, useEffect } from "react";
import type { EducationItem } from "@/types";
import { Trash2 } from "lucide-react";

interface EducationProps {
  data: EducationItem[];
  updateData: (data: EducationItem[]) => void;
}

export default function Education({ data, updateData }: EducationProps) {
  const [localData, setLocalData] = useState<EducationItem[]>(data);

  // Update local state when parent data changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (
    index: number,
    field: keyof EducationItem,
    value: string | boolean
  ) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      school: "",
      degree: "",
      startDate: "sept. 2016",
      endDate: "ce jour",
      current: true,
    };
    const newData = [...localData, newItem];
    setLocalData(newData);
    updateData(newData);
  };

  const removeEducation = (index: number) => {
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
          <div className="flex justify-between items-start">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  École / Université
                </label>
                <input
                  type="text"
                  value={item.school}
                  onChange={(e) =>
                    handleChange(index, "school", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diplôme
                </label>
                <input
                  type="text"
                  value={item.degree}
                  onChange={(e) =>
                    handleChange(index, "degree", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => removeEducation(index)}
              className="ml-4 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="text"
                value={item.startDate}
                onChange={(e) =>
                  handleChange(index, "startDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={item.endDate}
                  onChange={(e) =>
                    handleChange(index, "endDate", e.target.value)
                  }
                  disabled={item.current}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.current}
                    onChange={(e) =>
                      handleChange(index, "current", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">En cours</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
      >
        + Ajouter une formation
      </button>
    </div>
  );
}
