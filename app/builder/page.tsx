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
    image: "/assets/resume2.jpg",
    defaultColor: "#2c3e50",
  },
  {
    name: "Pro",
    value: "pro",
    image: "/assets/professional.png",
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
  updateCVData: (section: string, data: any) => void,
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
  const { t } = useLanguage();

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
              placeholder={t("custom_section_editor.title_placeholder")}
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
            placeholder={t("custom_section_editor.description_placeholder")}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:border-blue-500 min-h-[80px] text-gray-900 bg-white"
          />
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
      >
        {t("custom_section_editor.add_item")}
      </button>
    </div>
  );
}

export default function Builder() {
  const searchParams = useSearchParams();
  const cvId = searchParams.get("id");
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
  const { t } = useLanguage();

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // Add save status states
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
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

  // Load CV data if editing existing CV
  useEffect(() => {
    const loadCV = async () => {
      if (!cvId) {
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
        });
        return;
      }

      try {
        const response = await fetch(`/api/cv/load?cvId=${cvId}`);
        const data = await response.json();

        if (data.success) {
          // Initialize all CV data
          setCVData(data.cv.data);
          setTemplate(data.cv.template || initialTemplate);
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

          // Expand sections that have data
          const sectionsWithData = Object.entries(data.cv.data || {}).reduce(
            (acc, [section, value]) => {
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
            },
            {} as Record<string, boolean>
          );

          setExpandedSections((prev) => ({
            ...prev,
            ...sectionsWithData,
          }));
        }
      } catch (error) {
        console.error("Error loading CV:", error);
        setSaveStatus("error");
      }
    };

    if (cvId) {
      loadCV();
    } else {
      // Create a new CV immediately when the page loads without an ID
      createNewCV();
    }
  }, [cvId, initialTemplate]);

  // Function to create a new CV
  const createNewCV = async () => {
    try {
      setSaveStatus("saving");

      const response = await fetch("/api/cv/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled CV",
          data: cvData,
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

  // Auto-save functionality
  const saveCV = async () => {
    setSaveStatus("saving");

    try {
      // Generate preview image
      let preview;
      if (previewRef.current) {
        const firstPage = previewRef.current.querySelector(".cv-page");
        if (firstPage) {
          try {
            // Wait for any images to load
            await Promise.all(
              Array.from(firstPage.getElementsByTagName("img")).map(
                (img) =>
                  new Promise((resolve) => {
                    if (img.complete) resolve(null);
                    else img.onload = () => resolve(null);
                  })
              )
            );

            const canvas = await html2canvas(firstPage as HTMLElement, {
              scale: 2, // Higher quality for stored preview
              useCORS: true,
              logging: false,
              backgroundColor: "#ffffff",
            });
            preview = canvas.toDataURL("image/jpeg", 0.9);
          } catch (error) {
            console.error("Error generating preview:", error);
          }
        }
      }

      // Get the current CV ID from the URL, which might have been updated
      const currentCvId =
        new URLSearchParams(window.location.search).get("id") || cvId;

      const response = await fetch("/api/cv/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvId: currentCvId,
          title: cvData.personalInfo.firstName
            ? `${cvData.personalInfo.firstName}'s CV`
            : "Untitled CV",
          data: cvData,
          template,
          sectionOrder,
          accentColor,
          fontFamily,
          customSectionNames,
          sectionPages,
          preview, // Include the preview image
          lastEdited: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus("saved");
        // If this is a new CV, update the URL with the new CV ID
        if (!currentCvId && data.cv._id) {
          window.history.replaceState({}, "", `/builder?id=${data.cv._id}`);
        }
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      setSaveStatus("error");
    }
  };

  // Debounced auto-save with immediate save for important changes
  const debouncedSave = (immediate = false) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (immediate) {
      saveCV();
    } else {
      // Increase debounce time to reduce save frequency
      setSaveStatus("saving");
      saveTimeoutRef.current = setTimeout(saveCV, 2000);
    }
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

    // Use standard debounce for batch updates
    debouncedSave(false);
  };

  // Update CV data with auto-save
  const updateCVData = (section: string, data: any) => {
    setCVData((prev) => {
      const newData = {
        ...prev,
        [section]: data,
      };
      return newData;
    });

    // Only save immediately for completed personal info changes
    // For all other changes, use the longer debounce
    const shouldSaveImmediately =
      section === "personalInfo" &&
      data.firstName &&
      data.firstName.length > 0 &&
      data.lastName &&
      data.lastName.length > 0;

    debouncedSave(shouldSaveImmediately);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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

  const handleDownload = async (format: "pdf") => {
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
            backgroundColor: "#ffffff",
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

          // Add to PDF with maximum quality settings
          const imgData = canvas.toDataURL("image/png", 1.0); // Using PNG for lossless quality
          pdf.addImage(imgData, "PNG", 0, 0, 210, 297, undefined, "SLOW"); // Using SLOW for better quality
        }

        // Save the PDF
        pdf.save(`resume.pdf`);
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
      case "personal_info":
        return t("sections.personal_info");
      case "profile":
        return t("sections.profile");
      case "education":
        return t("sections.education");
      case "experience":
        return t("sections.experience");
      case "skills":
        return t("sections.skills");
      case "languages":
        return t("sections.languages");
      case "interests":
        return t("sections.interests");
      case "references":
        return t("sections.references");
      case "socials":
        return t("sections.socials");
      default:
        // For custom sections, use the custom name if available
        if (section.startsWith("custom-") && customSectionNames[section]) {
          return customSectionNames[section];
        }
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
    setCVData((prev) => ({
      ...prev,
      [sectionId]: [],
    }));

    // Expand the new section
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: true,
    }));
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

    // Set a timeout to save after user stops typing
    throttledInputRef.current.timeout = setTimeout(() => {
      // Only save if the value is still the same
      if (throttledInputRef.current.value === value) {
        if (typeof data === "object" && field) {
          const updatedData = {
            ...data,
            [field]: value,
          };
          updateCVData(section, updatedData);
        } else {
          updateCVData(section, value);
        }
      }
    }, 1000);
  };

  return (
    <main className="flex min-h-screen h-screen overflow-hidden bg-gray-50">
      {/* Loading Overlay */}
      {isDownloading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-100 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-800">
              {t("pdf_generation.generating_pdf")}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {t("pdf_generation.may_take_moments")}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">{t("header.title")}</h1>
              {/* Save status indicator */}
              <div className="text-gray-500">
                {saveStatus === "saved" && <Cloud className="w-5 h-5" />}
                {saveStatus === "saving" && (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                )}
                {saveStatus === "error" && (
                  <CloudOff className="w-5 h-5 text-red-500" />
                )}
              </div>
              {/* Link to Cover Letter Builder */}
              <a
                href="/builder/cover-letter"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <FileText className="w-4 h-4" />
                {t("header.cover_letter")}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("header.download")}
                </button>
                {showDownloadOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                    <div className="py-1">
                      <button
                        onClick={() => handleDownload("pdf")}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        {t("header.download_as_pdf")}
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
                                {t("sections.rename_section")}
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => handleDeleteSection(section)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t("sections.delete_section")}
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
                                  ? t("sections.move_to_page_1")
                                  : t("sections.move_to_page_2")}
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
                  {t("sections.add_section")}
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
                    // <button
                    //   key={sectionName}
                    //   onClick={() => addCustomSection(sectionName)}
                    //   className="px-3 py-1 text-sm rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    // >
                    //   + {sectionName}
                    // </button>
                    <button
                      key={sectionName}
                      onClick={() => addCustomSection(sectionName)}
                      className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <span className="mr-1">+</span>{" "}
                      {t(
                        `custom_sections.${sectionName
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

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-gray-50 flex flex-col">
          {/* Zoom and page controls */}
          <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="p-1 rounded-md hover:bg-gray-200"
                title={t("tooltips.zoom_out")}
              >
                <ZoomOut className="w-5 h-5 text-gray-700" />
              </button>
              <span className="text-sm font-medium">{zoomLevel}%</span>
              <button
                onClick={zoomIn}
                className="p-1 rounded-md hover:bg-gray-200"
                title={t("tooltips.zoom_in")}
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={resetZoom}
                className="p-1 rounded-md hover:bg-gray-200 ml-2"
                title={t("tooltips.fit_to_page")}
              >
                <Maximize className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* <div className="flex items-center gap-2">
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
            </div> */}
          </div>

          {/* Page break controls panel */}
          {showPageBreakControls && (
            <div className="bg-white border-b border-gray-200 p-3 shadow-sm">
              <h3 className="font-medium text-gray-800 mb-2">
                {t("page_layout.page_layout_settings")}
              </h3>

              <div className="space-y-4">
                {/* Margin controls */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {t("page_layout.page_margins")}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">
                        {t("page_layout.top")}
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
                        {t("page_layout.right")}
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
                        {t("page_layout.bottom")}
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
                            handleMarginChange("bottom", pageMargins.bottom + 5)
                          }
                          className="p-1 rounded-r border border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">
                        {t("page_layout.left")}
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
                    {t("page_layout.page_break_rules")}
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
                        {t("page_layout.keep_headings")}
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
                        {t("page_layout.avoid_orphans")}
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-600">
                        {t("page_layout.min_lines")}
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
              className="my-8 transform-gpu transition-transform duration-200 w-full"
              style={
                {
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top center",
                  fontFamily: fontFamily,
                  "--accent-color": accentColor,
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
                  <h3 className="font-medium text-gray-800">
                    {t("templates.select_template")}
                  </h3>
                  <button
                    onClick={() => setShowTemplateCarousel(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {t("templates.close")}
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={prevTemplate}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
                    aria-label={t("tooltips.previous_template")}
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
                    aria-label={t("tooltips.next_template")}
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
                    <span>{t("templates.templates")}</span>
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
                      {t("templates.reset")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
