"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent, useEffect } from "react";
import type { PersonalInfoData } from "@/types";
import {
  PencilIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCwIcon,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

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
  const imageRef = useRef<HTMLImageElement>(null);
  const { t } = useLanguage();
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [tempImage, setTempImage] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

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
          setTempImage(event.target.result as string);
          setShowCropModal(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (crop: Crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        ctx.drawImage(
          imageRef.current,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        const base64Image = canvas.toDataURL("image/jpeg");
        const newData = {
          ...localData,
          photo: base64Image,
        };
        setLocalData(newData);
        updateData(newData);
        setShowCropModal(false);
      }
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.1));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
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

        {/* Image Crop Modal */}
        {showCropModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Adjust Photo</h3>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <ZoomInIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <ZoomOutIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRotate}
                    className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <RotateCwIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="max-h-[60vh] overflow-auto">
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1}>
                  <img
                    ref={imageRef}
                    src={tempImage}
                    alt="Crop"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowCropModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCropComplete(crop)}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
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
