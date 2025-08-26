"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PersonalInfo from "@/components/sections/personal-info";
import Profile from "@/components/sections/profile";
import Education from "@/components/sections/education";
import Experience from "@/components/sections/experience";
import Skills from "@/components/sections/skills";
import Languages from "@/components/sections/languages";
import Interests from "@/components/sections/interests";
import CVPreview from "@/components/cv-templates/cv-preview";
import type { CVData, CustomSectionItem } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
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
  Cloud,
  CloudOff,
  RefreshCw,
  MoveLeft,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CVPreviewAlt from "@/components/cv-templates/cv-preview-alt";
import CVPreviewPro from "@/components/cv-templates/cv-preview-pro";
import CVPreviewSherlock from "@/components/cv-templates/cv-preview-sherlock";
import CVPreviewHR from "@/components/cv-templates/cv-preview-hr";
import CVPreviewMinimal from "@/components/cv-templates/cv-preview-minimal";
import CVPreviewTeal from "@/components/cv-templates/cv-preview-teal";
import CVPreviewClassic from "@/components/cv-templates/cv-preview-classic";
import CVPreviewStudent from "@/components/cv-templates/cv-preview-student";
import CVPreviewCirculaire from "@/components/cv-templates/cv-preview-circulaire";
import Image from "next/image";
import References from "@/components/sections/references";
import Socials from "@/components/sections/socials";
import Link from "next/link";
import { usePayment } from "../contexts/PaymentContext";
import PaymentModal from "../components/payment/PaymentModal";

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
    image: "/assets/modern-cv.svg",
    defaultColor: "#953b2c",
  },
  {
    name: "Classic",
    value: "classic",
    image: "/assets/classic.jpg",
    defaultColor: "#2c3e50",
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
    image: "/assets/hr.jpg",
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
    image: "/assets/teal.jpg",
    defaultColor: "#2BCBBA",
  },
  // {
  //   name: "Simple Classic",
  //   value: "simple-classic",
  //   image: "/assets/classic-resume.jpg",
  //   defaultColor: "#3498db",
  // },
  {
    name: "Student",
    value: "student",
    image: "/assets/student-resume.jpg",
    defaultColor: "#4dabf7",
  },
];

