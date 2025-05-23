"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent, useEffect } from "react";
import type { PersonalInfoData } from "@/types";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface PersonalInfoProps {
  data: PersonalInfoData;
  updateData: (data: PersonalInfoData) => void;
  template?: string;
}

export default function PersonalInfo({
  data,
  updateData,
  template = "modern",
}: PersonalInfoProps) {
  const [localData, setLocalData] = useState<PersonalInfoData>(data);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Check if the current template is HR (which doesn't use a photo)
  const isHRTemplate = template === "hr";

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...localData, [name]: value };
    setLocalData(newData);
    updateData(newData);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newData = {
            ...localData,
            photo: event.target.result as string,
          };
          setLocalData(newData);
          updateData(newData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap items-start gap-4">
        {/* Only show photo field if not using HR template */}
        {!isHRTemplate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("site.builder.forms.personal_info.fields.photo")}
            </label>
            <div
              className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              <Image
                src={localData.photo || "/placeholder.svg?height=200&width=200"}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
              <button className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md">
                <PencilIcon className="w-4 h-4 text-gray-500" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        )}

        <div
          className={`flex-1 grid md:grid-cols-2 min-w-[200px] gap-4 ${
            isHRTemplate ? "col-span-2" : ""
          }`}
        >
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("site.builder.forms.personal_info.fields.first_name")}
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={localData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("site.builder.forms.personal_info.fields.last_name")}
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={localData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("site.builder.forms.personal_info.fields.email")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={localData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("site.builder.forms.personal_info.fields.phone")}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={localData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("site.builder.forms.personal_info.fields.address")}
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={localData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("site.builder.forms.personal_info.fields.zip_code")}
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={localData.postalCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("site.builder.forms.personal_info.fields.city")}
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={localData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* <div className="flex flex-wrap gap-2 mt-4">
        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          <span className="mr-1">+</span> Date de naissance
        </button>
        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          <span className="mr-1">+</span> Lieu de naissance
        </button>
        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          <span className="mr-1">+</span> Permis de conduire
        </button>
        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          <span className="mr-1">+</span> Sexe
        </button>
        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          <span className="mr-1">+</span> Nationalité
        </button>
        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          <span className="mr-1">+</span> État civil
        </button>
        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          <span className="mr-1">+</span> Site internet
        </button>
        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          <span className="mr-1">+</span> LinkedIn
        </button>
        <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          <span className="mr-1">+</span> Champ personnalisé
        </button>
      </div> */}
    </div>
  );
}
