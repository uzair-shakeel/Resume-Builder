"use client";

import { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  AlignLeft,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileProps {
  data: string;
  updateData: (data: string) => void;
}

export default function Profile({ data, updateData }: ProfileProps) {
  const [localData, setLocalData] = useState<string>(data);
  const { t } = useLanguage();

  // Update local state when parent data changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalData(value);
    updateData(value);
  };

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("site.builder.forms.profile.fields.summary")}
      </label>
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <textarea
          value={localData}
          onChange={handleChange}
          rows={6}
          className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t(
            "site.builder.forms.profile.fields.summary_placeholder"
          )}
        />
        <div className="flex border-t p-2 bg-gray-50">
          <div className="flex space-x-1">
            <button className="p-1 rounded hover:bg-gray-200">
              <Bold className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-1 rounded hover:bg-gray-200">
              <Italic className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-1 rounded hover:bg-gray-200">
              <Underline className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-1 rounded hover:bg-gray-200">
              <Link className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div className="border-l mx-2" />
          <div className="flex space-x-1">
            <button className="p-1 rounded hover:bg-gray-200">
              <List className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-1 rounded hover:bg-gray-200">
              <ListOrdered className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-1 rounded hover:bg-gray-200">
              <AlignLeft className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          {/* <div className="ml-auto">
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
              Suggestions de l'IA
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
