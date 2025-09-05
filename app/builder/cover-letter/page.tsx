"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import PersonalInfo from "@/components/sections/personal-info";
import CoverLetterPreviewAlt from "@/components/cover-letter-templates/cover-letter-preview-alt";
import CoverLetterPreviewSherlock from "@/components/cover-letter-templates/cover-letter-preview-sherlock";
import CoverLetterPreviewMinimal from "@/components/cover-letter-templates/cover-letter-preview-minimal";
import CoverLetterPreviewClassic from "@/components/cover-letter-templates/cover-letter-preview-classic";
import CoverLetterPreviewProfessional from "@/components/cover-letter-templates/cover-letter-preview-professional";
import CoverLetterPreviewCirculaire from "@/components/cover-letter-templates/cover-letter-preview-circulaire";
import CoverLetterPreviewStudent from "@/components/cover-letter-templates/cover-letter-preview-student";
import CoverLetterPreviewHR from "@/components/cover-letter-templates/cover-letter-preview-hr";
import CoverLetterPreviewTeal from "@/components/cover-letter-templates/cover-letter-preview-teal";
import type { CoverLetterData } from "@/types";
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Download,
  GripVertical,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  FileText,
  Plus,
  Layout,
  Type,
  Palette,
  Maximize,
  Cloud,
  RefreshCw,
  CloudOff,
  MoveLeft,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import RichTextEditor from "@/components/shared/rich-text-editor";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePayment } from "../../contexts/PaymentContext";
import PaymentModal from "../../components/payment/PaymentModal";

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
  { name: "Blue", value: "#3b82f6" }, // blue-500
  { name: "Red", value: "#ef4444" }, // red-500
  { name: "Green", value: "#22c55e" }, // green-500
  { name: "Purple", value: "#a855f7" }, // purple-500
  { name: "Orange", value: "#f97316" }, // orange-500
  { name: "Teal", value: "#14b8a6" }, // teal-500
  { name: "Pink", value: "#ec4899" }, // pink-500
  { name: "Slate", value: "#64748b" }, // slate-500
];

// Add template options
const templateOptions = [
  {
    name: "Modern",
    value: "modern",
    image: "/assets/cover/modern-cv.svg",
    defaultColor: "#953b2c",
  },
  {
    name: "Classic",
    value: "classic",
    image: "/assets/cover/classic.png",
    defaultColor: "#2c3e50",
  },
  {
    name: "Professional",
    value: "professional",
    image: "/assets/cover/professional.png",
    defaultColor: "#3498db",
  },
  {
    name: "Sherlock",
    value: "sherlock",
    image: "/assets/cover/sherlock.png",
    defaultColor: "#34495e",
  },
  {
    name: "HR",
    value: "hr",
    image: "/assets/cover/hr.png",
    defaultColor: "#9b59b6",
  },
  {
    name: "Circulaire",
    value: "circulaire",
    image: "/assets/cover/circulaire.png",
    defaultColor: "#2BCBBA",
  },
  {
    name: "Minimal",
    value: "minimal",
    image: "/assets/cover/minimal-resume.png",
    defaultColor: "#fd79a8",
  },
  {
    name: "Teal",
    value: "teal",
    image: "/assets/cover/teal.png",
    defaultColor: "#2BCBBA",
  },
  {
    name: "Student",
    value: "student",
    image: "/assets/cover/student-resume.png",
    defaultColor: "#4dabf7",
  },
];

// Add this helper function before the CoverLetterBuilder component
const getMobileScale = (windowWidth: number) => {
  if (windowWidth < 600) {
    const baseWidth = 600;
    const containerWidth = windowWidth * 0.75;
    const scale = Math.min(containerWidth / baseWidth, 1); // Don't scale up, only down
    return scale; // For small devices
  } else if (windowWidth < 1024) {
    // sm breakpoint
    return 0.75; // For extra small devices
  } else {
    return 0.8;
  }
};

