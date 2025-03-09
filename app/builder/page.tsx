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
import type { CVData, CustomSectionItem } from "@/types";
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
  Pencil,
  Trash2,
  FileText,
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
import CVPreviewCirculaire from "@/components/cv-preview-circulaire";
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

// Update color themes
const colorThemes = [
  { name: "Blue", value: "#3b82f6" }, // blue-500
  { name: "Red", value: "#ef4444" }, // red-500
  { name: "Green", value: "#22c55e" }, // green-500
  { name: "Purple", value: "#a855f7" }, // purple-500
  { name: "Orange", value: "#f97316" }, // orange-500
  { name: "Teal", value: "#14b8a6" }, // teal-500
  { name: "Pink", value: "#ec4899" }, // pink-500
  { name: "Slate", value: "#64748b" }, // slate-500
];

// Update template options with new default colors
const templateOptions = [
  {
    name: "Modern",
    value: "modern",
    image: "/assets/resume4.png",
    defaultColor: "#3b82f6", // blue-500
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
    image: "/assets/resume3.png",
    defaultColor: "#34495e",
  },
  {
    name: "HR",
    value: "hr",
    image: "/assets/hr-resume.jpg",
    defaultColor: "#9b59b6",
  },
  {
    name: "Circulaire",
    value: "circulaire",
    image: "/assets/circulaire.jpg",
    defaultColor: "#2BCBBA",
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
      | "simple-classic"
      | "circulaire"
      | "student") || "modern";

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
    | "circulaire"
    | "student"
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

  // Add state for section page assignment
  const [sectionPages, setSectionPages] = useState<Record<string, number>>({});

  // Add state for section menu
  const [activeSectionMenu, setActiveSectionMenu] = useState<string | null>(
    null
  );

  // Add state for section renaming
  const [isRenamingSection, setIsRenamingSection] = useState(false);
  const [sectionToRename, setSectionToRename] = useState<string | null>(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [customSectionNames, setCustomSectionNames] = useState<
    Record<string, string>
  >({});

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
      | "simple-classic"
      | "circulaire"
      | "student";
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

      // Get all pages
      const pages = element.querySelectorAll(".cv-page");

      if (format === "pdf") {
        // Create PDF with A4 size
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        // Process each page
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i] as HTMLElement;

          // For pages after the first, add a new page to the PDF
          if (i > 0) {
            pdf.addPage();
          }

          // Capture the page as canvas
          const canvas = await html2canvas(page, {
            scale: 2,
            useCORS: true,
            logging: false,
          });

          // Add to PDF
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
        }

        // Save the PDF
        pdf.save(`cv-${new Date().toISOString().slice(0, 10)}.pdf`);
      } else {
        // For image formats, only capture the first page
        const firstPage = pages[0] as HTMLElement;
        const canvas = await html2canvas(firstPage, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        // Download as image
        const link = document.createElement("a");
        link.download = `cv-${new Date().toISOString().slice(0, 10)}.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, 1.0);
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

  // Function to handle section renaming
  const handleRenameSection = (section: string) => {
    setSectionToRename(section);
    setNewSectionName(customSectionNames[section] || getSectionTitle(section));
    setIsRenamingSection(true);
    setActiveSectionMenu(null);
    // No need to show a modal dialog anymore
  };

  // Function to save renamed section
  const saveRenamedSection = () => {
    if (sectionToRename && newSectionName.trim()) {
      // Only update if the name has changed
      if (newSectionName.trim() !== getSectionTitle(sectionToRename)) {
        setCustomSectionNames((prev) => ({
          ...prev,
          [sectionToRename]: newSectionName.trim(),
        }));
      }
      setIsRenamingSection(false);
      setSectionToRename(null);
      setNewSectionName("");
    } else {
      // If the name is empty, just cancel the renaming
      setIsRenamingSection(false);
      setSectionToRename(null);
      setNewSectionName("");
    }
  };

  // Function to delete a section
  const handleDeleteSection = (section: string) => {
    setSectionOrder((prev) => prev.filter((s) => s !== section));
    setActiveSectionMenu(null);
  };

  // Function to assign section to page 2
  const handleAssignSectionToPage = (section: string, page: number) => {
    setSectionPages((prev) => ({
      ...prev,
      [section]: page,
    }));
    setActiveSectionMenu(null);
  };

  // Function to toggle section menu
  const toggleSectionMenu = (section: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSectionMenu(activeSectionMenu === section ? null : section);
  };

  // Function to get section title with custom names
  const getSectionTitle = (section: string): string => {
    // If there's a custom name for this section, use it
    if (customSectionNames && customSectionNames[section]) {
      return customSectionNames[section];
    }

    // Otherwise use the default name
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
  };

  const renderTemplate = () => {
    // Create props object for page break settings
    const pageBreakSettingsProps = {
      keepHeadingsWithContent: pageBreakSettings.keepHeadingsWithContent,
      avoidOrphanedHeadings: pageBreakSettings.avoidOrphanedHeadings,
      minLinesBeforeBreak: pageBreakSettings.minLinesBeforeBreak,
    };

    // Common props for all templates
    const commonProps = {
      data: displayData,
      sectionOrder,
      pageBreakSettings: pageBreakSettingsProps,
      accentColor,
      fontFamily,
      sectionPages,
      customSectionNames,
    };

    switch (template) {
      case "modern":
        return <CVPreviewAlt {...(commonProps as any)} />;
      case "classic":
        return <CVPreviewClassic {...(commonProps as any)} />;
      case "pro":
        return <CVPreviewPro {...(commonProps as any)} />;
      case "sherlock":
        return <CVPreviewSherlock {...(commonProps as any)} />;
      case "hr":
        return <CVPreviewHR {...(commonProps as any)} />;
      case "minimal":
        return <CVPreviewMinimal {...(commonProps as any)} />;
      case "teal":
        return <CVPreviewTeal {...(commonProps as any)} />;
      case "circulaire":
        return <CVPreviewCirculaire {...(commonProps as any)} />;
      case "student":
        return <CVPreviewStudent {...(commonProps as any)} />;
      default:
        return <CVPreview {...(commonProps as any)} />;
    }
  };

  // Add effect to close section menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Close section menu when clicking outside
      if (activeSectionMenu) {
        const target = e.target as HTMLElement;
        if (!target.closest(".section-menu-container")) {
          setActiveSectionMenu(null);
        }
      }

      // Save section name when clicking outside the input (if renaming)
      if (isRenamingSection && sectionToRename) {
        const target = e.target as HTMLElement;
        const isInputElement = target.tagName.toLowerCase() === "input";
        const isEditingCurrentSection = target.closest(
          `[data-section="${sectionToRename}"]`
        );

        if (!isInputElement || !isEditingCurrentSection) {
          saveRenamedSection();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeSectionMenu, isRenamingSection, sectionToRename]);

  // Load section pages from localStorage
  useEffect(() => {
    const savedSectionPages = localStorage.getItem("cv-section-pages");
    if (savedSectionPages) {
      try {
        setSectionPages(JSON.parse(savedSectionPages));
      } catch (e) {
        console.error("Failed to parse saved section pages", e);
      }
    }
  }, []);

  // Save section pages to localStorage
  useEffect(() => {
    localStorage.setItem("cv-section-pages", JSON.stringify(sectionPages));
  }, [sectionPages]);

  // Load custom section names from localStorage
  useEffect(() => {
    const savedCustomNames = localStorage.getItem("cv-custom-section-names");
    if (savedCustomNames) {
      try {
        setCustomSectionNames(JSON.parse(savedCustomNames));
      } catch (e) {
        console.error("Failed to parse saved custom section names", e);
      }
    }
  }, []);

  // Save custom section names to localStorage
  useEffect(() => {
    localStorage.setItem(
      "cv-custom-section-names",
      JSON.stringify(customSectionNames)
    );
  }, [customSectionNames]);

  // Function to add a new custom section
  const addCustomSection = (sectionName: string) => {
    // Generate a unique ID for the new section
    const sectionId = `custom-${Date.now()}`;

    // Add the section to the section order
    setSectionOrder((prev) => [...prev, sectionId]);

    // Set the custom name for the section
    setCustomSectionNames((prev) => ({
      ...prev,
      [sectionId]: sectionName,
    }));

    // Initialize the section data
    setCvData((prev) => ({
      ...prev,
      [sectionId]: [],
    }));

    // Expand the new section
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: true,
    }));
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
                  data-section={section}
                >
                  <div
                    className="flex items-center justify-between p-4 bg-white cursor-pointer"
                    onClick={() => toggleSection(section)}
                  >
                    <div className="flex items-center">
                      <GripVertical className="w-5 h-5 text-gray-400 mr-2 cursor-move" />
                      <span className="text-gray-400 mr-2">:</span>
                      {isRenamingSection && sectionToRename === section ? (
                        <input
                          type="text"
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveRenamedSection();
                            } else if (e.key === "Escape") {
                              setIsRenamingSection(false);
                              setSectionToRename(null);
                            }
                            e.stopPropagation();
                          }}
                          onBlur={saveRenamedSection}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          className="text-lg font-medium border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-white min-w-[150px] text-gray-900"
                        />
                      ) : (
                        <h2 className="text-lg font-medium">
                          {getSectionTitle(section)}
                          {sectionPages[section] === 2 && (
                            <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              Page 2
                            </span>
                          )}
                        </h2>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <div className="relative">
                        <button
                          className={`p-2 rounded-md ${
                            activeSectionMenu === section
                              ? "bg-gray-200"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={(e) => toggleSectionMenu(section, e)}
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>

                        {/* Section Menu Popup */}
                        {activeSectionMenu === section && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 section-menu-container">
                            <div className="py-1">
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => handleRenameSection(section)}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Rename section
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => handleDeleteSection(section)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete section
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() =>
                                  handleAssignSectionToPage(
                                    section,
                                    sectionPages[section] === 2 ? 1 : 2
                                  )
                                }
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                {sectionPages[section] === 2
                                  ? "Move to page 1"
                                  : "Move to page 2"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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

              {/* Add Section Button */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Add Section
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Certifications",
                    "Projects",
                    "Publications",
                    "Awards",
                    "References",
                    "Volunteer Work",
                    "Custom Section",
                  ].map((sectionName) => (
                    <button
                      key={sectionName}
                      onClick={() => addCustomSection(sectionName)}
                      className="px-3 py-1 text-sm rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      + {sectionName}
                    </button>
                  ))}
                </div>
              </div>
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
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
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
                          className="w-12 text-center border-y border-gray-300 py-1 text-xs text-gray-900"
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
                          className="w-12 text-center border-y border-gray-300 py-1 text-xs text-gray-900"
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
                          className="w-12 text-center border-y border-gray-300 py-1 text-xs text-gray-900"
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
                          className="w-12 text-center border-y border-gray-300 py-1 text-xs text-gray-900"
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
                          className="w-12 text-center border-y border-gray-300 py-1 text-xs text-gray-900"
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

      {/* Section Renaming Dialog - Removed in favor of inline editing */}
    </main>
  );
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
      // Handle custom sections
      if (section.startsWith("custom-")) {
        return (
          <CustomSection
            data={cvData[section] || []}
            updateData={(data) => updateCVData(section, data)}
          />
        );
      }
      return null;
  }
}

// Custom Section Component
function CustomSection({
  data = [],
  updateData,
}: {
  data: CustomSectionItem[];
  updateData: (data: CustomSectionItem[]) => void;
}) {
  const [items, setItems] = useState(data);

  useEffect(() => {
    updateData(items);
  }, [items, updateData]);

  const addItem = () => {
    setItems([...items, { title: "", description: "" }]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 p-4">
      {items.map((item, index) => (
        <div key={index} className="border rounded-md p-3 bg-white">
          <div className="flex justify-between mb-2">
            <input
              type="text"
              value={item.title || ""}
              onChange={(e) => updateItem(index, "title", e.target.value)}
              placeholder="Title"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 font-medium"
            />
            <button
              onClick={() => removeItem(index)}
              className="text-gray-400 hover:text-red-500 ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={item.description || ""}
            onChange={(e) => updateItem(index, "description", e.target.value)}
            placeholder="Description"
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500 min-h-[80px] text-gray-900 bg-white"
          />
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
      >
        + Add Item
      </button>
    </div>
  );
}
