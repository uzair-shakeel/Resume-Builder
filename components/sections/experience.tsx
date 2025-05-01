"use client";

import { useState } from "react";
import type { ExperienceItem } from "@/types";
import {
  Trash2,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  AlignLeft,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExperienceProps {
  data: ExperienceItem[];
  updateData: (data: ExperienceItem[]) => void;
}

export default function Experience({ data, updateData }: ExperienceProps) {
  const [localData, setLocalData] = useState<ExperienceItem[]>(data);
  const { t } = useLanguage();

  const handleChange = (
    index: number,
    field: keyof ExperienceItem,
    value: string | boolean
  ) => {
    const newData = [...localData];
    newData[index] = { ...newData[index], [field]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const addExperience = () => {
    const newItem: ExperienceItem = {
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: true,
      description: "",
    };
    setLocalData([...localData, newItem]);
    updateData([...localData, newItem]);
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
    <div className="p-4 space-y-6">
      {localData.map((item, index) => (
        <div key={index} className="border rounded-md p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("site.builder.forms.experience.fields.position")}
              </label>
              <input
                type="text"
                value={item.position}
                onChange={(e) =>
                  handleChange(index, "position", e.target.value)
                }
                placeholder="Web Developer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("site.builder.forms.experience.fields.company")}
                </label>
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) =>
                    handleChange(index, "company", e.target.value)
                  }
                  placeholder="Agilo, Sindh"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("site.builder.forms.experience.fields.location")}
                </label>
                <input
                  type="text"
                  value={item.location}
                  onChange={(e) =>
                    handleChange(index, "location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("site.builder.forms.experience.fields.start_date")}
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
                      handleDateChange(
                        index,
                        "startDate",
                        "year",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Year</option>
                    {Array.from(
                      { length: 30 },
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
                  {t("site.builder.forms.experience.fields.end_date")}
                </label>
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`current-exp-${index}`}
                      checked={item.current}
                      onChange={(e) =>
                        handleChange(index, "current", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label htmlFor={`current-exp-${index}`} className="text-sm">
                      {t("site.builder.forms.experience.fields.present")}
                    </label>
                  </div>
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
                          { length: 30 },
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("site.builder.forms.experience.fields.description")}
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  rows={4}
                  className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t(
                    "site.builder.forms.experience.fields.description_placeholder"
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
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  const newData = localData.filter((_, i) => i !== index);
                  setLocalData(newData);
                  updateData(newData);
                }}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Trash2 className="w-5 h-5 text-gray-500" />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Done
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="flex items-center justify-center w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <span className="mr-1">+</span>{" "}
        {t("site.builder.forms.experience.fields.add_experience")}
      </button>
    </div>
  );
}
