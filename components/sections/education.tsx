"use client";

import { useState, useEffect } from "react";
import type { EducationItem } from "@/types";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EducationProps {
  data: EducationItem[];
  updateData: (data: EducationItem[]) => void;
}

export default function Education({ data, updateData }: EducationProps) {
  const [localData, setLocalData] = useState<EducationItem[]>(data);
  const { t } = useLanguage();

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
      startDate: "",
      endDate: "",
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

  // Helper function to update dates
  const handleDateChange = (
    index: number,
    dateType: "startDate" | "endDate",
    part: "month" | "year",
    value: string
  ) => {
    const newData = [...localData];
    const currentItem = newData[index];

    // Get current date parts
    const dateParts = parseDateParts(currentItem[dateType]);

    // Update the appropriate part
    if (part === "month") {
      dateParts.month = value;
    } else {
      dateParts.year = value;
    }

    // Create the new date string only if at least one part has a value
    let newDate = "";
    if (dateParts.month || dateParts.year) {
      if (dateParts.month && dateParts.year) {
        newDate = `${dateParts.month} ${dateParts.year}`;
      } else if (dateParts.month) {
        newDate = dateParts.month;
      } else if (dateParts.year) {
        newDate = dateParts.year;
      }
    }

    // Update the item
    newData[index] = { ...currentItem, [dateType]: newDate };
    setLocalData(newData);
    updateData(newData);
  };

  // Parse a date string into month and year parts
  const parseDateParts = (dateString: string) => {
    if (!dateString) return { month: "", year: "" };

    const parts = dateString.split(" ");
    if (parts.length === 1) {
      // If there's only one part, determine if it's a month or year
      const part = parts[0];
      const isYear = /^\d{4}$/.test(part); // Check if it's a 4-digit year

      if (isYear) {
        return { month: "", year: part };
      } else {
        return { month: part, year: "" };
      }
    }

    return {
      month: parts[0] || "",
      year: parts[1] || "",
    };
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
                  {t("site.builder.forms.education.fields.school")}
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
                  {t("site.builder.forms.education.fields.degree")}
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
                {t("site.builder.forms.education.fields.start_date")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={parseDateParts(item.startDate).month}
                  onChange={(e) =>
                    handleDateChange(
                      index,
                      "startDate",
                      "month",
                      e.target.value
                    )
                  }
                >
                  <option value="">Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={parseDateParts(item.startDate).year}
                  onChange={(e) =>
                    handleDateChange(index, "startDate", "year", e.target.value)
                  }
                >
                  <option value="">Year</option>
                  {Array.from(
                    { length: 126 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("site.builder.forms.education.fields.end_date")}
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.current}
                    onChange={(e) =>
                      handleChange(index, "current", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">
                    {t("site.builder.forms.education.fields.present")}
                  </span>
                </label>
                {!item.current && (
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={parseDateParts(item.endDate).month}
                      onChange={(e) =>
                        handleDateChange(
                          index,
                          "endDate",
                          "month",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={parseDateParts(item.endDate).year}
                      onChange={(e) =>
                        handleDateChange(
                          index,
                          "endDate",
                          "year",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Year</option>
                      {Array.from(
                        { length: 126 },
                        (_, i) => new Date().getFullYear() - i
                      ).map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
      >
        {t("site.builder.forms.education.fields.add_education")}
      </button>
    </div>
  );
}