// Function to render section content
function renderSectionContent(
  section: string,
  cvData: CVData,
  updateCVData: (
    section: string,
    data: any,
    options?: { skipUnsavedFlag?: boolean }
  ) => void,
  template: string
) {
  switch (section) {
    case "personal-info":
      return (
        <PersonalInfo
          data={cvData.personalInfo}
          updateData={(data) => updateCVData("personalInfo", data)}
          template={template}
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
    case "references":
      return (
        <References
          data={cvData.references}
          updateData={(data) => updateCVData("references", data)}
        />
      );
    case "socials":
      return (
        <Socials
          data={cvData.socials}
          updateData={(data) => updateCVData("socials", data)}
        />
      );
    default:
      // Handle custom sections
      if (section.startsWith("custom-")) {
        return (
          <CustomSection
            data={cvData[section] || []}
            updateData={(data, options) => updateCVData(section, data, options)}
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
  updateData: (
    data: CustomSectionItem[],
    options?: { skipUnsavedFlag?: boolean }
  ) => void;
}) {
  const [items, setItems] = useState(data);
  const { t } = useLanguage();

  useEffect(() => {
    updateData(items, { skipUnsavedFlag: true });
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
              placeholder={t(
                "site.builder.forms.custom_section_editor.title_placeholder"
              )}
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
            placeholder={t(
              "site.builder.forms.custom_section_editor.description_placeholder"
            )}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500 min-h-[80px] text-gray-900 bg-white"
          />
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
      >
        {t("site.builder.forms.custom_section_editor.add_item")}
      </button>
    </div>
  );
}

// Add this helper function before the Builder component
const getMobileScale = (windowWidth: number) => {
  if (windowWidth < 600) {
    const baseWidth = 600;
    const containerWidth = windowWidth * 0.75; // Since preview takes up half the screen
    const scale = Math.min(containerWidth / baseWidth, 1); // Don't scale up, only down
    // md breakpoint
    return scale; // For small devices
  } else if (windowWidth < 1024) {
    // sm breakpoint
    return 0.75; // For extra small devices
  } else {
    return 0.8;
  }
};

export default function Builder() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cvId = searchParams.get("id");
  const initialTemplate =
    (searchParams.get("template") as
      | "modern"
      | "classic"
      | "sherlock"
      | "hr"
      | "minimal"
      | "teal"
      | "simple-classic"
      | "circulaire"
      | "student") || "modern";
  const { t } = useLanguage();

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // Add save status states
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "error" | "unsaved"
  >("saved");
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Add payment/subscription states
  const [email, setEmail] = useState("");
  const {
    isPaymentModalOpen,
    hasActiveSubscription,
    openPaymentModal,
    closePaymentModal,
    processPayment,
    checkSubscriptionStatus,
  } = usePayment();

  const [cvData, setCVData] = useState<CVData>({
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
    references: [],
    socials: [],
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
  const [downloadStatus, setDownloadStatus] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [showFilenameInput, setShowFilenameInput] = useState(false);
  const [customFilename, setCustomFilename] = useState("");

  // Generate default filename based on user's name
  const getDefaultFilename = () => {
    const firstName = cvData.personalInfo.firstName.trim();
    const lastName = cvData.personalInfo.lastName.trim();
    if (firstName && lastName) {
      return `${firstName}_${lastName}_resume.pdf`;
    } else if (firstName || lastName) {
      return `${firstName || lastName}_resume.pdf`;
    }
    return "resume.pdf";
  };

  // Set default filename when modal opens
  useEffect(() => {
    if (showFilenameInput) {
      setCustomFilename(getDefaultFilename());
    }
  }, [
    showFilenameInput,
    cvData.personalInfo.firstName,
    cvData.personalInfo.lastName,
  ]);

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

  // Add this at the component start
  const initialLoad = useRef(true);

  // Load CV data if editing existing CV
  useEffect(() => {
    const loadCV = async () => {
      try {
        // Try to get CV ID from URL or from sessionStorage
        const urlId = searchParams.get("id");
        const storedId = sessionStorage.getItem("current-cv-id");
        const effectiveCvId = urlId || storedId;

        if (effectiveCvId) {
          // If we have an ID from either source, use it
          try {
            setIsTemplateLoading(true);
            // Update URL if needed to reflect the ID we're using
            if (!urlId && storedId) {
              window.history.replaceState({}, "", `/builder?id=${storedId}`);
            }

            const response = await fetch(`/api/cv/load?cvId=${effectiveCvId}`);
            const data = await response.json();

            if (data.success) {
              console.log(
                `Loaded CV with template: ${
                  data.cv.template || initialTemplate
                }`
              );
              // Store the ID we're working with
              sessionStorage.setItem("current-cv-id", effectiveCvId);

              // Fix for interests using interest property instead of name property
              if (data.cv.data.interests && data.cv.data.interests.length > 0) {
                data.cv.data.interests = data.cv.data.interests.map(
                  (item: any) => {
                    // If the item has interest property but not name property, convert it
                    if (
                      item.interest !== undefined &&
                      item.name === undefined
                    ) {
                      return { name: item.interest };
                    }
                    return item;
                  }
                );
              }

              // Initialize all CV data
              setCVData(data.cv.data);

              // Check for template in URL that might override the saved template
              const urlTemplate = searchParams.get("template") as string;
              let templateToUse = data.cv.template || initialTemplate;

              if (
                urlTemplate &&
                templateOptions.some((t) => t.value === urlTemplate)
              ) {
                console.log(
                  `URL template (${urlTemplate}) overrides saved template (${templateToUse})`
                );
                templateToUse = urlTemplate as any;
              }

              setTemplate(templateToUse);
              setSectionOrder(
                data.cv.sectionOrder || [
                  "personal-info",
                  "profile",
                  "education",
                  "experience",
                  "skills",
                  "languages",
                  "interests",
                ]
              );
              setAccentColor(data.cv.accentColor || colorThemes[0].value);
              setFontFamily(data.cv.fontFamily || fontFamilies[0].value);
              setCustomSectionNames(data.cv.customSectionNames || {});
              setSectionPages(data.cv.sectionPages || {});

              // Set active template index
              const templateIndex = templateOptions.findIndex(
                (t) => t.value === templateToUse
              );
              if (templateIndex !== -1) {
                setActiveTemplateIndex(templateIndex);
              }

              // Expand sections that have data
              const sectionsWithData = Object.entries(
                data.cv.data || {}
              ).reduce((acc, [section, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                  acc[section] = true;
                } else if (typeof value === "string" && value.trim() !== "") {
                  acc[section] = true;
                } else if (
                  value &&
                  typeof value === "object" &&
                  Object.values(value).some((v) => v !== "")
                ) {
                  acc[section] = true;
                }
                return acc;
              }, {} as Record<string, boolean>);

              setExpandedSections((prev) => ({
                ...prev,
                ...sectionsWithData,
              }));

              // If URL template differs from saved template, save the changes
              if (urlTemplate && urlTemplate !== data.cv.template) {
                // Wait for state updates to complete
                setTimeout(() => {
                  saveCV().then(() => {
                    setIsTemplateLoading(false);
                  });
                }, 300);
              } else {
                // Give time for everything to load before hiding the loading indicator
                setTimeout(() => {
                  setIsTemplateLoading(false);
                }, 500);
              }
            } else {
              console.error("Failed to load CV:", data.error);
              setSaveStatus("error");
              setIsTemplateLoading(false);
            }
          } catch (error) {
            console.error("Error loading CV:", error);
            setSaveStatus("error");
            setIsTemplateLoading(false);
            // If loading fails, clear the stored ID to start fresh
            sessionStorage.removeItem("current-cv-id");
          }
        } else {
          // If creating a new CV, initialize with empty data
          setCVData({
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
            references: [],
            socials: [],
          });

          // Check if we have a template in the URL
          const urlTemplate = searchParams.get("template") as string;
          if (
            urlTemplate &&
            templateOptions.some((t) => t.value === urlTemplate)
          ) {
            console.log(`Setting initial template from URL: ${urlTemplate}`);
            setTemplate(urlTemplate as any);
            const templateIndex = templateOptions.findIndex(
              (t) => t.value === urlTemplate
            );
            if (templateIndex !== -1) {
              setActiveTemplateIndex(templateIndex);
            }
          }

          // Create a new CV immediately to ensure a consistent document
          createNewCV();
        }
      } catch (error) {
        console.error("Error in loadCV:", error);
      }
    };

    loadCV();
  }, [cvId, initialTemplate, searchParams]);

  // Function to create a new CV
  const createNewCV = async () => {
    try {
      setSaveStatus("saving");

      // Clear any existing CV ID from session storage
      sessionStorage.removeItem("current-cv-id");

      // Ensure language levels are text strings
      const processedCVData = { ...cvData };
      if (processedCVData.languages && processedCVData.languages.length > 0) {
        processedCVData.languages = processedCVData.languages.map(
          (lang: any) => {
            if (typeof lang.level === "number") {
              // Convert numeric level to text
              const levelMap: { [key: number]: string } = {
                1: "Elementary",
                2: "Limited Working",
                3: "Professional Working",
                4: "Full Professional",
                5: "Native/Bilingual",
              };
              return {
                ...lang,
                level: levelMap[lang.level] || "Professional Working",
              };
            }
            return lang;
          }
        );
      }

      const response = await fetch("/api/cv/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled CV",
          data: processedCVData,
          template,
          sectionOrder,
          accentColor,
          fontFamily,
          customSectionNames,
          sectionPages,
          lastEdited: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus("saved");
        // Store the new CV ID in session storage
        sessionStorage.setItem("current-cv-id", data.cv._id);
        // Update the URL with the new CV ID
        window.history.replaceState({}, "", `/builder?id=${data.cv._id}`);
      } else {
        setSaveStatus("error");
        console.error("Error creating new CV:", data.error);
      }
    } catch (error) {
      console.error("Error creating new CV:", error);
      setSaveStatus("error");
    }
  };

  // Add reference for save status timeout
  const saveStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhance CV saving function
  const saveCV = async () => {
    // Set save status to saving
    setSaveStatus("saving");

    // Set a safety timeout to reset saving status if it gets stuck
    if (saveStatusTimeoutRef.current) {
      clearTimeout(saveStatusTimeoutRef.current);
    }
    saveStatusTimeoutRef.current = setTimeout(() => {
      console.warn(
        "Save operation timeout reached, forcing reset of save status"
      );
      setSaveStatus("saved");
    }, 15000); // 15 seconds timeout for save operation

    try {
      // Get the current CV ID from sessionStorage or URL
      const currentCvId =
        searchParams.get("id") || sessionStorage.getItem("current-cv-id");

      // Generate preview image
      const previewElement = document.querySelector(
        ".cv-preview"
      ) as HTMLElement;

      let preview = "";
      if (previewElement) {
        try {
          const canvas = await html2canvas(previewElement, {
            scale: 0.5,
            logging: false,
          });
          preview = canvas.toDataURL("image/jpeg", 0.3);
        } catch (error) {
          console.error("Error generating preview image:", error);
          // Continue without the preview if it fails
        }
      }

      // Process CV data to ensure proper format
      const processedCVData = { ...cvData };

      // Fix interests format
      if (processedCVData.interests && processedCVData.interests.length > 0) {
        processedCVData.interests = processedCVData.interests.map(
          (item: any) => {
            if (item.interest !== undefined && item.name === undefined) {
              return { name: item.interest };
            }
            return item;
          }
        );
      }

      // Fix language levels format
      if (processedCVData.languages && processedCVData.languages.length > 0) {
        processedCVData.languages = processedCVData.languages.map(
          (lang: any) => {
            if (typeof lang.level === "number") {
              // Convert numeric level to text
              const levelMap: { [key: number]: string } = {
                1: "Elementary",
                2: "Limited Working",
                3: "Professional Working",
                4: "Full Professional",
                5: "Native/Bilingual",
              };
              return {
                ...lang,
                level: levelMap[lang.level] || "Professional Working",
              };
            }
            return lang;
          }
        );
      }

      // Prepare payload with data from the current component state
      // For existing CVs, don't include title to preserve the existing one
      // Only set title for new CVs
      const payload: any = {
        cvId: currentCvId,
        data: processedCVData,
        template,
        sectionOrder,
        accentColor,
        fontFamily,
        customSectionNames,
        sectionPages,
        preview,
      };

      // Only set title for new CVs (when there's no currentCvId)
      if (!currentCvId) {
        payload.title = processedCVData.personalInfo.firstName
          ? `${processedCVData.personalInfo.firstName}${
              processedCVData.personalInfo.lastName
                ? " " + processedCVData.personalInfo.lastName
                : ""
            }'s CV`
          : "Untitled CV";
      }

      // Send API request
      const response = await fetch("/api/cv/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save CV");
      }

      const result = await response.json();
      console.log("CV Saved Successfully:", result);

      // Update session storage and URL with the CV ID
      if (result.cv && result.cv._id) {
        sessionStorage.setItem("current-cv-id", result.cv._id);

        // Update URL if needed
        if (!currentCvId || currentCvId !== result.cv._id) {
          window.history.replaceState({}, "", `/builder?id=${result.cv._id}`);
        }
        setActiveSectionMenu(null); // Close any open section menu after save
        setSaveStatus("saved");
      }

      // Clear the save status timeout since save completed
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
        saveStatusTimeoutRef.current = null;
      }

      // Update save status and CV ID if needed
      setSaveStatus("saved");

      // Verify the template was saved correctly
      const urlTemplate = new URL(window.location.href).searchParams.get(
        "template"
      );
      if (urlTemplate !== template) {
        console.warn(
          `Template mismatch after save. URL: ${urlTemplate}, State: ${template}`
        );
        // Force URL update to match current template
        const fixUrl = new URL(window.location.href);
        fixUrl.searchParams.set("template", template);
        window.history.replaceState({}, "", fixUrl.toString());
      }

      return result;
    } catch (error) {
      console.error("Error saving CV:", error);
      setSaveStatus("error");

      // Clear the save status timeout since we have an error state now
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
        saveStatusTimeoutRef.current = null;
      }

      // Auto-reset error state after 5 seconds
      setTimeout(() => {
        setSaveStatus("saved");
      }, 5000);

      throw error;
    }
  };

  // No auto-save functionality - manual save only

  // Add a new manual save function
  const handleManualSave = () => {
    setSaveStatus("saving");
    saveCV()
      .then(() => {
        setActiveSectionMenu(null); // Close any open section menu
        setSaveStatus("saved");
      })
      .catch((error) => {
        setSaveStatus("error");
        console.error("Manual save failed:", error);
      });
  };

  // Batch update for multiple fields to reduce save frequency
  const batchUpdateCVData = (updates: Record<string, any>) => {
    setCVData((prev) => {
      const newData = { ...prev };

      // Apply all updates at once
      Object.entries(updates).forEach(([section, data]) => {
        newData[section] = data;
      });

      return newData;
    });

    // Set status to unsaved
    if (saveStatus === "saved") {
      setSaveStatus("unsaved");
    }
  };

  // Update CV data - manual save only, no auto-save
  const updateCVData = (
    section: string,
    data: any,
    options?: { skipUnsavedFlag?: boolean }
  ) => {
    setCVData((prev) => {
      const newData = {
        ...prev,
        [section]: data,
      };
      return newData;
    });

    // Always set to unsaved when data changes (unless explicitly skipped)
    if (!options?.skipUnsavedFlag) {
      setSaveStatus("unsaved");
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Template loading state for UI feedback
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);

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

  const handleDownload = async (format: "pdf", filename?: string) => {
    if (!previewRef.current) return;

    try {
      setIsDownloading(true);

      // Show initial status message
      setVerificationStatus("Verifying subscription status...");

      // Direct server-side verification instead of relying on client state
      // This is more secure and reliable
      const verifyResponse = await fetch("/api/subscription/verify-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify({
          downloadType: "cv",
          timestamp: Date.now(), // Add timestamp to prevent caching
        }),
        cache: "no-store",
      });

      if (!verifyResponse.ok) {
        console.error(
          "Failed to verify download eligibility:",
          await verifyResponse.text()
        );
        setIsDownloading(false);
        openPaymentModal("cv");
        return;
      }

      const verifyData = await verifyResponse.json();

      // Check if verification was successful
      if (!verifyData.success || !verifyData.hasActiveSubscription) {
        console.warn(
          "Download verification failed:",
          verifyData.message || "No active subscription found"
        );
        setIsDownloading(false);
        openPaymentModal("cv");
        return;
      }

      // If we get here, the user is verified and can download
      setVerificationStatus("Subscription verified. Preparing document...");
      setDownloadStatus("Preparing document...");

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

          setDownloadStatus(`Capturing page ${i + 1} of ${pages.length}...`);

          // For pages after the first, add a new page to the PDF
          if (i > 0) {
            pdf.addPage();
          }

          // Wait for all images to load before capturing
          await Promise.all(
            Array.from(page.getElementsByTagName("img")).map(
              (img) =>
                new Promise((resolve) => {
                  if (img.complete) {
                    resolve(null);
                  } else {
                    img.onload = () => resolve(null);
                    img.onerror = () => resolve(null);
                  }
                })
            )
          );

          // Clone the page and prepare it for capture
          const clone = page.cloneNode(true) as HTMLElement;
          clone.style.transform = "none";
          clone.style.position = "fixed";
          clone.style.top = "0";
          clone.style.left = "0";
          clone.style.margin = "0";
          clone.style.padding = "0";
          clone.style.width = "210mm";
          clone.style.height = "297mm";
          clone.style.setProperty("--accent-color", accentColor);
          document.body.appendChild(clone);

          // Capture the page as canvas with improved settings
          const canvas = await html2canvas(clone, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            foreignObjectRendering: true,
            logging: false,
            imageTimeout: 15000,
            onclone: (clonedDoc) => {
              // Ensure all fonts are loaded
              const fontElements = clonedDoc.querySelectorAll("*");
              fontElements.forEach((el: Element) => {
                if (el instanceof HTMLElement) {
                  el.style.fontFamily = "'Arial', 'Helvetica', sans-serif";
                }
              });
            },
          });

          // Remove the clone after capture
          document.body.removeChild(clone);

          setDownloadStatus(`Processing page ${i + 1}...`);

          // Add to PDF with maximum quality settings
          const imgData = canvas.toDataURL("image/png", 1.0); // Using PNG for lossless quality
          pdf.addImage(imgData, "PNG", 0, 0, 210, 297, undefined, "SLOW"); // Using SLOW for better quality
        }

        setDownloadStatus("Finalizing your download...");

        // Save the PDF
        pdf.save(filename || "resume.pdf");

        // Update client-side subscription info after successful download
        await checkSubscriptionStatus(true);
      }
    } catch (error) {
      console.error("Error generating CV:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Update the handlePaymentSuccess function to match the new payment system
  const handlePaymentSuccess = async () => {
    // After successful payment, generate the PDF
    await handleDownload("pdf", "resume.pdf");
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
    // Use the translation system to get the correct section name based on the current language
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

    // Mark as unsaved when changing section page assignment
    setSaveStatus("unsaved");
  };

  // State to track menu position
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const toggleSectionMenu = (section: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (activeSectionMenu === section) {
      setActiveSectionMenu(null);
    } else {
      // Calculate position before showing the menu
      const buttonRect = (
        e.currentTarget as HTMLElement
      ).getBoundingClientRect();
      const left = buttonRect.right - 192; // 12rem = 192px
      const top = buttonRect.bottom + 10;

      // Set the position first
      setMenuPosition({ top, left });

      // Then show the menu
      setActiveSectionMenu(section);
    }
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
        return t("site.builder.sections.names.personal_info");
      case "profile":
        return t("site.builder.sections.names.profile");
      case "education":
        return t("site.builder.sections.names.education");
      case "experience":
        return t("site.builder.sections.names.experience");
      case "skills":
        return t("site.builder.sections.names.skills");
      case "languages":
        return t("site.builder.sections.names.languages");
      case "interests":
        return t("site.builder.sections.names.interests");
      case "references":
        return t("site.builder.sections.names.references");
      case "socials":
        return t("site.builder.sections.names.socials");
      default:
        // For custom sections, use the custom name if available
        if (section.startsWith("custom-") && customSectionNames[section]) {
          return customSectionNames[section];
        }
        return "";
    }
  };

  const renderTemplate = () => {
    const { language } = useLanguage();

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
      language,
    };

    // Log current template being rendered
    console.log(`Rendering template: ${template}`);

    switch (template) {
      case "modern":
        return <CVPreviewAlt {...(commonProps as any)} />;
      case "classic":
        return <CVPreviewClassic {...(commonProps as any)} />;
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
        console.log(`Using default template for ${template}`);
        return <CVPreview {...(commonProps as any)} />;
    }
  };

  // Add effect to close section menu and download modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Close section menu when clicking outside
      if (activeSectionMenu) {
        const target = e.target as HTMLElement;
        if (!target.closest(".section-menu-container")) {
          setActiveSectionMenu(null);
        }
      }

      // Close download modal when clicking outside
      if (showDownloadOptions) {
        const target = e.target as HTMLElement;
        if (!target.closest(".download-modal-container")) {
          setShowDownloadOptions(false);
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
  }, [
    activeSectionMenu,
    showDownloadOptions,
    isRenamingSection,
    sectionToRename,
  ]);

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

    // Get the translated section name based on the current language
    let translatedSectionName = "";

    // Map the English section name to the translation key
    const sectionNameToKey: Record<string, string> = {
      Certifications: "certifications",
      Projects: "projects",
      Publications: "publications",
      Awards: "awards",
      References: "references",
      "Volunteer Work": "volunteer_work",
      "Custom Section": "custom_section",
    };

    // Get the translation key for this section name
    const translationKey = sectionNameToKey[sectionName];

    if (translationKey) {
      // Use the translation system to get the localized name
      translatedSectionName = t(
        `site.builder.custom_sections.options.${translationKey}`
      );
    } else {
      // Fallback to the provided name if no translation is found
      translatedSectionName = sectionName;
    }

    // Set the custom name for the section using the translated name
    setCustomSectionNames((prev) => ({
      ...prev,
      [sectionId]: translatedSectionName,
    }));

    // Initialize the section data
    setCVData((prev) => ({
      ...prev,
      [sectionId]: [],
    }));

    // Expand the new section
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: true,
    }));

    // Mark as unsaved when adding a new section
    setSaveStatus("unsaved");
  };

  // Add effect to conditionally add References and Socials sections for Sherlock template
  useEffect(() => {
    if (template === "sherlock") {
      // Check if references and socials are already in the section order
      const hasReferences = sectionOrder.includes("references");
      const hasSocials = sectionOrder.includes("socials");

      // If not, add them
      if (!hasReferences || !hasSocials) {
        const newSectionOrder = [...sectionOrder];

        if (!hasReferences) {
          newSectionOrder.push("references");
        }

        if (!hasSocials) {
          newSectionOrder.push("socials");
        }

        setSectionOrder(newSectionOrder);
      }
    } else {
      // If not using Sherlock template, remove references and socials from section order
      // but keep the data in case user switches back to Sherlock
      setSectionOrder((prev) =>
        prev.filter(
          (section) => section !== "references" && section !== "socials"
        )
      );
    }
  }, [template, sectionOrder]);

  // Add these state and effect after other state declarations
  const [screenBasedScale, setScreenBasedScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      // Base width is 800px (typical CV width)
      const baseWidth = 800;
      const containerWidth = window.innerWidth * 0.49; // Since preview takes up half the screen
      const scale = Math.min(containerWidth / baseWidth, 1); // Don't scale up, only down
      setScreenBasedScale(scale);
    };

    // Initial calculation
    updateScale();

    // Update on resize
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Add margin change handlers
  const handleRightMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMarginChange("right", Math.max(0, parseInt(e.target.value) || 0));
  };

  const handleBottomMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMarginChange("bottom", Math.max(0, parseInt(e.target.value) || 0));
  };

  const handleLeftMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMarginChange("left", Math.max(0, parseInt(e.target.value) || 0));
  };

  const handleMinLinesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePageBreakSettingChange(
      "minLinesBeforeBreak",
      Math.max(1, parseInt(e.target.value) || 1)
    );
  };

  const handleTopMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleMarginChange("top", Math.max(0, parseInt(e.target.value) || 0));
  };

  // Throttled input handler for text fields
  const throttledInputRef = useRef<{
    timeout: NodeJS.Timeout | null;
    value: string;
    section: string;
    field: string;
  }>({
    timeout: null,
    value: "",
    section: "",
    field: "",
  });

  const handleThrottledInput = (
    section: string,
    field: string,
    value: string,
    data: any
  ) => {
    // Clear any existing timeout
    if (throttledInputRef.current.timeout) {
      clearTimeout(throttledInputRef.current.timeout);
    }

    // Store the current value
    throttledInputRef.current = {
      timeout: null,
      value,
      section,
      field,
    };

    // Update the UI immediately without saving
    setCVData((prev) => {
      const newData = { ...prev };
      if (typeof data === "object" && field) {
        newData[section] = {
          ...newData[section],
          [field]: value,
        };
      } else {
        newData[section] = value;
      }
      return newData;
    });

    // Set status to unsaved
    if (saveStatus === "saved") {
      setSaveStatus("unsaved");
    }

    // Set a timeout to update the local state only (no saving)
    throttledInputRef.current.timeout = setTimeout(() => {
      // Only update if the value is still the same
      if (throttledInputRef.current.value === value) {
        if (typeof data === "object" && field) {
          const updatedData = {
            ...data,
            [field]: value,
          };
          // Just update state without saving
          setCVData((prev) => ({
            ...prev,
            [section]: updatedData,
          }));
        } else {
          // Just update state without saving
          setCVData((prev) => ({
            ...prev,
            [section]: value,
          }));
        }
      }
    }, 1000);
  };

  const handleBackToDashboard = () => {
    // If there are unsaved changes, save before navigating
    if (saveStatus === "unsaved") {
      setSaveStatus("saving");

      // Save the CV before navigating
      saveCV()
        .then(() => {
          // Clear session storage if navigating away completely
          sessionStorage.removeItem("current-cv-id");
          // Use window.location.href for a hard navigation
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          console.error("Error saving before navigation:", error);
          // Navigate anyway even if save fails
          sessionStorage.removeItem("current-cv-id");
          window.location.href = "/dashboard";
        });
    } else {
      // If no unsaved changes, just navigate
      sessionStorage.removeItem("current-cv-id");
      window.location.href = "/dashboard";
    }
  };

  // Add this new state near other state declarations
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Add this handler near other handlers
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // Add this new state
  const [mobileScale, setMobileScale] = useState(0.8);

  // Add this effect to handle mobile scaling
  useEffect(() => {
    const handleResize = () => {
      const scale = getMobileScale(window.innerWidth);
      setMobileScale(scale);
    };

    // Initial calculation
    handleResize();

    // Update on resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add function to reload saved data from database
  const reloadSavedData = async () => {
    try {
      const currentCvId =
        searchParams.get("id") || sessionStorage.getItem("current-cv-id");
      if (currentCvId) {
        const response = await fetch(`/api/cv/load?cvId=${currentCvId}`);
        const data = await response.json();

        if (data.success) {
          // Fix for interests using interest property instead of name property
          if (data.cv.data.interests && data.cv.data.interests.length > 0) {
            data.cv.data.interests = data.cv.data.interests.map((item: any) => {
              if (item.interest !== undefined && item.name === undefined) {
                return { name: item.interest };
              }
              return item;
            });
          }

          // Reload the saved CV data
          setCVData(data.cv.data);
          setSaveStatus("saved");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error reloading saved data:", error);
      return false;
    }
  };

  // Template change functions that handle unsaved data properly
  const prevTemplate = () => {
    if (isTemplateLoading) return;

    const currentIndex = activeTemplateIndex;
    const newIndex =
      currentIndex === 0 ? templateOptions.length - 1 : currentIndex - 1;
    const selectedTemplateValue = templateOptions[newIndex].value as any;

    // If there are unsaved changes, reload saved data to prevent data inconsistency
    if (saveStatus === "unsaved") {
      reloadSavedData().then(() => {
        // Update URL and state after reloading data
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("template", selectedTemplateValue);
        window.history.replaceState({}, "", currentUrl.toString());

        setActiveTemplateIndex(newIndex);
        setTemplate(selectedTemplateValue);
        setSaveStatus("saved"); // Keep as saved since we reloaded saved data
      });
    } else {
      // No unsaved changes, just change template
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("template", selectedTemplateValue);
      window.history.replaceState({}, "", currentUrl.toString());

      setActiveTemplateIndex(newIndex);
      setTemplate(selectedTemplateValue);
    }
  };

  const nextTemplate = () => {
    if (isTemplateLoading) return;

    const currentIndex = activeTemplateIndex;
    const newIndex =
      currentIndex === templateOptions.length - 1 ? 0 : currentIndex + 1;
    const selectedTemplateValue = templateOptions[newIndex].value as any;

    // If there are unsaved changes, reload saved data to prevent data inconsistency
    if (saveStatus === "unsaved") {
      reloadSavedData().then(() => {
        // Update URL and state after reloading data
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("template", selectedTemplateValue);
        window.history.replaceState({}, "", currentUrl.toString());

        setActiveTemplateIndex(newIndex);
        setTemplate(selectedTemplateValue);
        setSaveStatus("saved"); // Keep as saved since we reloaded saved data
      });
    } else {
      // No unsaved changes, just change template
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("template", selectedTemplateValue);
      window.history.replaceState({}, "", currentUrl.toString());

      setActiveTemplateIndex(newIndex);
      setTemplate(selectedTemplateValue);
    }
  };

  const selectTemplate = (index: number) => {
    if (isTemplateLoading) return;

    const selectedTemplateValue = templateOptions[index].value as any;

    // If there are unsaved changes, reload saved data to prevent data inconsistency
    if (saveStatus === "unsaved") {
      reloadSavedData().then(() => {
        // Update URL and state after reloading data
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("template", selectedTemplateValue);
        window.history.replaceState({}, "", currentUrl.toString());

        setTemplate(selectedTemplateValue);
        setActiveTemplateIndex(index);
        setShowTemplateCarousel(false);
        setSaveStatus("saved"); // Keep as saved since we reloaded saved data
      });
    } else {
      // No unsaved changes, just change template
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("template", selectedTemplateValue);
      window.history.replaceState({}, "", currentUrl.toString());

      setTemplate(selectedTemplateValue);
      setActiveTemplateIndex(index);
      setShowTemplateCarousel(false);
    }
  };

  // Simplified URL template change handler
  useEffect(() => {
    const templateParam = searchParams.get("template") as
      | "modern"
      | "classic"
      | "sherlock"
      | "hr"
      | "minimal"
      | "teal"
      | "simple-classic"
      | "circulaire"
      | "student";

    if (templateParam && templateParam !== template) {
      const index = templateOptions.findIndex((t) => t.value === templateParam);

      if (index !== -1) {
        setTemplate(templateParam);
        setActiveTemplateIndex(index);

        // Set the default color for the selected template if no custom color is set
        if (!localStorage.getItem(`cv-color-${templateParam}`)) {
          setAccentColor(templateOptions[index].defaultColor);
        }

        setSaveStatus("unsaved");
      }
    }
  }, [searchParams, template, templateOptions]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear save status timeout
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }

      // Clear save timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Then add a DownloadingOverlay component before the return statement
  const DownloadingOverlay = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-100 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center max-w-md">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-6" />
        <p className="text-xl font-medium text-gray-800">
          {t("site.builder.pdf_generation.generating_pdf")}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-full"></div>
        </div>
        <p className="text-sm text-gray-600 mb-4 text-center">
          {verificationStatus ||
            t("site.builder.pdf_generation.may_take_moments")}
        </p>
        <p className="text-xs text-gray-500 text-center">
          Please don't refresh the page or close the window during this process.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50">
      {isDownloading && <DownloadingOverlay />}
      {showFilenameInput && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Enter PDF Filename
            </h3>
            <input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder={getDefaultFilename()}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              autoFocus
            />
            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  setShowFilenameInput(false);
                  setCustomFilename("");
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const filename =
                    customFilename.trim() || getDefaultFilename();
                  if (!filename.endsWith(".pdf")) {
                    setCustomFilename(filename + ".pdf");
                  }
                  setShowFilenameInput(false);
                  handleDownload("pdf", filename);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="flex min-h-screen h-screen overflow-hidden bg-gray-50">
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Form */}
          <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-200 bg-white">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center gap-2">
              <div className="flex items-center lg:gap-4 gap-2">
                <button
                  onClick={handleBackToDashboard}
                  className="min-w-[30px] min-h-[30px] flex items-center justify-center rounded-[5px] bg-gray-100 hover:bg-gray-200"
                >
                  <MoveLeft size={18} />
                </button>
                <h1 className="text-xl font-bold">
                  {t("site.builder.header.title")}
                </h1>
                {/* Save status indicator */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleManualSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none
                      ${
                        saveStatus === "saved"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : ""
                      }
                      ${
                        saveStatus === "unsaved"
                          ? "bg-orange-500 text-white hover:bg-orange-600 animate-pulse"
                          : ""
                      }
                      ${
                        saveStatus === "saving"
                          ? "bg-gray-400 text-white cursor-wait"
                          : ""
                      }
                      ${
                        saveStatus === "error"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : ""
                      }
                    `}
                    disabled={saveStatus === "saving"}
                    title={
                      saveStatus === "saved"
                        ? t("site.builder.header.save")
                        : saveStatus === "unsaved"
                        ? t("site.builder.header.save_changes")
                        : saveStatus === "saving"
                        ? t("site.builder.header.saving")
                        : t("site.builder.header.retry_save")
                    }
                  >
                    {saveStatus === "saving" ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : saveStatus === "error" ? (
                      <CloudOff className="w-5 h-5" />
                    ) : saveStatus === "unsaved" ? (
                      <Cloud className="w-5 h-5" />
                    ) : (
                      <Cloud className="w-5 h-5" />
                    )}
                    <span className="sm:block hidden">
                      {saveStatus === "saved"
                        ? t("site.builder.header.save")
                        : saveStatus === "unsaved"
                        ? t("site.builder.header.save_changes") + " ✓"
                        : saveStatus === "saving"
                        ? t("site.builder.header.saving")
                        : t("site.builder.header.retry_save")}
                    </span>
                  </button>
                </div>
                {/* Link to Cover Letter Builder */}
                <a
                  href="/builder/cover-letter"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm sm:inline-flex hidden"
                >
                  <FileText className="w-4 h-4" />
                  {t("site.builder.header.cover_letter")}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Download className="w-4 sm:h-4 h-[20px]" />
                    <span className="sm:block hidden">
                      {t("site.builder.header.download")}
                    </span>
                  </button>
                  {showDownloadOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 download-modal-container">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowFilenameInput(true);
                            setShowDownloadOptions(false);
                          }}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          {t("site.builder.header.download_as_pdf")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto lg:max-w-full max-w-[700px] mx-auto">
              <div className="md:p-4 p-2 space-y-4">
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
                          <h2 className="md:text-lg font-medium">
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
                            className={`md:p-2 p-1 rounded-md ${
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
                            <div
                              className="fixed z-[100] bg-white rounded-md shadow-lg border border-gray-200 section-menu-container"
                              style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                                width: "12rem",
                              }}
                            >
                              <div className="py-1">
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleRenameSection(section)}
                                >
                                  <Pencil className="w-4 h-4 mr-2" />
                                  {t(
                                    "site.builder.sections.actions.rename_section"
                                  )}
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleDeleteSection(section)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {t(
                                    "site.builder.sections.actions.delete_section"
                                  )}
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
                                    ? t(
                                        "site.builder.sections.actions.move_to_page_1"
                                      )
                                    : t(
                                        "site.builder.sections.actions.move_to_page_2"
                                      )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <button className="md:p-2 p-1 rounded-md hover:bg-gray-100">
                          {expandedSections[section] ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                    {expandedSections[section] &&
                      renderSectionContent(
                        section,
                        cvData,
                        updateCVData,
                        template
                      )}
                  </div>
                ))}

                {/* Add Section Button */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {t("site.builder.sections.actions.add_section")}
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
                        className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <span className="mr-1">+</span>{" "}
                        {t(
                          `site.builder.custom_sections.options.${sectionName
                            .toLowerCase()
                            .replace(/\s+/g, "_")}`
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modified Right Panel with Drawer functionality */}
          <div className="w-1/2 bg-gray-50 hidden lg:flex flex-col">
            {/* Zoom and page controls */}
            <div className="sticky top-0 z-10 py-5 bg-white border-b border-gray-200 p-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={zoomOut}
                  className="p-1 rounded-md hover:bg-gray-200"
                  title={t("site.builder.tooltips.zoom_out")}
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
                </button>
                <span className="text-sm font-medium">{zoomLevel}%</span>
                <button
                  onClick={zoomIn}
                  className="p-1 rounded-md hover:bg-gray-200"
                  title={t("site.builder.tooltips.zoom_in")}
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={resetZoom}
                  className="p-1 rounded-md hover:bg-gray-200 ml-2"
                  title={t("site.builder.tooltips.fit_to_page")}
                >
                  <Maximize className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Page break controls panel */}
            {showPageBreakControls && (
              <div className="bg-gray-200 border-b border-gray-200 p-3 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-2">
                  {t("site.builder.page_layout.page_layout_settings")}
                </h3>

                <div className="space-y-4">
                  {/* Margin controls */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {t("site.builder.page_layout.page_margins")}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-600">
                          {t("site.builder.page_layout.top")}
                        </label>
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
                            onChange={handleTopMarginChange}
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
                        <label className="text-xs text-gray-600">
                          {t("site.builder.page_layout.right")}
                        </label>
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
                            onChange={handleRightMarginChange}
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
                        <label className="text-xs text-gray-600">
                          {t("site.builder.page_layout.bottom")}
                        </label>
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
                            onChange={handleBottomMarginChange}
                            className="w-12 text-center border-y border-gray-300 py-1 text-xs text-gray-900"
                          />
                          <button
                            onClick={() =>
                              handleMarginChange(
                                "bottom",
                                pageMargins.bottom + 5
                              )
                            }
                            className="p-1 rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-600">
                          {t("site.builder.page_layout.left")}
                        </label>
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
                            onChange={handleLeftMarginChange}
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
                      {t("site.builder.page_layout.page_break_rules")}
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
                          {t("site.builder.page_layout.keep_headings")}
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
                          {t("site.builder.page_layout.avoid_orphans")}
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-600">
                          {t("site.builder.page_layout.min_lines")}
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
                            onChange={handleMinLinesChange}
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
                className="my-8 transform-gpu transition-transform duration-200 w-full relative"
                style={
                  {
                    transform: `scale(${
                      (zoomLevel / 100) *
                      (window.innerWidth >= 1024
                        ? screenBasedScale
                        : mobileScale)
                    })`,
                    transformOrigin: "top left",
                    fontFamily: fontFamily,
                    "--accent-color": accentColor,
                  } as React.CSSProperties
                }
              >
                {/* Add a key to force re-render when template changes */}
                <div key={`template-${template}`}>{renderTemplate()}</div>
              </div>
            </div>

            {/* Edit bar */}
            <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 p-3 shadow-md">
              {showTemplateCarousel ? (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">
                      {t("site.builder.templates.select_template")}
                    </h3>
                    <button
                      onClick={() => setShowTemplateCarousel(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {t("site.builder.templates.close")}
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      onClick={prevTemplate}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 hover:bg-gray-100"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex overflow-x-auto space-x-4 px-8 pb-2 scrollbar-hide">
                      {templateOptions.map((templateOption, index) => (
                        <div
                          key={templateOption.value}
                          className={`flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${
                            index === activeTemplateIndex
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          onClick={() => selectTemplate(index)}
                        >
                          <div className="w-32 h-32 mb-1">
                            <img
                              src={templateOption.image}
                              alt={templateOption.name}
                              className="w-full h-full object-cover border border-gray-200 rounded-md"
                            />
                          </div>
                          <p className="text-xs text-center text-gray-600">
                            {t(
                              `site.builder.templates.options.${templateOption.value}`
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={nextTemplate}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 hover:bg-gray-100"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {/* Template Selection */}
                  <div>
                    <button
                      onClick={() => setShowTemplateCarousel(true)}
                      className="w-full flex flex-col items-center justify-center space-y-1 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Layout className="w-5 h-5 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">
                        {t("site.builder.templates.templates")}
                      </span>
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
                    <div className="relative flex items-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded-md px-2 py-1.5">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: accentColor }}
                        />
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-20 h-8 cursor-pointer bg-transparent border-0"
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
                        className="p-1 rounded-md hover:bg-gray-100 text-xs text-gray-500"
                        title={t("templates.reset_to_default_color")}
                      >
                        {t("site.builder.templates.reset")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Preview Drawer */}
          <div className={`lg:hidden ${isDrawerOpen ? "block" : "hidden"}`}>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
              onClick={handleDrawerClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full sm:w-[90%] max-w-[600px] bg-gray-50 z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
              {/* Drawer Content - Copy the content from the desktop right panel */}
              {/* Zoom controls */}
              <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-2 flex justify-between items-center">
                {/* ...existing zoom controls code... */}
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
                <button
                  onClick={handleDrawerClose}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Preview content */}
              <div className="flex-1 overflow-y-auto flex justify-center lg:max-w-full max-w-[700px]">
                {/* ...existing preview code... */}
                <div
                  ref={previewRef}
                  className="my-4 transform-gpu transition-transform duration-200 min-w-full relative"
                  style={
                    {
                      transform: `scale(${
                        (zoomLevel / 100) *
                        (window.innerWidth >= 1024
                          ? screenBasedScale
                          : mobileScale)
                      })`,
                      transformOrigin: "left top",
                      fontFamily: fontFamily,
                      "--accent-color": accentColor,
                    } as React.CSSProperties
                  }
                >
                  {/* Add a key to force re-render when template changes */}
                  <div key={`template-${template}`}>{renderTemplate()}</div>
                </div>
              </div>

              {/* Edit bar */}
              <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 p-3 shadow-md">
                {/* ...existing edit bar code... */}
                {showTemplateCarousel ? (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">
                        Select Template
                      </h3>
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
                        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center ${
                          isTemplateLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                        aria-label="Previous template"
                        disabled={isTemplateLoading}
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>

                      <div className="flex overflow-x-auto py-2 px-8 gap-4 snap-x">
                        {templateOptions.map((option, index) => (
                          <div
                            key={option.value}
                            className={`flex-none w-32 transition-all duration-200 ${
                              index === activeTemplateIndex
                                ? "ring-2 ring-blue-500 scale-105"
                                : "hover:scale-105"
                            } ${
                              isTemplateLoading
                                ? "opacity-70 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                            onClick={() =>
                              !isTemplateLoading && selectTemplate(index)
                            }
                          >
                            <div className="bg-white rounded-md shadow-sm overflow-hidden">
                              <div className="relative aspect-[0.7]">
                                <Image
                                  src={option.image}
                                  alt={option.name}
                                  fill
                                  className="object-cover"
                                />
                                <div
                                  className="absolute bottom-0 left-0 right-0 h-1"
                                  style={{
                                    backgroundColor: option.defaultColor,
                                  }}
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
                        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center ${
                          isTemplateLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                        aria-label={t("tooltips.next_template")}
                        disabled={isTemplateLoading}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap md:gap-4 gap-2 justify-center items-center">
                    {/* Template selector */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          !isTemplateLoading && setShowTemplateCarousel(true)
                        }
                        className={`flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm ${
                          isTemplateLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                        disabled={isTemplateLoading}
                      >
                        {isTemplateLoading ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                            <span>Changing...</span>
                          </>
                        ) : (
                          <>
                            <Layout className="w-5 h-5 text-gray-700" />
                            <span>Templates</span>
                          </>
                        )}
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
                      <div className="relative flex items-center gap-2">
                        <div className="flex items-center border border-gray-300 rounded-md px-2 py-1.5">
                          <div
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: accentColor }}
                          />
                          <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-20 h-8 cursor-pointer bg-transparent border-0"
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
                          className="p-1 rounded-md hover:bg-gray-100 text-xs text-gray-500"
                          title="Reset to default color"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Toggle Button for Mobile */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden fixed right-4 bottom-4 z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          onSuccess={handlePaymentSuccess}
          type="cv"
        />
      </main>
    </div>
  );
}