// CSS for tooltips
const tooltipStyles = `
  .tooltip-container {
    position: relative;
  }
  
  .tooltip {
    visibility: hidden;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .tooltip-container:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

export default function CoverLetterBuilder() {
  const { t, language } = useLanguage();
  const previewRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSection, setActiveSection] = useState("destinataire");
  const [sectionOrder, setSectionOrder] = useState([
    "personal-info",
    "destinataire",
    "date-et-objet",
    "introduction",
    "situation-actuelle",
    "motivation",
    "conclusion",
  ]);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "personal-info": false,
    destinataire: false,
    "date-et-objet": false,
    introduction: false,
    "situation-actuelle": false,
    motivation: false,
    conclusion: false,
  });
  const [fontFamily, setFontFamily] = useState(fontFamilies[0].value);
  const [fontSize, setFontSize] = useState(fontSizes[1].value);
  const [accentColor, setAccentColor] = useState(colorThemes[0].value);
  const [sectionPages, setSectionPages] = useState<Record<string, number>>({});
  const [activeSectionMenu, setActiveSectionMenu] = useState<string | null>(
    null
  );
  const [isRenamingSection, setIsRenamingSection] = useState(false);
  const [sectionToRename, setSectionToRename] = useState<string | null>(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [customSectionNames, setCustomSectionNames] = useState<
    Record<string, string>
  >({});
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      photo: "",
    },
    recipient: {
      description: "",
      name: "",
      company: "",
      address: "",
      postalCode: "",
      city: "",
    },
    dateAndSubject: {
      date: new Date().toLocaleDateString("fr-FR"),
      location: "",
      subject: "",
    },
    introduction: "",
    currentSituation: "",
    motivation: "",
    conclusion: "",
  });
  const [selectedIntroOption, setSelectedIntroOption] = useState("online");
  const [selectedSituationOption, setSelectedSituationOption] =
    useState("employed_graduate");
  const [selectedMotivationOption, setSelectedMotivationOption] =
    useState("career");
  const [selectedConclusionOption, setSelectedConclusionOption] =
    useState("job_offer");
  const [isAddingSectionDialogOpen, setIsAddingSectionDialogOpen] =
    useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [customSections, setCustomSections] = useState<Record<string, string>>(
    {}
  );
  const [template, setTemplate] = useState<
    | "modern"
    | "classic"
    | "professional"
    | "minimal"
    | "circulaire"
    | "sherlock"
    | "student"
    | "hr"
    | "teal"
  >("modern");
  const [showTemplateCarousel, setShowTemplateCarousel] = useState(false);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const searchParams = useSearchParams();
  const coverId = searchParams.get("id");
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "error" | "unsaved"
  >("saved");
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Template loading state
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const isChangingTemplate = useRef(false);
  const templateLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Throttled input handler for text fields
  const throttledInputRef = useRef<{
    timeout: NodeJS.Timeout | null;
    value: string;
    section: keyof CoverLetterData | "root";
    field: string;
  }>({
    timeout: null,
    value: "",
    section: "root",
    field: "",
  });

  // Add a ref to generate unique template keys
  const templateInstanceRef = useRef<number>(Date.now());

  const [screenBasedScale, setScreenBasedScale] = useState(1);
  const [mobileScale, setMobileScale] = useState(0.8);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [email, setEmail] = useState("");
  const {
    isPaymentModalOpen,
    hasActiveSubscription,
    openPaymentModal,
    closePaymentModal,
    processPayment,
    checkSubscriptionStatus,
  } = usePayment();

  // Add isDownloading state after the other state declarations
  const [isDownloading, setIsDownloading] = useState(false);

  // Add this state at the top with other state declarations
  const [verificationStatus, setVerificationStatus] = useState("");
  const [showFilenameInput, setShowFilenameInput] = useState(false);
  const [customFilename, setCustomFilename] = useState("");

  // Generate default filename based on user's name
  const getDefaultFilename = () => {
    const firstName = coverLetterData.personalInfo.firstName.trim();
    const lastName = coverLetterData.personalInfo.lastName.trim();
    if (firstName && lastName) {
      return `${firstName}_${lastName}_cover_letter.pdf`;
    } else if (firstName || lastName) {
      return `${firstName || lastName}_cover_letter.pdf`;
    }
    return "cover_letter.pdf";
  };

  // Set default filename when modal opens
  useEffect(() => {
    if (showFilenameInput) {
      setCustomFilename(getDefaultFilename());
    }
  }, [
    showFilenameInput,
    coverLetterData.personalInfo.firstName,
    coverLetterData.personalInfo.lastName,
  ]);

  // Safe reset function to prevent getting stuck in loading state
  const safeResetTemplateLoadingState = useCallback(() => {
    setIsTemplateLoading(false);
    isChangingTemplate.current = false;
    if (templateLoadingTimeoutRef.current) {
      clearTimeout(templateLoadingTimeoutRef.current);
      templateLoadingTimeoutRef.current = null;
    }
  }, []);

  // introductionOptions
  const introductionOptions = [
    {
      label: t("site.builder_cover_letter.introduction.onlinead"),
      value: "online",
      template: t("site.builder_cover_letter.introduction.onlinead_template"),
    },
    {
      label: t(
        "site.builder_cover_letter.introduction.spontaneous_application"
      ),
      value: "spontaneous",
      template: t(
        "site.builder_cover_letter.introduction.spontaneous_template"
      ),
    },
    {
      label: t("site.builder_cover_letter.introduction.printad"),
      value: "print",
      template: t("site.builder_cover_letter.introduction.printad_template"),
    },
    {
      label: t("site.builder_cover_letter.introduction.other"),
      value: "other",
      template: t("site.builder_cover_letter.introduction.other_template"),
    },
  ];

  // situationOptions
  const situationOptions = [
    {
      label: t(
        "site.builder_cover_letter.current_situation.currently_employed"
      ),
      value: "employed",
      template: t(
        "site.builder_cover_letter.current_situation.employed_template"
      ),
    },
    {
      label: t(
        "site.builder_cover_letter.current_situation.employed_graduated"
      ),
      value: "employed_graduate",
      template: t(
        "site.builder_cover_letter.current_situation.employed_graduate_template"
      ),
    },
    {
      label: t(
        "site.builder_cover_letter.current_situation.employed_experience"
      ),
      value: "employed_experienced",
      template: t(
        "site.builder_cover_letter.current_situation.employed_experienced_template"
      ),
    },
    {
      label: t("site.builder_cover_letter.current_situation.graduated"),
      value: "graduate",
      template: t(
        "site.builder_cover_letter.current_situation.graduate_template"
      ),
    },
    {
      label: t("site.builder_cover_letter.current_situation.is_student"),
      value: "student",
      template: t(
        "site.builder_cover_letter.current_situation.student_template"
      ),
    },
    {
      label: t("site.builder_cover_letter.current_situation.is_unemployed"),
      value: "unemployed",
      template: t(
        "site.builder_cover_letter.current_situation.unemployed_template"
      ),
    },
  ];

  // motivationOptions
  const motivationOptions = [
    {
      label: t("site.builder_cover_letter.motivation.my_career"),
      value: "career",
      template: t("site.builder_cover_letter.motivation.career_template"),
    },
    {
      label: t("site.builder_cover_letter.motivation.my_education"),
      value: "education",
      template: t("site.builder_cover_letter.motivation.education_template"),
    },
    {
      label: t("site.builder_cover_letter.motivation.my_experience"),
      value: "experience",
      template: t("site.builder_cover_letter.motivation.experience_template"),
    },
    {
      label: t("site.builder_cover_letter.motivation.my_company"),
      value: "company",
      template: t("site.builder_cover_letter.motivation.company_template"),
    },
    {
      label: t("site.builder_cover_letter.motivation.my_innovation"),
      value: "innovation",
      template: t("site.builder_cover_letter.motivation.innovation_template"),
    },
    {
      label: t("site.builder_cover_letter.motivation.other"),
      value: "other",
      template: t("site.builder_cover_letter.motivation.other_template"),
    },
  ];

  // conclusionOptions
  const conclusionOptions = [
    {
      label: t("site.builder_cover_letter.conclusion.my_job_offer"),
      value: "job_offer",
      template: t("site.builder_cover_letter.conclusion.job_offer_template"),
    },
    {
      label: t("site.builder_cover_letter.conclusion.my_spontaneous"),
      value: "spontaneous",
      template: t("site.builder_cover_letter.conclusion.spontaneous_template"),
    },
    {
      label: t("site.builder_cover_letter.conclusion.my_internship"),
      value: "internship",
      template: t("site.builder_cover_letter.conclusion.internship_template"),
    },
    {
      label: t("site.builder_cover_letter.conclusion.my_referral"),
      value: "referral",
      template: t("site.builder_cover_letter.conclusion.referral_template"),
    },
    {
      label: t("site.builder_cover_letter.conclusion.other"),
      value: "other",
      template: t("site.builder_cover_letter.conclusion.other_template"),
    },
  ];

  // Verify template consistency with URL
  const verifyTemplateConsistency = useCallback(() => {
    if (isChangingTemplate.current) return; // Skip during template changes

    const urlTemplate = searchParams.get("template") as string;
    if (urlTemplate && urlTemplate !== template) {
      console.warn(
        `Template inconsistency detected: URL=${urlTemplate}, State=${template}`
      );

      // Check if the URL template is valid
      const isValidTemplate = templateOptions.some(
        (t) => t.value === urlTemplate
      );
      if (isValidTemplate) {
        console.log("Syncing application state with URL template");
        // Update application state to match URL
        setTemplate(urlTemplate as any);
        const index = templateOptions.findIndex((t) => t.value === urlTemplate);
        if (index !== -1) {
          setActiveTemplateIndex(index);
        }
      } else {
        console.log("Syncing URL with application state template");
        // Update URL to match application state
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("template", template);
        window.history.replaceState({}, "", currentUrl.toString());
      }
    }
  }, [searchParams, template, templateOptions]);

  useEffect(() => {
    if (coverId) {
      loadCoverLetter();
    } else {
      // Create a new Cover Letter immediately when the page loads without an ID
      createNewCoverLetter();
    }

    // Check if we have a template in the URL
    const urlTemplate = searchParams.get("template") as string;
    if (urlTemplate && templateOptions.some((t) => t.value === urlTemplate)) {
      console.log(`Setting initial template from URL: ${urlTemplate}`);
      setTemplate(urlTemplate as any);
      const templateIndex = templateOptions.findIndex(
        (t) => t.value === urlTemplate
      );
      if (templateIndex !== -1) {
        setActiveTemplateIndex(templateIndex);
      }
    }
  }, [coverId, searchParams]);

  // Add event listener to reset loading state if user navigates away during loading
  useEffect(() => {
    if (isTemplateLoading) {
      const handleBeforeUnload = () => {
        // Reset loading state if user navigates away during template change
        safeResetTemplateLoadingState();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isTemplateLoading, safeResetTemplateLoadingState]);

  // Cleanup template loading timeout on unmount
  useEffect(() => {
    return () => {
      if (templateLoadingTimeoutRef.current) {
        clearTimeout(templateLoadingTimeoutRef.current);
      }
    };
  }, []);

  // Effect to handle URL template changes
  useEffect(() => {
    // Skip if we're currently changing templates via carousel
    if (isChangingTemplate.current) {
      return;
    }

    const templateParam = searchParams.get("template") as
      | "modern"
      | "classic"
      | "professional"
      | "minimal"
      | "circulaire"
      | "sherlock"
      | "student"
      | "hr"
      | "teal";

    console.log(`Template param from URL: ${templateParam}`);

    if (templateParam && templateParam !== template) {
      console.log(`Setting template from URL: ${templateParam}`);

      // Set loading state
      setIsTemplateLoading(true);

      // Set a safety timeout to prevent getting stuck in loading state
      if (templateLoadingTimeoutRef.current) {
        clearTimeout(templateLoadingTimeoutRef.current);
      }
      templateLoadingTimeoutRef.current = setTimeout(() => {
        console.warn("Template change from URL timeout reached, forcing reset");
        safeResetTemplateLoadingState();
      }, 8000); // 8 seconds timeout

      setTemplate(templateParam);

      const index = templateOptions.findIndex((t) => t.value === templateParam);
      if (index !== -1) {
        setActiveTemplateIndex(index);
      }

      // Simulate a delay for loading
      setTimeout(() => {
        setIsTemplateLoading(false);
        if (templateLoadingTimeoutRef.current) {
          clearTimeout(templateLoadingTimeoutRef.current);
          templateLoadingTimeoutRef.current = null;
        }
      }, 500);
    }
  }, [searchParams, template, safeResetTemplateLoadingState]);

  /* Replace the prevTemplate function */
  const prevTemplate = () => {
    if (isTemplateLoading) return; // Prevent multiple template changes while loading

    setIsTemplateLoading(true);
    isChangingTemplate.current = true;

    // Set a safety timeout to prevent getting stuck in loading state
    if (templateLoadingTimeoutRef.current) {
      clearTimeout(templateLoadingTimeoutRef.current);
    }
    templateLoadingTimeoutRef.current = setTimeout(() => {
      console.warn("Template change timeout reached, forcing reset");
      safeResetTemplateLoadingState();
    }, 8000); // 8 seconds timeout

    const currentIndex = activeTemplateIndex;
    const newIndex =
      currentIndex === 0 ? templateOptions.length - 1 : currentIndex - 1;
    const selectedTemplateValue = templateOptions[newIndex].value as any;

    console.log(`Starting template change to: ${selectedTemplateValue}`);

    // Batch state updates to avoid race conditions
    setActiveTemplateIndex(newIndex);
    setTemplate(selectedTemplateValue);

    // Update the URL with the selected template
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("template", selectedTemplateValue);
    window.history.replaceState({}, "", currentUrl.toString());

    // Mark as unsaved instead of saving
    setSaveStatus("unsaved");

    setTimeout(() => {
      isChangingTemplate.current = false;
      setIsTemplateLoading(false);
      // Clear the safety timeout
      if (templateLoadingTimeoutRef.current) {
        clearTimeout(templateLoadingTimeoutRef.current);
        templateLoadingTimeoutRef.current = null;
      }
      console.log(`Template change completed: ${selectedTemplateValue}`);
    }, 500); // Give extra time for rendering
  };

  /* Replace the nextTemplate function */
  const nextTemplate = () => {
    if (isTemplateLoading) return; // Prevent multiple template changes while loading

    setIsTemplateLoading(true);
    isChangingTemplate.current = true;

    // Set a safety timeout to prevent getting stuck in loading state
    if (templateLoadingTimeoutRef.current) {
      clearTimeout(templateLoadingTimeoutRef.current);
    }
    templateLoadingTimeoutRef.current = setTimeout(() => {
      console.warn("Template change timeout reached, forcing reset");
      safeResetTemplateLoadingState();
    }, 8000); // 8 seconds timeout

    const currentIndex = activeTemplateIndex;
    const newIndex =
      currentIndex === templateOptions.length - 1 ? 0 : currentIndex + 1;
    const selectedTemplateValue = templateOptions[newIndex].value as any;

    console.log(`Starting template change to: ${selectedTemplateValue}`);

    // Batch state updates to avoid race conditions
    setActiveTemplateIndex(newIndex);
    setTemplate(selectedTemplateValue);

    // Update the URL with the selected template
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("template", selectedTemplateValue);
    window.history.replaceState({}, "", currentUrl.toString());

    // Mark as unsaved instead of saving
    setSaveStatus("unsaved");

    setTimeout(() => {
      isChangingTemplate.current = false;
      setIsTemplateLoading(false);
      // Clear the safety timeout
      if (templateLoadingTimeoutRef.current) {
        clearTimeout(templateLoadingTimeoutRef.current);
        templateLoadingTimeoutRef.current = null;
      }
      console.log(`Template change completed: ${selectedTemplateValue}`);
    }, 500); // Give extra time for rendering
  };

  /* Replace the selectTemplate function */
  const selectTemplate = (index: number) => {
    if (isTemplateLoading) return; // Prevent multiple template changes while loading

    setIsTemplateLoading(true);
    isChangingTemplate.current = true;

    // Debug log: print the current data before template change
    console.log(
      "Data before template change:",
      JSON.stringify(coverLetterData)
    );

    // Set a safety timeout to prevent getting stuck in loading state
    if (templateLoadingTimeoutRef.current) {
      clearTimeout(templateLoadingTimeoutRef.current);
    }
    templateLoadingTimeoutRef.current = setTimeout(() => {
      console.warn("Template change timeout reached, forcing reset");
      safeResetTemplateLoadingState();
    }, 8000); // 8 seconds timeout

    const selectedTemplateValue = templateOptions[index].value as any;

    console.log(`Starting template change to: ${selectedTemplateValue}`);

    // Batch state updates to avoid race conditions
    setActiveTemplateIndex(index);
    setTemplate(selectedTemplateValue);
    setShowTemplateCarousel(false);

    // Update the URL with the selected template
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("template", selectedTemplateValue);
    window.history.replaceState({}, "", currentUrl.toString());

    // Mark as unsaved instead of saving
    setSaveStatus("unsaved");

    setTimeout(() => {
      isChangingTemplate.current = false;
      setIsTemplateLoading(false);
      // Clear the safety timeout
      if (templateLoadingTimeoutRef.current) {
        clearTimeout(templateLoadingTimeoutRef.current);
        templateLoadingTimeoutRef.current = null;
      }
      // Debug log: print the data after template change
      console.log(
        "Data after template change:",
        JSON.stringify(coverLetterData)
      );
      console.log(`Template change completed: ${selectedTemplateValue}`);
    }, 500); // Give extra time for rendering
  };

  const loadCoverLetter = async () => {
    // Try to get cover letter ID from URL or from sessionStorage
    const urlId = searchParams.get("id");
    const storedId = sessionStorage.getItem("current-cover-letter-id");
    const effectiveCoverId = urlId || storedId;

    if (effectiveCoverId) {
      // If we have an ID from either source, use it
      try {
        // Update URL if needed to reflect the ID we're using
        if (!urlId && storedId) {
          window.history.replaceState(
            {},
            "",
            `/builder/cover-letter?id=${storedId}`
          );
        }

        const response = await fetch(
          `/api/cover-letter/load?coverId=${effectiveCoverId}`
        );
        const data = await response.json();

        if (data.success) {
          console.log(
            `Loaded cover letter with template: ${data.coverLetter.template}`
          );
          // Store the ID we're working with
          sessionStorage.setItem("current-cover-letter-id", effectiveCoverId);

          // Initialize all cover letter data
          setCoverLetterData(data.coverLetter.data);

          // Check for template in URL that might override the saved template
          const urlTemplate = searchParams.get("template") as string;
          let templateToUse = data.coverLetter.template || "modern";

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
            data.coverLetter.sectionOrder || [
              "personal-info",
              "destinataire",
              "date-et-objet",
              "introduction",
              "situation-actuelle",
              "motivation",
              "conclusion",
            ]
          );
          setAccentColor(data.coverLetter.accentColor || "#3498db");
          setFontFamily(
            data.coverLetter.fontFamily || "'DejaVu Sans', sans-serif"
          );
          setCustomSectionNames(data.coverLetter.customSectionNames || {});
          setSectionPages(data.coverLetter.sectionPages || {});
          setCustomSections(data.coverLetter.customSections || {});

          // Set active template index
          const templateIndex = templateOptions.findIndex(
            (t) => t.value === templateToUse
          );
          if (templateIndex !== -1) {
            setActiveTemplateIndex(templateIndex);
          }

          // Update title from the cover letter data
          document.title = `${
            data.coverLetter.title || "Cover Letter"
          } | Resume Builder`;
        } else {
          // If cover letter not found, create a new one
          console.warn("Cover letter not found, creating new one");
          createNewCoverLetter();
        }
      } catch (error) {
        console.error("Error loading cover letter:", error);
        // If loading fails, clear the stored ID to start fresh
        sessionStorage.removeItem("current-cover-letter-id");
        createNewCoverLetter();
      }
    } else {
      // Create a new cover letter if we don't have an ID
      createNewCoverLetter();
    }
  };

  const saveCoverLetter = async () => {
    setSaveStatus("saving");
    console.log("Saving cover letter...");

    try {
      let preview;
      if (previewRef.current) {
        const firstPage = previewRef.current.querySelector(".cv-page");
        if (firstPage) {
          try {
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
              scale: 2,
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

      console.log("Saving cover letter with section pages:", sectionPages);

      // Get the current Cover Letter ID from the URL or sessionStorage
      const currentCoverId =
        searchParams.get("id") ||
        sessionStorage.getItem("current-cover-letter-id");

      const payload = {
        coverId: currentCoverId,
        title: coverLetterData.personalInfo?.firstName
          ? `${coverLetterData.personalInfo.firstName}'s Cover Letter`
          : "Untitled Cover Letter",
        data: coverLetterData,
        template,
        sectionOrder,
        accentColor,
        fontFamily,
        customSectionNames,
        sectionPages,
        customSections,
        preview,
        lastEdited: new Date().toISOString(),
      };

      console.log("Save payload:", payload);

      const response = await fetch("/api/cover-letter/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Cover letter saved successfully:", data.coverLetter);
        setSaveStatus("saved");

        // Update sessionStorage with cover letter ID
        if (data.coverLetter._id) {
          sessionStorage.setItem(
            "current-cover-letter-id",
            data.coverLetter._id
          );

          // Update URL if needed
          if (!currentCoverId || currentCoverId !== data.coverLetter._id) {
            window.history.replaceState(
              {},
              "",
              `/builder/cover-letter?id=${data.coverLetter._id}`
            );
          }
        }
      } else {
        console.error("Error saving cover letter:", data.error);
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving cover letter:", error);
      setSaveStatus("error");
    }
  };

  // Batch update for multiple fields to reduce save frequency
  const batchUpdateCoverLetterData = (updates: Record<string, any>) => {
    setCoverLetterData((prev) => {
      const newState = { ...prev } as typeof prev;

      // Apply all updates at once
      Object.entries(updates).forEach(([key, value]) => {
        const [section, field] = key.split(".");

        if (field) {
          // Handle nested updates (e.g., "personalInfo.firstName")
          if (
            section === "personalInfo" ||
            section === "recipient" ||
            section === "dateAndSubject"
          ) {
            if (!newState[section as keyof typeof newState]) {
              newState[section as keyof typeof newState] = {} as any;
            }

            // Type-safe update for known sections
            const sectionObj = newState[
              section as keyof typeof newState
            ] as Record<string, any>;
            sectionObj[field] = value;
          }
        } else if (key in newState) {
          // Handle direct section updates for known keys
          (newState as any)[key] = value;
        }
      });

      return newState;
    });

    // Mark as unsaved without auto-saving
    setSaveStatus("unsaved");
  };

  const handleThrottledInput = (
    section: keyof CoverLetterData | "root",
    field: string,
    value: string
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
    setCoverLetterData((prev) => {
      if (section === "root") {
        return {
          ...prev,
          [field]: value,
        };
      }

      const newState = { ...prev };

      if (section === "personalInfo") {
        newState.personalInfo = {
          ...newState.personalInfo,
          [field]: value,
        };
      } else if (section === "recipient") {
        newState.recipient = {
          ...newState.recipient,
          [field]: value,
        };
      } else if (section === "dateAndSubject") {
        newState.dateAndSubject = {
          ...newState.dateAndSubject,
          [field]: value,
        };
      } else {
        newState[section] = value;
      }

      return newState;
    });

    // Mark as unsaved but don't schedule auto-save
    setSaveStatus("unsaved");
  };

  const updateCoverLetterData = (
    section: keyof CoverLetterData | "root",
    field: string,
    value: string | boolean | number
  ) => {
    setCoverLetterData((prev) => {
      if (section === "root") {
        return {
          ...prev,
          [field]: value,
        };
      }

      const newState = { ...prev };

      if (section === "personalInfo") {
        newState.personalInfo = {
          ...newState.personalInfo,
          [field]: value,
        };
      } else if (section === "recipient") {
        newState.recipient = {
          ...newState.recipient,
          [field]: value,
        };
      } else if (section === "dateAndSubject") {
        newState.dateAndSubject = {
          ...newState.dateAndSubject,
          [field]: value,
        };
      } else {
        newState[section] = value as string;
      }

      return newState;
    });

    // Mark as unsaved without auto-saving
    setSaveStatus("unsaved");
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleRenameSection = (section: string) => {
    setSectionToRename(section);
    setNewSectionName(customSectionNames[section] || getSectionTitle(section));
    setIsRenamingSection(true);
    setActiveSectionMenu(null);
  };

  const saveRenamedSection = () => {
    if (sectionToRename && newSectionName.trim()) {
      setCustomSectionNames((prev) => ({
        ...prev,
        [sectionToRename]: newSectionName.trim(),
      }));
      setIsRenamingSection(false);
      setSectionToRename(null);
      setNewSectionName("");

      // Mark as unsaved when renaming a section
      setSaveStatus("unsaved");
    }
  };

  const handleDeleteSection = (section: string) => {
    setSectionOrder((prev) => prev.filter((s) => s !== section));
    setActiveSectionMenu(null);

    // Mark as unsaved when deleting a section
    setSaveStatus("unsaved");
  };

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

  const getSectionTitle = (section: string): string => {
    // Base section names
    switch (section) {
      case "personal-info":
        return t("site.builder_cover_letter.sections.personal_info");
      case "destinataire":
        return t("site.builder_cover_letter.sections.recipient");
      case "date-et-objet":
        return t("site.builder_cover_letter.sections.date_subject");
      case "introduction":
        return t("site.builder_cover_letter.sections.introduction");
      case "situation-actuelle":
        return t("site.builder_cover_letter.sections.current_situation");
      case "motivation":
        return t("site.builder_cover_letter.sections.motivation");
      case "conclusion":
        return t("site.builder_cover_letter.sections.conclusion");
      default:
        // For custom renamed sections
        return customSectionNames[section] || section;
    }
  };

  // Update the generatePDF function to remove the duplicate state declaration
  const generatePDF = async (filename?: string) => {
    if (!previewRef.current) return;

    try {
      // First set the loading state with initial message
      setIsDownloading(true);

      // First update the UI to indicate we're starting verification
      setVerificationStatus("Verifying subscription status...");

      // Directly verify with the server - bypass client-side state completely
      // This is the most secure approach as it prevents any client-side manipulation
      const verifyResponse = await fetch("/api/subscription/verify-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify({
          downloadType: "cover-letter",
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
        openPaymentModal("cover-letter");
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
        openPaymentModal("cover-letter");
        return;
      }

      // If we get here, the user is verified and can download
      setVerificationStatus("Subscription verified. Preparing document...");

      // Generate the PDF
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      setVerificationStatus("Creating PDF document...");

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      setVerificationStatus("Finalizing download...");
      pdf.save(filename || "cover-letter.pdf");

      // Update client-side subscription info after successful download
      // This ensures our UI state stays in sync with the server
      await checkSubscriptionStatus(true);
    } catch (error) {
      console.error("Error generating cover letter PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Fix the TypeScript type for the DownloadingOverlay component
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

  const handlePaymentSuccess = async () => {
    // After successful payment, generate the PDF
    await generatePDF("cover_letter.pdf");
  };

  const renderPersonalInfoInputs = () => (
    <div className="p-4">
      <PersonalInfo
        data={coverLetterData.personalInfo}
        updateData={(data) =>
          setCoverLetterData((prev) => ({ ...prev, personalInfo: data }))
        }
        template="modern"
      />
    </div>
  );

  const renderDestinaireInputs = () => (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("site.builder_cover_letter.recipient.company")}
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder={t(
            "site.builder_cover_letter.recipient.company_placeholder"
          )}
          value={coverLetterData.recipient.company}
          onChange={(e) =>
            handleThrottledInput("recipient", "company", e.target.value)
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("site.builder_cover_letter.recipient.contact")}
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder={t(
            "site.builder_cover_letter.recipient.contact_placeholder"
          )}
          value={coverLetterData.recipient.name}
          onChange={(e) =>
            handleThrottledInput("recipient", "name", e.target.value)
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("site.builder_cover_letter.recipient.address")}
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder={t(
            "site.builder_cover_letter.recipient.address_placeholder"
          )}
          value={coverLetterData.recipient.address}
          onChange={(e) =>
            handleThrottledInput("recipient", "address", e.target.value)
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("site.builder_cover_letter.recipient.postal_code")}
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder={t(
              "site.builder_cover_letter.recipient.postal_code_placeholder"
            )}
            value={coverLetterData.recipient.postalCode}
            onChange={(e) =>
              handleThrottledInput("recipient", "postalCode", e.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("site.builder_cover_letter.recipient.city")}
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder={t(
              "site.builder_cover_letter.recipient.city_placeholder"
            )}
            value={coverLetterData.recipient.city}
            onChange={(e) =>
              handleThrottledInput("recipient", "city", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderDateEtObjetInputs = () => (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("site.builder_cover_letter.date_subject.city")}
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder={t(
              "site.builder_cover_letter.date_subject.city_placeholder"
            )}
            value={coverLetterData.dateAndSubject.location}
            onChange={(e) =>
              handleThrottledInput("dateAndSubject", "location", e.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("site.builder_cover_letter.date_subject.date")}
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={getDisplayDate(coverLetterData.dateAndSubject.date)}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("site.builder_cover_letter.date_subject.subject")}
        </label>
        <RichTextEditor
          value={coverLetterData.dateAndSubject.subject}
          onChange={(value) =>
            handleThrottledInput("dateAndSubject", "subject", value)
          }
          placeholder={t(
            "site.builder_cover_letter.date_subject.subject_placeholder"
          )}
        />
      </div>
    </div>
  );

  const renderIntroductionInputs = () => {
    const currentTemplate =
      introductionOptions.find((option) => option.value === selectedIntroOption)
        ?.template || "";

    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("site.builder_cover_letter.introduction.select_content")}
          </label>
          <div className="relative">
            <select
              className="w-full p-2 border rounded-md appearance-none bg-white pr-8"
              value={selectedIntroOption}
              onChange={(e) => {
                setSelectedIntroOption(e.target.value);
                const template =
                  introductionOptions.find(
                    (option) => option.value === e.target.value
                  )?.template || "";
                handleThrottledInput("root", "introduction", template);
              }}
            >
              {introductionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
        <div>
          <RichTextEditor
            key={selectedIntroOption}
            value={coverLetterData.introduction || currentTemplate}
            onChange={(value) =>
              handleThrottledInput("root", "introduction", value)
            }
            placeholder={t(
              "site.builder_cover_letter.introduction.customize_placeholder"
            )}
          />
          <div className="p-3 mt-2 bg-gray-50 rounded-md text-sm text-gray-600">
            <p>
              {t("site.builder_cover_letter.introduction.replace_instruction")}
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {selectedIntroOption === "online" && (
                <>
                  <li>
                    {t("site.builder_cover_letter.introduction.online.site")}
                  </li>
                  <li>
                    {t("site.builder_cover_letter.introduction.online.poste")}
                  </li>
                </>
              )}
              {selectedIntroOption === "spontaneous" && (
                <li>
                  {t(
                    "site.builder_cover_letter.introduction.spontaneous.poste"
                  )}
                </li>
              )}
              {selectedIntroOption === "print" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.introduction.print.journal_magazine"
                    )}
                  </li>
                  <li>
                    {t("site.builder_cover_letter.introduction.print.date")}
                  </li>
                  <li>
                    {t("site.builder_cover_letter.introduction.print.poste")}
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentSituationInputs = () => {
    const currentTemplate =
      situationOptions.find(
        (option) => option.value === selectedSituationOption
      )?.template || "";

    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("site.builder_cover_letter.current_situation.select_content")}
          </label>
          <div className="relative">
            <select
              className="w-full p-2 border rounded-md appearance-none bg-white pr-8"
              value={selectedSituationOption}
              onChange={(e) => {
                setSelectedSituationOption(e.target.value);
                const template =
                  situationOptions.find(
                    (option) => option.value === e.target.value
                  )?.template || "";
                handleThrottledInput("root", "currentSituation", template);
              }}
            >
              {situationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
        <div>
          <RichTextEditor
            key={selectedSituationOption}
            value={coverLetterData.currentSituation || currentTemplate}
            onChange={(value) =>
              handleThrottledInput("root", "currentSituation", value)
            }
            placeholder={t(
              "site.builder_cover_letter.current_situation.customize_placeholder"
            )}
          />
          <div className="p-3 mt-2 bg-gray-50 rounded-md text-sm text-gray-600">
            <p>
              {t(
                "site.builder_cover_letter.current_situation.replace_instruction"
              )}
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {selectedSituationOption === "employed" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed.poste_actuel"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed.entreprise"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed.ville"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed.responsabilites"
                    )}
                  </li>
                </>
              )}
              {selectedSituationOption === "employed_graduate" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_graduate.poste_actuel"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_graduate.entreprise"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_graduate.ville"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_graduate.responsabilites"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_graduate.formation"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_graduate.etablissement"
                    )}
                  </li>
                </>
              )}
              {selectedSituationOption === "employed_experienced" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_experienced.poste_actuel"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_experienced.entreprise"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_experienced.ville"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_experienced.x"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_experienced.domaine"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.employed_experienced.competences_cles"
                    )}
                  </li>
                </>
              )}
              {selectedSituationOption === "graduate" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.graduate.formation"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.graduate.etablissement"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.graduate.domaines_expertise"
                    )}
                  </li>
                </>
              )}
              {selectedSituationOption === "student" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.student.annee_niveau"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.student.formation"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.student.etablissement"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.student.specialisation"
                    )}
                  </li>
                </>
              )}
              {selectedSituationOption === "unemployed" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.unemployed.raison"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.current_situation.unemployed.competences"
                    )}
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderMotivationInputs = () => {
    const currentTemplate =
      motivationOptions.find(
        (option) => option.value === selectedMotivationOption
      )?.template || "";

    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("site.builder_cover_letter.motivation.select_content")}
          </label>
          <div className="relative">
            <select
              className="w-full p-2 border rounded-md appearance-none bg-white pr-8"
              value={selectedMotivationOption}
              onChange={(e) => {
                setSelectedMotivationOption(e.target.value);
                const template =
                  motivationOptions.find(
                    (option) => option.value === e.target.value
                  )?.template || "";
                handleThrottledInput("root", "motivation", template);
              }}
            >
              {motivationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
        <div>
          <RichTextEditor
            key={selectedMotivationOption}
            value={coverLetterData.motivation || currentTemplate}
            onChange={(value) =>
              handleThrottledInput("root", "motivation", value)
            }
            placeholder={t(
              "site.builder_cover_letter.motivation.customize_placeholder"
            )}
          />
          <div className="p-3 mt-2 bg-gray-50 rounded-md text-sm text-gray-600">
            <p>
              {t("site.builder_cover_letter.motivation.replace_instruction")}
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {selectedMotivationOption === "career" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.career.aspect_specifique"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.career.competences_cles"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.career.domaine_expertise"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.career.projets_objectifs"
                    )}
                  </li>
                </>
              )}
              {selectedMotivationOption === "education" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.education.formation"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.education.domaines_expertise"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.education.projet_cle"
                    )}
                  </li>
                </>
              )}
              {selectedMotivationOption === "experience" && (
                <>
                  <li>
                    {t("site.builder_cover_letter.motivation.experience.x")}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.experience.secteur"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.experience.competences_specifiques"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.experience.secteur_activite"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.experience.objectifs_projets"
                    )}
                  </li>
                </>
              )}
              {selectedMotivationOption === "company" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.company.caracteristique_valeur"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.company.realisation_projet"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.company.competences_expertise"
                    )}
                  </li>
                </>
              )}
              {selectedMotivationOption === "innovation" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.innovation.projet_technologie"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.innovation.domaine_technique"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.motivation.innovation.competence_specifique"
                    )}
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderConclusionInputs = () => {
    const currentTemplate =
      conclusionOptions.find(
        (option) => option.value === selectedConclusionOption
      )?.template || "";

    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("site.builder_cover_letter.conclusion.select_content")}
          </label>
          <div className="relative">
            <select
              className="w-full p-2 border rounded-md appearance-none bg-white pr-8"
              value={selectedConclusionOption}
              onChange={(e) => {
                setSelectedConclusionOption(e.target.value);
                const template =
                  conclusionOptions.find(
                    (option) => option.value === e.target.value
                  )?.template || "";
                handleThrottledInput("root", "conclusion", template);
              }}
            >
              {conclusionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
        <div>
          <RichTextEditor
            key={selectedConclusionOption}
            value={coverLetterData.conclusion || currentTemplate}
            onChange={(value) =>
              handleThrottledInput("root", "conclusion", value)
            }
            placeholder={t(
              "site.builder_cover_letter.conclusion.customize_placeholder"
            )}
          />
          <div className="p-3 mt-2 bg-gray-50 rounded-md text-sm text-gray-600">
            <p>
              {t("site.builder_cover_letter.conclusion.replace_instruction")}
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {selectedConclusionOption === "job_offer" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.job_offer.emploi_recherche"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.job_offer.telephone"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.job_offer.adresse_email"
                    )}
                  </li>
                  <li>
                    {t("site.builder_cover_letter.conclusion.job_offer.prenom")}
                  </li>
                  <li>
                    {t("site.builder_cover_letter.conclusion.job_offer.nom")}
                  </li>
                </>
              )}
              {selectedConclusionOption === "spontaneous" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.spontaneous.telephone"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.spontaneous.adresse_email"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.spontaneous.prenom"
                    )}
                  </li>
                  <li>
                    {t("site.builder_cover_letter.conclusion.spontaneous.nom")}
                  </li>
                </>
              )}
              {selectedConclusionOption === "internship" && (
                <>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.internship.type_contrat"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.internship.telephone"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.internship.adresse_email"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.internship.prenom"
                    )}
                  </li>
                  <li>
                    {t("site.builder_cover_letter.conclusion.internship.nom")}
                  </li>
                </>
              )}
              {selectedConclusionOption === "referral" && (
                <>
                  <li>
                    {t("site.builder_cover_letter.conclusion.referral.contact")}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.referral.telephone"
                    )}
                  </li>
                  <li>
                    {t(
                      "site.builder_cover_letter.conclusion.referral.adresse_email"
                    )}
                  </li>
                  <li>
                    {t("site.builder_cover_letter.conclusion.referral.prenom")}
                  </li>
                  <li>
                    {t("site.builder_cover_letter.conclusion.referral.nom")}
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderActiveSectionInputs = (section: string) => {
    if (section.startsWith("custom-")) {
      return (
        <div className="p-4">
          <RichTextEditor
            value={customSections[section] || ""}
            onChange={(value) =>
              setCustomSections((prev) => ({
                ...prev,
                [section]: value,
              }))
            }
            placeholder="Saisissez votre texte ici..."
          />
        </div>
      );
    }

    switch (section) {
      case "personal-info":
        return renderPersonalInfoInputs();
      case "destinataire":
        return renderDestinaireInputs();
      case "date-et-objet":
        return renderDateEtObjetInputs();
      case "introduction":
        return renderIntroductionInputs();
      case "situation-actuelle":
        return renderCurrentSituationInputs();
      case "motivation":
        return renderMotivationInputs();
      case "conclusion":
        return renderConclusionInputs();
      default:
        return null;
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoDate = e.target.value; // Keep the ISO format (YYYY-MM-DD)
    handleThrottledInput("dateAndSubject", "date", isoDate);
  };

  // Helper function to convert stored date to display format
  const getDisplayDate = (dateValue: string) => {
    if (!dateValue) return "";

    // If the date is already in ISO format, return it as is for the input
    if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue;
    }

    // If it's in French format (DD/MM/YYYY), convert to ISO
    if (dateValue.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const [day, month, year] = dateValue.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    return "";
  };

  // Helper function to convert ISO date to French format for templates
  const getFormattedDate = (dateValue: string) => {
    if (!dateValue) return new Date().toLocaleDateString("fr-FR");

    // If it's in ISO format, convert to French
    if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(dateValue).toLocaleDateString("fr-FR");
    }

    // If it's already in French format, return as is
    return dateValue;
  };

  const handleAddNewSection = () => {
    const sectionId = `custom-${Date.now()}`;
    setCustomSections((prev) => ({
      ...prev,
      [sectionId]: "",
    }));
    setSectionOrder((prev) => [...prev, sectionId]);
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: true,
    }));
    setCustomSectionNames((prev) => ({
      ...prev,
      [sectionId]: "Section additionnelle",
    }));

    // Mark as unsaved when adding a new section
    setSaveStatus("unsaved");
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

  const resetZoom = () => {
    setZoom(1);
  };

  // Function to create a new Cover Letter
  const createNewCoverLetter = () => {
    // Clear any existing cover letter ID from session storage
    sessionStorage.removeItem("current-cover-letter-id");

    // Initialize with default values but don't save to database
    setCoverLetterData({
      personalInfo: {
        firstName: "",
        lastName: "",
        title: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        city: "",
        photo: "",
      },
      recipient: {
        description: "",
        name: "",
        company: "",
        address: "",
        postalCode: "",
        city: "",
      },
      dateAndSubject: {
        date: new Date().toLocaleDateString("fr-FR"),
        location: "",
        subject: "",
      },
      introduction: "",
      currentSituation: "",
      motivation: "",
      conclusion: "",
    });

    // Set default template and other settings
    const urlTemplate = searchParams.get("template") as string;
    if (urlTemplate && templateOptions.some((t) => t.value === urlTemplate)) {
      setTemplate(urlTemplate as any);
      const templateIndex = templateOptions.findIndex(
        (t) => t.value === urlTemplate
      );
      if (templateIndex !== -1) {
        setActiveTemplateIndex(templateIndex);
      }
    } else {
      setTemplate("modern");
      setActiveTemplateIndex(0);
    }

    // Reset other state
    setSectionOrder([
      "personal-info",
      "destinataire",
      "date-et-objet",
      "introduction",
      "situation-actuelle",
      "motivation",
      "conclusion",
    ]);
    setAccentColor("#3b82f6");
    setFontFamily("'DejaVu Sans', sans-serif");
    setCustomSectionNames({});
    setSectionPages({});
    setCustomSections({});

    // Set initial save status
    setSaveStatus("unsaved");

    // Update document title
    document.title = "New Cover Letter | Resume Builder";
  };

  // Add this handler
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // Add this effect to handle scaling based on screen width
  useEffect(() => {
    const updateScale = () => {
      // Base width is A4 paper width (210mm ≈ 793px)
      const baseWidth = 793;
      const containerWidth = window.innerWidth * 0.49; // Preview takes up half the screen on desktop
      const scale = Math.min(containerWidth / baseWidth, 1); // Don't scale up, only down
      setScreenBasedScale(scale);
    };

    // Initial calculation
    updateScale();

    // Update on resize
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

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

  // Add the handleBackToDashboard function after other handler functions
  const handleBackToDashboard = () => {
    // If there are unsaved changes, ask the user if they want to save

    // No unsaved changes, just navigate away
    sessionStorage.removeItem("current-cover-letter-id");
    window.location.href = "/dashboard";
  };

  // Add manual save function
  const handleManualSave = () => {
    setSaveStatus("saving");

    // Clear any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveCoverLetter()
      .then(() => {
        console.log("Manual save completed");
      })
      .catch((error) => {
        console.error("Manual save failed:", error);
        setSaveStatus("error");
      });
  };

  // Add effect to handle click outside events for download modal and section menus
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

  // Add a function to generate unique template keys
  const getTemplateKey = () => {
    // Generate a stable hash of the data
    const dataKeys = Object.keys(coverLetterData).join("");
    const dataValues = Object.values(coverLetterData)
      .map((val) =>
        typeof val === "object" ? JSON.stringify(val) : String(val)
      )
      .join("");
    const dataHash = dataKeys.length + dataValues.length;

    return `${template}-${templateInstanceRef.current}-${dataHash}`;
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-50">
      {/* Add tooltip styles */}
      <style dangerouslySetInnerHTML={{ __html: tooltipStyles }} />

      {/* Loading Overlay */}
      {isDownloading && <DownloadingOverlay />}

      {/* Filename Input Modal */}
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
                  generatePDF(filename);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen bg-gray-100">
        <div className="lg:w-1/2 w-full flex flex-col border-r border-gray-200 bg-white">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
                className="min-w-[30px] min-h-[30px] flex items-center justify-center rounded-[5px] bg-gray-100 hover:bg-gray-200"
              >
                <MoveLeft size={18} />
              </button>
              <h1 className="text-xl font-bold">
                {t("site.builder.header.cover_letter")}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleManualSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none
                      ${
                        saveStatus === "saved"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : ""
                      }
                      ${
                        saveStatus === "unsaved"
                          ? "bg-orange-500 text-white hover:bg-orange-600"
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
                  ) : (
                    <Cloud className="w-5 h-5" />
                  )}
                  <span className="sm:block hidden">
                    {saveStatus === "saved"
                      ? t("site.builder.header.save")
                      : saveStatus === "unsaved"
                      ? t("site.builder.header.save_changes")
                      : saveStatus === "saving"
                      ? t("site.builder.header.saving")
                      : t("site.builder.header.retry_save")}
                  </span>
                </button>
              </div>

              <a
                href="/builder"
                className="text-blue-600 hover:text-blue-800 hidden md:flex items-center gap-1 text-sm"
              >
                <FileText className="w-4 h-4" />
                CV Builder
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  disabled={isDownloading}
                >
                  <Download className="w-4 sm:h-4 h-[20px]" />
                  {t("site.builder.header.download")}
                </button>
                {showDownloadOptions && !isDownloading && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 download-modal-container">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowFilenameInput(true);
                          setShowDownloadOptions(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                      >
                        Download as PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto lg:max-w-full max-w-[700px] mx-auto w-full">
            <div className="p-4 space-y-4">
              {sectionOrder.map((section, index) => (
                <div
                  key={section}
                  className="border rounded-md overflow-hidden bg-white"
                  data-section={section}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div
                    className="flex items-center justify-between md:p-4 p-2 cursor-pointer"
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
                            if (e.key === "Enter") saveRenamedSection();
                            if (e.key === "Escape") {
                              setIsRenamingSection(false);
                              setSectionToRename(null);
                            }
                            e.stopPropagation();
                          }}
                          onBlur={saveRenamedSection}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          className="text-lg font-medium border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-white min-w-[150px]"
                        />
                      ) : (
                        <h2 className="md:text-lg font-medium">
                          {getSectionTitle(section)}
                          {sectionPages[section] === 2 && (
                            <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {t(
                                "site.builder.sections.actions.page_2_indicator"
                              )}
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
                                <Layout className="w-4 h-4 mr-2" />
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
                  {expandedSections[section] && (
                    <div className="border-t">
                      {renderActiveSectionInputs(section)}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddNewSection}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>{t("site.builder.sections.actions.add_section")}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-gray-50 lg:flex hidden flex-col">
          <div className="bg-white p-4 border-b border-gray-200 flex justify-start items-center">
            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-sm">{Math.round(zoom * 100)}%</span>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
              >
                <ZoomIn size={18} />
              </button>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={resetZoom}
                title="Reset Zoom"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-gray-200 flex justify-center p-8">
            <div
              className="bg-white shadow-lg"
              style={
                {
                  width: "210mm",
                  height: "297mm",
                  transform: `scale(${
                    zoom *
                    (window.innerWidth >= 1024 ? screenBasedScale : mobileScale)
                  })`,
                  transformOrigin: "top center",
                  fontFamily: fontFamily,
                  "--accent-color": accentColor,
                } as React.CSSProperties
              }
              ref={previewRef}
            >
              {template === "modern" && (
                <CoverLetterPreviewAlt
                  key={getTemplateKey()}
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                  language={language}
                />
              )}
              {template === "sherlock" && (
                <CoverLetterPreviewSherlock
                  key={getTemplateKey()}
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                  language={language}
                />
              )}
              {template === "minimal" && (
                <CoverLetterPreviewMinimal
                  key={getTemplateKey()}
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                  language={language}
                />
              )}
              {template === "classic" && (
                <CoverLetterPreviewClassic
                  key={getTemplateKey()}
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                  language={language}
                />
              )}
              {template === "professional" && (
                <CoverLetterPreviewProfessional
                  key={getTemplateKey()}
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                  language={language}
                />
              )}
              {template === "circulaire" && (
                <CoverLetterPreviewCirculaire
                  key={getTemplateKey()}
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                  language={language}
                />
              )}
              {template === "student" && (
                <CoverLetterPreviewStudent
                  key={getTemplateKey()}
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                  language={language}
                />
              )}
              {template === "hr" && (
                <CoverLetterPreviewHR
                  key={getTemplateKey()}
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                  language={language}
                />
              )}
              {template === "teal" && (
                <CoverLetterPreviewTeal
                  key={getTemplateKey()}
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                  language={language}
                />
              )}
            </div>
          </div>

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
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center ${
                      isTemplateLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={isTemplateLoading}
                    aria-label="Previous template"
                  >
                    {isTemplateLoading ? (
                      <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                    ) : (
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    )}
                  </button>

                  <div className="flex overflow-x-auto py-2 px-8 gap-4 snap-x">
                    {templateOptions.map((option, index) => (
                      <div
                        key={option.value}
                        className={`flex-none w-32 cursor-pointer transition-all duration-200 ${
                          index === activeTemplateIndex
                            ? "ring-2 ring-blue-500 scale-105"
                            : "hover:scale-105"
                        } ${
                          isTemplateLoading
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                        onClick={() =>
                          !isTemplateLoading && selectTemplate(index)
                        }
                      >
                        <div className="bg-white rounded-md shadow-sm overflow-hidden">
                          <div className="relative aspect-[0.7] bg-gray-100 flex items-center justify-center">
                            {option.image ? (
                              <img
                                src={option.image}
                                alt={option.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ backgroundColor: option.defaultColor }}
                              >
                                <span className="text-white font-medium">
                                  {option.name}
                                </span>
                              </div>
                            )}
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
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center ${
                      isTemplateLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                    disabled={isTemplateLoading}
                    aria-label="Next template"
                  >
                    {isTemplateLoading ? (
                      <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap md:gap-4 gap-2 justify-center items-center">
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

        {/* Mobile Preview Drawer */}
        <div className={`lg:hidden ${isDrawerOpen ? "block" : "hidden"}`}>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={handleDrawerClose}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-[90%] max-w-[600px] bg-gray-50 z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
            {/* Drawer header */}
            <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-1 rounded-md hover:bg-gray-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5 text-gray-700" />
                </button>
                <span className="text-sm font-medium">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                  className="p-1 rounded-md hover:bg-gray-200"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={resetZoom}
                  className="p-1 rounded-md hover:bg-gray-200 ml-2"
                  title="Reset Zoom"
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
            <div className="flex-1 overflow-y-auto flex justify-center bg-gray-200 p-4">
              <div
                className="bg-white shadow-lg transform-gpu transition-transform duration-200"
                style={
                  {
                    width: "210mm",
                    height: "297mm",
                    transform: `scale(${zoom * mobileScale})`,
                    transformOrigin: "top center",
                    fontFamily: fontFamily,
                    "--accent-color": accentColor,
                  } as React.CSSProperties
                }
              >
                {template === "modern" && (
                  <CoverLetterPreviewAlt
                    key={getTemplateKey()}
                    data={coverLetterData}
                    sectionOrder={sectionOrder}
                    accentColor={accentColor}
                    fontFamily={fontFamily}
                    sectionPages={sectionPages}
                    customSectionNames={customSectionNames}
                    customSections={customSections}
                    language={language}
                  />
                )}
                {template === "sherlock" && (
                  <CoverLetterPreviewSherlock
                    key={getTemplateKey()}
                    data={coverLetterData}
                    sectionOrder={sectionOrder}
                    accentColor={accentColor}
                    fontFamily={fontFamily}
                    sectionPages={sectionPages}
                    customSectionNames={customSectionNames}
                    customSections={customSections}
                    language={language}
                  />
                )}
                {template === "minimal" && (
                  <CoverLetterPreviewMinimal
                    key={getTemplateKey()}
                    data={coverLetterData}
                    sectionOrder={sectionOrder}
                    accentColor={accentColor}
                    fontFamily={fontFamily}
                    sectionPages={sectionPages}
                    customSectionNames={customSectionNames}
                    customSections={customSections}
                    language={language}
                  />
                )}
                {template === "classic" && (
                  <CoverLetterPreviewClassic
                    key={getTemplateKey()}
                    data={coverLetterData}
                    sectionOrder={sectionOrder}
                    accentColor={accentColor}
                    fontFamily={fontFamily}
                    sectionPages={sectionPages}
                    customSectionNames={customSectionNames}
                    customSections={customSections}
                    language={language}
                  />
                )}
                {template === "professional" && (
                  <CoverLetterPreviewProfessional
                    key={getTemplateKey()}
                    data={coverLetterData}
                    sectionOrder={sectionOrder}
                    accentColor={accentColor}
                    fontFamily={fontFamily}
                    sectionPages={sectionPages}
                    customSectionNames={customSectionNames}
                    customSections={customSections}
                    language={language}
                  />
                )}
                {template === "circulaire" && (
                  <CoverLetterPreviewCirculaire
                    key={getTemplateKey()}
                    data={coverLetterData}
                    sectionOrder={sectionOrder}
                    accentColor={accentColor}
                    fontFamily={fontFamily}
                    sectionPages={sectionPages}
                    customSectionNames={customSectionNames}
                    customSections={customSections}
                    language={language}
                  />
                )}
                {template === "student" && (
                  <CoverLetterPreviewStudent
                    key={getTemplateKey()}
                    data={coverLetterData}
                    sectionOrder={sectionOrder}
                    accentColor={accentColor}
                    fontFamily={fontFamily}
                    sectionPages={sectionPages}
                    customSectionNames={customSectionNames}
                    customSections={customSections}
                    language={language}
                  />
                )}
                {template === "hr" && (
                  <CoverLetterPreviewHR
                    key={getTemplateKey()}
                    data={coverLetterData}
                    sectionOrder={sectionOrder}
                    accentColor={accentColor}
                    fontFamily={fontFamily}
                    sectionPages={sectionPages}
                    customSectionNames={customSectionNames}
                    customSections={customSections}
                    language={language}
                  />
                )}
                {template === "teal" && (
                  <CoverLetterPreviewTeal
                    key={getTemplateKey()}
                    data={coverLetterData}
                    sectionOrder={sectionOrder}
                    accentColor={accentColor}
                    fontFamily={fontFamily}
                    sectionPages={sectionPages}
                    customSectionNames={customSectionNames}
                    customSections={customSections}
                    language={language}
                  />
                )}
              </div>
            </div>

            {/* Template selection */}
            <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 p-3 shadow-md">
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
                      disabled={isTemplateLoading}
                      aria-label="Previous template"
                    >
                      {isTemplateLoading ? (
                        <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      )}
                    </button>

                    <div className="flex overflow-x-auto py-2 px-8 gap-4 snap-x">
                      {templateOptions.map((option, index) => (
                        <div
                          key={option.value}
                          className={`flex-none w-32 cursor-pointer transition-all duration-200 ${
                            index === activeTemplateIndex
                              ? "ring-2 ring-blue-500 scale-105"
                              : "hover:scale-105"
                          } ${
                            isTemplateLoading
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }`}
                          onClick={() =>
                            !isTemplateLoading && selectTemplate(index)
                          }
                        >
                          <div className="bg-white rounded-md shadow-sm overflow-hidden">
                            <div className="relative aspect-[0.7] bg-gray-100 flex items-center justify-center">
                              {option.image ? (
                                <img
                                  src={option.image}
                                  alt={option.name}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: option.defaultColor,
                                  }}
                                >
                                  <span className="text-white font-medium">
                                    {option.name}
                                  </span>
                                </div>
                              )}
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
                      className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center ${
                        isTemplateLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                      disabled={isTemplateLoading}
                      aria-label="Next template"
                    >
                      {isTemplateLoading ? (
                        <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap md:gap-4 gap-2 justify-center items-center">
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

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          onSuccess={handlePaymentSuccess}
          type="cover-letter"
        />
      </div>
    </div>
  );
}
