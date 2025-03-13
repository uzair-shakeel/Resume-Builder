"use client";

import { useState, useEffect } from "react";
import type { SkillItem } from "@/types";
import { MoreVertical, ChevronUp, Trash2 } from "lucide-react";

interface SkillsProps {
  data: SkillItem[];
  updateData: (data: SkillItem[]) => void;
}

export default function Skills({ data, updateData }: SkillsProps) {
  const [localData, setLocalData] = useState<SkillItem[]>(data);
  const [newSkill, setNewSkill] = useState<string>("");

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
          <div key={index} className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compétence
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => removeSkill(index)}
                className="ml-4 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={item.level}
                onChange={(e) =>
                  handleChange(index, "level", parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Débutant</span>
                <span>Intermédiaire</span>
                <span>Expert</span>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addSkill}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
        >
          + Ajouter une compétence
        </button>
      </div>
    </div>
  );
}
