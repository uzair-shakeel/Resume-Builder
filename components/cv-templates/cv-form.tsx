"use client";

import { CVData } from "@/types";
import { useState } from "react";

interface CVFormProps {
  data: CVData;
  onChange: (data: Partial<CVData>) => void;
}

export default function CVForm({ data, onChange }: CVFormProps) {
  return (
    <form className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={data.personalInfo?.firstName || ""}
            onChange={(e) =>
              onChange({
                personalInfo: {
                  ...data.personalInfo,
                  firstName: e.target.value,
                },
              })
            }
            placeholder="First Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={data.personalInfo?.lastName || ""}
            onChange={(e) =>
              onChange({
                personalInfo: {
                  ...data.personalInfo,
                  lastName: e.target.value,
                },
              })
            }
            placeholder="Last Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            value={data.personalInfo?.email || ""}
            onChange={(e) =>
              onChange({
                personalInfo: { ...data.personalInfo, email: e.target.value },
              })
            }
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </form>
  );
}
