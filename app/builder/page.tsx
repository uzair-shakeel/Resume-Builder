"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PersonalInfo from "@/components/sections/personal-info";
import Profile from "@/components/sections/profile";
import Education from "@/components/sections/education";
import Experience from "@/components/sections/experience";
import Skills from "@/components/sections/skills";
import Languages from "@/components/sections/languages";
import Interests from "@/components/sections/interests";
import CVPreview from "@/components/cv-preview";
import type { CVData } from "@/types";
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Download,
  GripVertical,
  ZoomIn,
  ZoomOut,
  Maximize,
  Type,
  Palette,
  Layout,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Ruler,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CVPreviewAlt from "@/components/cv-preview-alt";
import CVPreviewPro from "@/components/cv-preview-pro";
import CVPreviewSherlock from "@/components/cv-preview-sherlock";
import CVPreviewHR from "@/components/cv-preview-hr";
import CVPreviewMinimal from "@/components/cv-preview-minimal";
import CVPreviewTeal from "@/components/cv-preview-teal";
import CVPreviewClassic from "@/components/cv-preview-classic";
import CVPreviewStudent from "@/components/cv-preview-student";
import Image from "next/image";

// Font families
const fontFamilies = [
  { name: "DejaVu Sans", value: "'DejaVu Sans', sans-serif" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
  { name: "Calibri", value: "Calibri, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
];

// Font sizes
const fontSizes = [
  { name: "Small", value: "0.875" },
  { name: "Medium", value: "1" },
  { name: "Large", value: "1.125" },
  { name: "X-Large", value: "1.25" },
];

// Color themes
const colorThemes = [
  { name: "Blue", value: "#3498db" },
  { name: "Red", value: "#e74c3c" },
  { name: "Green", value: "#2ecc71" },
  { name: "Purple", value: "#9b59b6" },
  { name: "Orange", value: "#e67e22" },
  { name: "Teal", value: "#2BCBBA" },
  { name: "Pink", value: "#fd79a8" },
  { name: "Gray", value: "#7f8c8d" },
];

// Template options with images and default colors
const templateOptions = [
  {
    name: "Modern",
    value: "modern",
    image: "/assets/resume4.png",
    defaultColor: "#3498db",
  },
  {
    name: "Classic",
    value: "classic",
    image: "/assets/resume2.jpg",
    defaultColor: "#2c3e50",
  },
  {
    name: "Pro",
    value: "pro",
    image: "/assets/resume3.png",
    defaultColor: "#3498db",
  },
  {
    name: "Sherlock",
    value: "sherlock",
    image: "/assets/sherlock-resume.jpg",
    defaultColor: "#34495e",
  },
  {
    name: "HR",
    value: "hr",
    image: "/assets/hr-resume.jpg",
    defaultColor: "#9b59b6",
  },
  {
    name: "Minimal",
    value: "minimal",
    image: "/assets/minimal-resume.jpg",
    defaultColor: "#fd79a8",
  },
  {
    name: "Teal",
    value: "teal",
    image: "/assets/teal-resume.jpg",
    defaultColor: "#2BCBBA",
  },
  {
    name: "Simple Classic",
    value: "simple-classic",
    image: "/assets/classic-resume.jpg",
    defaultColor: "#3498db",
  },
  {
    name: "Student",
    value: "student",
    image: "/assets/student-resume.jpg",
    defaultColor: "#4dabf7",
  },
];

export default function Builder() {
  const searchParams = useSearchParams();
  const initialTemplate =
    (searchParams.get("template") as
      | "modern"
      | "classic"
      | "pro"
      | "sherlock"
      | "hr"
      | "minimal"
      | "teal"
      | "simple-classic") || "modern";

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "personal-info": true,
    profile: false,
    education: false,
    experience: false,
    skills: false,
    languages: false,
    interests: false,
  });

  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      photo: "/placeholder-user.jpg",
    },
    profile: "",
    education: [],
    experience: [],
    skills: [],
    languages: [],
    interests: [],
  });

  const [sectionOrder, setSectionOrder] = useState([
    "personal-info",
    "profile",
    "education",
    "experience",
    "skills",
    "languages",
    "interests",
  ]);

  const [saveFormat, setSaveFormat] = useState<string>("pdf");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<
    | "modern"
    | "classic"
    | "pro"
    | "sherlock"
    | "hr"
    | "minimal"
    | "teal"
    | "simple-classic"
  >(initialTemplate);

  // Add zoom state
  const [zoomLevel, setZoomLevel] = useState(100);

  // Add styling states
  const [fontFamily, setFontFamily] = useState(fontFamilies[0].value);
  const [fontSize, setFontSize] = useState(fontSizes[1].value);
  const [accentColor, setAccentColor] = useState(
    templateOptions.find((t) => t.value === initialTemplate)?.defaultColor ||
      colorThemes[0].value
  );

  // Add state for template carousel
  const [showTemplateCarousel, setShowTemplateCarousel] = useState(false);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(
    templateOptions.findIndex((t) => t.value === template) || 0
  );

  // State to track if we should show dummy data
  // const [showDummyData, setShowDummyData] = useState(true);

  // Add state for page margins
  const [pageMargins, setPageMargins] = useState({
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  });

  // Add state for page break controls
  const [showPageBreakControls, setShowPageBreakControls] = useState(false);
  const [pageBreakSettings, setPageBreakSettings] = useState({
    keepHeadingsWithContent: true,
    avoidOrphanedHeadings: true,
    minLinesBeforeBreak: 3,
  });

  // Add state for download progress
  const [isDownloading, setIsDownloading] = useState(false);

  // Replace the displayData with just cvData
  const displayData = cvData;

  useEffect(() => {
    const templateParam = searchParams.get("template") as
      | "modern"
      | "classic"
      | "pro"
      | "sherlock"
      | "hr"
      | "minimal"
      | "teal"
      | "simple-classic";
    if (templateParam) {
      setTemplate(templateParam);
      const index = templateOptions.findIndex((t) => t.value === templateParam);
      if (index !== -1) {
        setActiveTemplateIndex(index);
        // Set the default color for the selected template if no custom color is set
        if (!localStorage.getItem(`cv-color-${templateParam}`)) {
          setAccentColor(templateOptions[index].defaultColor);
        }
      }
    }
  }, [searchParams]);

  // Save color preference for each template
  useEffect(() => {
    // Load saved color for this template if it exists
    const savedColor = localStorage.getItem(`cv-color-${template}`);
    if (savedColor) {
      setAccentColor(savedColor);
    } else {
      // Use default color for this template
      const defaultColor = templateOptions.find(
        (t) => t.value === template
      )?.defaultColor;
      if (defaultColor) {
        setAccentColor(defaultColor);
      }
    }
  }, [template]);

  // Save color when it changes
  useEffect(() => {
    localStorage.setItem(`cv-color-${template}`, accentColor);
  }, [accentColor, template]);

  const updateCVData = (section: string, data: any) => {
    setCvData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Add zoom functions
  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const handleDownload = async (format: "pdf" | "jpeg" | "png") => {
    if (!previewRef.current) return;

    try {
      setIsDownloading(true);
      const element = previewRef.current;

      // Set a higher scale for better quality
      const scale = 2;

      // A4 dimensions in pixels at 96 DPI
      const a4Width = 210 * 3.78; // 210mm in pixels
      const a4Height = 297 * 3.78; // 297mm in pixels

      // Get the computed margins in pixels
      const marginTop =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--page-margin-top"
          )
        ) * 3.78;
      const marginRight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--page-margin-right"
          )
        ) * 3.78;
      const marginBottom =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--page-margin-bottom"
          )
        ) * 3.78;
      const marginLeft =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--page-margin-left"
          )
        ) * 3.78;

      // Calculate content area dimensions
      const contentWidth = a4Width - marginLeft - marginRight;
      const contentHeight = a4Height - marginTop - marginBottom;

      const canvas = await html2canvas(element, {
        scale: scale,
        width: a4Width / scale,
        height: a4Height / scale,
        windowWidth: a4Width,
        windowHeight: a4Height,
      });

      if (format === "pdf") {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        // Add the image to the PDF, positioning it to account for margins
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

        pdf.save("cv.pdf");
      } else if (format === "jpeg") {
        const link = document.createElement("a");
        link.download = "cv.jpeg";
        link.href = canvas.toDataURL("image/jpeg");
        link.click();
      } else if (format === "png") {
        const link = document.createElement("a");
        link.download = "cv.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (error) {
      console.error("Error generating CV:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = Number.parseInt(
      e.dataTransfer.getData("text/plain"),
      10
    );
    const newOrder = [...sectionOrder];
    const [removed] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    setSectionOrder(newOrder);
  };

  // Template carousel navigation
  const prevTemplate = () => {
    setActiveTemplateIndex((prev) => {
      const newIndex = prev === 0 ? templateOptions.length - 1 : prev - 1;
      setTemplate(templateOptions[newIndex].value as any);
      return newIndex;
    });
  };

  const nextTemplate = () => {
    setActiveTemplateIndex((prev) => {
      const newIndex = prev === templateOptions.length - 1 ? 0 : prev + 1;
      setTemplate(templateOptions[newIndex].value as any);
      return newIndex;
    });
  };

  const selectTemplate = (index: number) => {
    setActiveTemplateIndex(index);
    setTemplate(templateOptions[index].value as any);
    setShowTemplateCarousel(false);
  };

  // Function to handle margin changes
  const handleMarginChange = (
    margin: keyof typeof pageMargins,
    value: number
  ) => {
    setPageMargins((prev) => ({
      ...prev,
      [margin]: value,
    }));
  };

  // Function to handle page break setting changes
  const handlePageBreakSettingChange = (
    setting: keyof typeof pageBreakSettings,
    value: boolean | number
  ) => {
    setPageBreakSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const renderTemplate = () => {
    const pageBreakSettingsProps = {
      keepHeadingsWithContent: pageBreakSettings.keepHeadingsWithContent,
      avoidOrphanedHeadings: pageBreakSettings.avoidOrphanedHeadings,
      minLinesBeforeBreak: pageBreakSettings.minLinesBeforeBreak,
    };

    switch (template) {
      case "modern":
        return (
          <CVPreview
            data={displayData}
            sectionOrder={sectionOrder}
            pageBreakSettings={pageBreakSettingsProps}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        );
      case "classic":
        return (
          <CVPreviewAlt
            data={displayData}
            sectionOrder={sectionOrder}
            pageBreakSettings={pageBreakSettingsProps}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        );
      case "pro":
        return (
          <CVPreviewPro
            data={displayData}
            sectionOrder={sectionOrder}
            pageBreakSettings={pageBreakSettingsProps}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        );
      case "sherlock":
        return (
          <CVPreviewSherlock
            data={displayData}
            sectionOrder={sectionOrder}
            pageBreakSettings={pageBreakSettingsProps}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        );
      case "hr":
        return (
          <CVPreviewHR
            data={displayData}
            sectionOrder={sectionOrder}
            pageBreakSettings={pageBreakSettingsProps}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        );
      case "minimal":
        return (
          <CVPreviewMinimal
            data={displayData}
            sectionOrder={sectionOrder}
            pageBreakSettings={pageBreakSettingsProps}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        );
      case "teal":
        return (
          <CVPreviewTeal
            data={displayData}
            sectionOrder={sectionOrder}
            pageBreakSettings={pageBreakSettingsProps}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        );
      case "simple-classic":
        return (
          <CVPreviewClassic
            data={displayData}
            sectionOrder={sectionOrder}
            pageBreakSettings={pageBreakSettingsProps}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        );
      case "student":
        return (
          <CVPreviewStudent
            data={displayData}
            sectionOrder={sectionOrder}
            pageBreakSettings={pageBreakSettingsProps}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        );
      default:
        return (
          <CVPreview
            data={displayData}
            sectionOrder={sectionOrder}
            pageBreakSettings={pageBreakSettingsProps}
            accentColor={accentColor}
            fontFamily={fontFamily}
          />
        );
    }
  };

  return (
    <main className="flex min-h-screen h-screen overflow-hidden bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">CV Builder</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                {showDownloadOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                    <div className="py-1">
                      <button
                        onClick={() => handleDownload("pdf")}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        Download as PDF
                      </button>
                      <button
                        onClick={() => handleDownload("jpeg")}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        Download as JPEG
                      </button>
                      <button
                        onClick={() => handleDownload("png")}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        Download as PNG
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {sectionOrder.map((section, index) => (
                <div
                  key={section}
                  className="border rounded-md overflow-hidden"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div
                    className="flex items-center justify-between p-4 bg-white cursor-pointer"
                    onClick={() => toggleSection(section)}
                  >
                    <div className="flex items-center">
                      <GripVertical className="w-5 h-5 text-gray-400 mr-2 cursor-move" />
                      <span className="text-gray-400 mr-2">:</span>
                      <h2 className="text-lg font-medium">
                        {getSectionTitle(section)}
                      </h2>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-md hover:bg-gray-100">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      <button className="p-2 rounded-md hover:bg-gray-100">
                        {expandedSections[section] ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  {expandedSections[section] &&
                    renderSectionContent(section, cvData, updateCVData)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-gray-50 flex flex-col">
          {/* Zoom and page controls */}
          <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="p-1 rounded-md hover:bg-gray-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <span className="text-sm font-medium">{zoomLevel}%</span>
              <button
                onClick={zoomIn}
                className="p-1 rounded-md hover:bg-gray-200"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={resetZoom}
                className="p-1 rounded-md hover:bg-gray-200 ml-2"
                title="Fit to Page"
              >
                <Maximize className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPageBreakControls(!showPageBreakControls)}
                className={`flex items-center gap-1 p-1 rounded-md ${
                  showPageBreakControls
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
                title="Page Layout Settings"
              >
                <Ruler className="w-5 h-5" />
                <span className="text-xs font-medium">Page Layout</span>
              </button>
            </div>
          </div>

          {/* Page break controls panel */}
          {showPageBreakControls && (
            <div className="bg-white border-b border-gray-200 p-3 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-2">
                Page Layout Settings
              </h3>

              <div className="space-y-4">
                {/* Margin controls */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Page Margins (mm)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">Top</label>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handleMarginChange(
                              "top",
                              Math.max(pageMargins.top - 5, 0)
                            )
                          }
                          className="p-1 rounded-l border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={pageMargins.top}
                          onChange={(e) =>
                            handleMarginChange(
                              "top",
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-12 text-center border-y border-gray-300 py-1 text-xs"
                        />
                        <button
                          onClick={() =>
                            handleMarginChange("top", pageMargins.top + 5)
                          }
                          className="p-1 rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">Right</label>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handleMarginChange(
                              "right",
                              Math.max(pageMargins.right - 5, 0)
                            )
                          }
                          className="p-1 rounded-l border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={pageMargins.right}
                          onChange={(e) =>
                            handleMarginChange(
                              "right",
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-12 text-center border-y border-gray-300 py-1 text-xs"
                        />
                        <button
                          onClick={() =>
                            handleMarginChange("right", pageMargins.right + 5)
                          }
                          className="p-1 rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">Bottom</label>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handleMarginChange(
                              "bottom",
                              Math.max(pageMargins.bottom - 5, 0)
                            )
                          }
                          className="p-1 rounded-l border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={pageMargins.bottom}
                          onChange={(e) =>
                            handleMarginChange(
                              "bottom",
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-12 text-center border-y border-gray-300 py-1 text-xs"
                        />
                        <button
                          onClick={() =>
                            handleMarginChange("bottom", pageMargins.bottom + 5)
                          }
                          className="p-1 rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">Left</label>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handleMarginChange(
                              "left",
                              Math.max(pageMargins.left - 5, 0)
                            )
                          }
                          className="p-1 rounded-l border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={pageMargins.left}
                          onChange={(e) =>
                            handleMarginChange(
                              "left",
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-12 text-center border-y border-gray-300 py-1 text-xs"
                        />
                        <button
                          onClick={() =>
                            handleMarginChange("left", pageMargins.left + 5)
                          }
                          className="p-1 rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Page break controls */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Page Break Rules
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="keepHeadings"
                        checked={pageBreakSettings.keepHeadingsWithContent}
                        onChange={(e) =>
                          handlePageBreakSettingChange(
                            "keepHeadingsWithContent",
                            e.target.checked
                          )
                        }
                        className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="keepHeadings"
                        className="text-xs text-gray-600"
                      >
                        Keep headings with content
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="avoidOrphans"
                        checked={pageBreakSettings.avoidOrphanedHeadings}
                        onChange={(e) =>
                          handlePageBreakSettingChange(
                            "avoidOrphanedHeadings",
                            e.target.checked
                          )
                        }
                        className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="avoidOrphans"
                        className="text-xs text-gray-600"
                      >
                        Avoid orphaned headings at page bottom
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">
                        Min lines before break
                      </label>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            handlePageBreakSettingChange(
                              "minLinesBeforeBreak",
                              Math.max(
                                1,
                                (pageBreakSettings.minLinesBeforeBreak as number) -
                                  1
                              )
                            )
                          }
                          className="p-1 rounded-l border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={pageBreakSettings.minLinesBeforeBreak}
                          onChange={(e) =>
                            handlePageBreakSettingChange(
                              "minLinesBeforeBreak",
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="w-12 text-center border-y border-gray-300 py-1 text-xs"
                        />
                        <button
                          onClick={() =>
                            handlePageBreakSettingChange(
                              "minLinesBeforeBreak",
                              (pageBreakSettings.minLinesBeforeBreak as number) +
                                1
                            )
                          }
                          className="p-1 rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable preview container */}
          <div className="flex-1 overflow-y-auto flex justify-center">
            <div
              ref={previewRef}
              className="my-8 transform-gpu transition-transform duration-200 w-full"
              style={
                {
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top center",
                  fontFamily: fontFamily,
                  "--accent-color": accentColor,
                  "--page-margin-top": `${pageMargins.top}mm`,
                  "--page-margin-right": `${pageMargins.right}mm`,
                  "--page-margin-bottom": `${pageMargins.bottom}mm`,
                  "--page-margin-left": `${pageMargins.left}mm`,
                } as React.CSSProperties
              }
            >
              {renderTemplate()}
            </div>
          </div>

          {/* Edit bar */}
          <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 p-3 shadow-md">
            {showTemplateCarousel ? (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">Select Template</h3>
                  <button
                    onClick={() => setShowTemplateCarousel(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={prevTemplate}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
                    aria-label="Previous template"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>

                  <div className="flex overflow-x-auto py-2 px-8 gap-4 snap-x">
                    {templateOptions.map((option, index) => (
                      <div
                        key={option.value}
                        className={`flex-none w-32 cursor-pointer transition-all duration-200 ${
                          index === activeTemplateIndex
                            ? "ring-2 ring-blue-500 scale-105"
                            : "hover:scale-105"
                        }`}
                        onClick={() => selectTemplate(index)}
                      >
                        <div className="bg-white rounded-md shadow-sm overflow-hidden">
                          <div className="relative aspect-[0.7]">
                            <Image
                              src={option.image}
                              alt={option.name}
                              fill
                              className="object-cover"
                              sizes="128px"
                            />
                            <div
                              className="absolute bottom-0 left-0 right-0 h-1"
                              style={{ backgroundColor: option.defaultColor }}
                            ></div>
                          </div>
                          <div className="p-2 text-center text-xs font-medium truncate">
                            {option.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={nextTemplate}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
                    aria-label="Next template"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center items-center">
                {/* Template selector */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTemplateCarousel(true)}
                    className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <Layout className="w-5 h-5 text-gray-700" />
                    <span>Templates</span>
                  </button>
                </div>

                {/* Font family selector */}
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-gray-700" />
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ fontFamily: fontFamily }}
                  >
                    {fontFamilies.map((font) => (
                      <option
                        key={font.name}
                        value={font.value}
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color selector */}
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-gray-700" />
                  <div className="relative">
                    <select
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                    >
                      {colorThemes.map((color) => (
                        <option key={color.name} value={color.value}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                    <div
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      // Reset to default color for this template
                      const defaultColor = templateOptions.find(
                        (t) => t.value === template
                      )?.defaultColor;
                      if (defaultColor) {
                        setAccentColor(defaultColor);
                      }
                    }}
                    className="ml-1 p-1 rounded-md hover:bg-gray-100 text-xs text-gray-500"
                    title="Reset to default color"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function getSectionTitle(section: string): string {
  switch (section) {
    case "personal-info":
      return "Personal Information";
    case "profile":
      return "Profile";
    case "education":
      return "Education";
    case "experience":
      return "Professional Experience";
    case "skills":
      return "Skills";
    case "languages":
      return "Languages";
    case "interests":
      return "Interests";
    default:
      return "";
  }
}

function renderSectionContent(
  section: string,
  cvData: CVData,
  updateCVData: (section: string, data: any) => void
) {
  switch (section) {
    case "personal-info":
      return (
        <PersonalInfo
          data={cvData.personalInfo}
          updateData={(data) => updateCVData("personalInfo", data)}
        />
      );
    case "profile":
      return (
        <Profile
          data={cvData.profile}
          updateData={(data) => updateCVData("profile", data)}
        />
      );
    case "education":
      return (
        <Education
          data={cvData.education}
          updateData={(data) => updateCVData("education", data)}
        />
      );
    case "experience":
      return (
        <Experience
          data={cvData.experience}
          updateData={(data) => updateCVData("experience", data)}
        />
      );
    case "skills":
      return (
        <Skills
          data={cvData.skills}
          updateData={(data) => updateCVData("skills", data)}
        />
      );
    case "languages":
      return (
        <Languages
          data={cvData.languages}
          updateData={(data) => updateCVData("languages", data)}
        />
      );
    case "interests":
      return (
        <Interests
          data={cvData.interests}
          updateData={(data) => updateCVData("interests", data)}
        />
      );
    default:
      return null;
  }
}
