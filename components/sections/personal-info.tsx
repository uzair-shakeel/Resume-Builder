"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent, useEffect, useCallback } from "react";
import type { PersonalInfoData } from "@/types";
import {
  PencilIcon,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";

interface PersonalInfoProps {
  data: PersonalInfoData;
  updateData: (data: PersonalInfoData) => void;
  template?: string;
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Helper function to create cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas size to desired output size
  const outputSize = 300;
  canvas.width = outputSize;
  canvas.height = outputSize;

  // Fill with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, outputSize, outputSize);

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return canvas.toDataURL('image/jpeg', 0.9);
};

export default function PersonalInfo({
  data,
  updateData,
  template = "modern",
}: PersonalInfoProps) {
  const [localData, setLocalData] = useState<PersonalInfoData>(data);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  // react-easy-crop states
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  
  // Track if we're currently dragging the slider
  const [isDragging, setIsDragging] = useState(false);
  const [justFinishedDragging, setJustFinishedDragging] = useState(false);

  // Check if the current template is HR (which doesn't use a photo)
  const isHRTemplate = template === "hr";

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const validateImage = (file: File): boolean => {
    setError("");

    // Check file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Please upload a JPEG or PNG image only.");
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError("Image size should be less than 5MB.");
      return false;
    }

    return true;
  };

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

  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          // If it's a PNG, process it to ensure white background
          if (file.type === "image/png") {
            const img = document.createElement("img");
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");

              if (ctx) {
                // Fill with white background
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw the image on top
                ctx.drawImage(img, 0, 0);

                resolve(canvas.toDataURL("image/jpeg", 0.9));
              } else {
                reject(new Error("Could not process image"));
              }
            };
            img.onerror = () => reject(new Error("Could not load image"));
            img.src = event.target.result as string;
          } else {
            // For JPEGs, just pass through
            resolve(event.target.result as string);
          }
        }
      };
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (file) {
      if (validateImage(file)) {
        try {
          const processedImage = await processImage(file);
          setTempImage(processedImage);
          setShowCropModal(true);
          // Reset crop settings
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setCroppedAreaPixels(null);
        } catch (err) {
          setError("Error processing image. Please try another image.");
        }
      }
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropComplete = async () => {
    if (!croppedAreaPixels || !tempImage) return;

    try {
      const croppedImageUrl = await getCroppedImg(tempImage, croppedAreaPixels);
      const newData = {
        ...localData,
        photo: croppedImageUrl,
      };
      setLocalData(newData);
      updateData(newData);
      setShowCropModal(false);
      setTempImage("");
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error('Error cropping image:', error);
      setError('Error processing the cropped image. Please try again.');
    }
  };

  const handleCancelCrop = () => {
    setShowCropModal(false);
    setTempImage("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsDragging(false);
    setJustFinishedDragging(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle clicking outside the modal
  const handleModalBackdropClick = (e: React.MouseEvent) => {
    // Don't close modal if we're dragging or just finished dragging
    if (isDragging || justFinishedDragging) {
      return;
    }
    
    if (e.target === e.currentTarget) {
      handleCancelCrop();
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
            <div className="space-y-2">
              <div
                className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                onClick={handleImageClick}
              >
                <Image
                  src={
                    localData.photo || "/placeholder.svg?height=200&width=200"
                  }
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  unoptimized
                />
                <button className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md">
                  <PencilIcon className="w-4 h-4 text-gray-500" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageChange}
                />
              </div>
              {error && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                Accepted formats: JPEG, PNG (max 5MB)
              </div>
            </div>
          </div>
        )}

        {/* Image Crop Modal */}
        {showCropModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleModalBackdropClick}
            onMouseUp={(e) => {
              // Clear the justFinishedDragging flag after a short delay
              if (justFinishedDragging) {
                setTimeout(() => setJustFinishedDragging(false), 50);
              }
            }}
          >
            <div 
              className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b flex-shrink-0">
                <h3 className="text-lg font-medium">Crop Your Photo</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Drag to reposition and use the slider to zoom. The selected area will be used for your profile photo.
                </p>
              </div>
              
              {/* Crop Area */}
              <div className="relative flex-1 bg-black min-h-[300px] sm:min-h-[400px]">
                <Cropper
                  image={tempImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  showGrid={true}
                  cropShape="rect"
                  objectFit="contain"
                  restrictPosition={false}
                />
              </div>
              
              {/* Controls - Isolated from cropper events */}
              <div 
                className="p-4 sm:p-6 border-t flex-shrink-0 bg-white relative z-10"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      Zoom
                    </label>
                    <span className="text-sm text-gray-500 font-mono">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  
                  {/* Custom Zoom Slider */}
                  <div className="relative">
                    <div 
                      className="w-full h-3 bg-gray-200 rounded-lg relative cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const percentage = x / rect.width;
                        const newZoom = 1 + (percentage * 2); // 1 to 3
                        setZoom(Math.max(1, Math.min(3, newZoom)));
                      }}
                    >
                      <div 
                        className="h-full bg-blue-500 rounded-lg"
                        style={{ width: `${((zoom - 1) / 2) * 100}%` }}
                      />
                      <div 
                        className="absolute top-1/2 w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg transform -translate-y-1/2 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                        style={{ left: `calc(${((zoom - 1) / 2) * 100}% - 12px)` }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setIsDragging(true);
                          setJustFinishedDragging(false);
                          
                          const slider = e.currentTarget.parentElement;
                          if (!slider) return;
                          
                          const handleMouseMove = (moveEvent: MouseEvent) => {
                            const rect = slider.getBoundingClientRect();
                            const x = Math.max(0, Math.min(rect.width, moveEvent.clientX - rect.left));
                            const percentage = x / rect.width;
                            const newZoom = 1 + (percentage * 2);
                            setZoom(Math.max(1, Math.min(3, newZoom)));
                          };
                          
                          const handleMouseUp = () => {
                            setIsDragging(false);
                            setJustFinishedDragging(true);
                            document.removeEventListener('mousemove', handleMouseMove);
                            document.removeEventListener('mouseup', handleMouseUp);
                            
                            // Clear the justFinishedDragging flag after a short delay
                            setTimeout(() => setJustFinishedDragging(false), 100);
                          };
                          
                          document.addEventListener('mousemove', handleMouseMove);
                          document.addEventListener('mouseup', handleMouseUp);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setIsDragging(true);
                          setJustFinishedDragging(false);
                          
                          const slider = e.currentTarget.parentElement;
                          if (!slider) return;
                          
                          const handleTouchMove = (moveEvent: TouchEvent) => {
                            const rect = slider.getBoundingClientRect();
                            const x = Math.max(0, Math.min(rect.width, moveEvent.touches[0].clientX - rect.left));
                            const percentage = x / rect.width;
                            const newZoom = 1 + (percentage * 2);
                            setZoom(Math.max(1, Math.min(3, newZoom)));
                          };
                          
                          const handleTouchEnd = () => {
                            setIsDragging(false);
                            setJustFinishedDragging(true);
                            document.removeEventListener('touchmove', handleTouchMove);
                            document.removeEventListener('touchend', handleTouchEnd);
                            
                            // Clear the justFinishedDragging flag after a short delay
                            setTimeout(() => setJustFinishedDragging(false), 100);
                          };
                          
                          document.addEventListener('touchmove', handleTouchMove);
                          document.addEventListener('touchend', handleTouchEnd);
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={handleCancelCrop}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md border transition-colors order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropComplete}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                    disabled={!croppedAreaPixels}
                  >
                    Apply Crop
                  </button>
                </div>
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
    </div>
  );
}