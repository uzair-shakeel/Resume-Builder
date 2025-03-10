"use client";

import { useState } from "react";
import type { Reference } from "@/types";
import { MoreVertical, ChevronUp, Trash2, Plus } from "lucide-react";

interface ReferencesProps {
  data: Reference[];
  updateData: (data: Reference[]) => void;
}

export default function References({ data, updateData }: ReferencesProps) {
  const [localData, setLocalData] = useState<Reference[]>(data || []);

  const addReference = () => {
    const newItem: Reference = {
      name: "",
      company: "",
      phone: "",
      email: "",
    };
    setLocalData([...localData, newItem]);
    updateData([...localData, newItem]);
  };

  const updateReference = (
    index: number,
    field: keyof Reference,
    value: string
  ) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const removeReference = (index: number) => {
    const newData = localData.filter((_, i) => i !== index);
    setLocalData(newData);
    updateData(newData);
  };

  return (
    <div className="bg-white rounded-md">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">:</span>
          <h2 className="text-lg font-medium">References</h2>
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
              <h3 className="font-medium">Reference {index + 1}</h3>
              <button
                onClick={() => removeReference(index)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    updateReference(index, "name", e.target.value)
                  }
                  placeholder="Dr. John Watson"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) =>
                    updateReference(index, "company", e.target.value)
                  }
                  placeholder="Self-Employed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={item.phone}
                  onChange={(e) =>
                    updateReference(index, "phone", e.target.value)
                  }
                  placeholder="+44 20 7946 0488"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={item.email}
                  onChange={(e) =>
                    updateReference(index, "email", e.target.value)
                  }
                  placeholder="j.watson@bakerstreet.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addReference}
          className="flex items-center justify-center w-full px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reference
        </button>
      </div>
    </div>
  );
}
