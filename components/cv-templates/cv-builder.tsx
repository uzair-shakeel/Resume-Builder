"use client";
import { useState } from "react";
import type { CVData } from "@/types";
import CVPreview from "./cv-preview";
import CVForm from "./cv-form";
import { placeholderData } from "@/lib/utils";

interface CVBuilderProps {
  initialData: CVData;
}

export default function CVBuilder({ initialData }: CVBuilderProps) {
  const [data, setData] = useState<CVData>(initialData);
  const [sectionOrder, setSectionOrder] = useState([
    "personal-info",
    "profile",
    "education",
    "experience",
    "skills",
    "languages",
    "interests",
  ]);

  const handleDataChange = (newData: Partial<CVData>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const handleSectionOrderChange = (newOrder: string[]) => {
    setSectionOrder(newOrder);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <CVForm data={data} onChange={handleDataChange} />
      </div>
      <div className="sticky top-6">
        <div className="bg-white rounded-lg shadow-lg p-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
          <CVPreview data={data} sectionOrder={sectionOrder} />
        </div>
      </div>
    </div>
  );
}
