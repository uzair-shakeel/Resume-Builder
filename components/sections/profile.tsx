"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import RichTextEditor from "@/components/shared/rich-text-editor";

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

  const handleChange = (value: string) => {
    setLocalData(value);
    updateData(value);
  };

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t("site.builder.forms.profile.fields.summary")}
      </label>
      <RichTextEditor
        value={localData}
        onChange={handleChange}
        placeholder={t("site.builder.forms.profile.fields.summary_placeholder")}
      />
    </div>
  );
}
