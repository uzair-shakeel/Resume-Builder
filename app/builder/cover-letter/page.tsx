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
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import RichTextEditor from "@/components/shared/rich-text-editor";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

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

// Add this after the colorThemes constant
const introductionOptions = [
  {
    label: "Réponse à une annonce publiée en ligne",
    value: "online",
    template:
      "En réponse à votre annonce publiée sur [Site] concernant le poste de [Poste], je vous soumets ma candidature avec grand intérêt.",
  },
  {
    label: "Candidature spontanée",
    value: "spontaneous",
    template:
      "Je me permets de vous adresser ma candidature spontanée pour un poste de [Poste] au sein de votre entreprise.",
  },
  {
    label: "Réponse à une annonce publiée dans un journal ou un magazine",
    value: "print",
    template:
      "Suite à votre annonce parue dans [Journal/Magazine] du [Date] pour le poste de [Poste], je vous présente ma candidature.",
  },
  {
    label: "Autre",
    value: "other",
    template: "",
  },
];

// Add this after the introductionOptions constant
const situationOptions = [
  {
    label: "Je suis actuellement en poste",
    value: "employed",
    template:
      "Je travaille actuellement en tant que [Poste actuel] chez [Entreprise] à [Ville]. Dans ce poste, je suis responsable de [Responsabilités].",
  },
  {
    label: "Je suis actuellement en poste et j'ai récemment terminé mes études",
    value: "employed_graduate",
    template:
      "Je travaille actuellement en tant que [Poste actuel] chez [Entreprise] à [Ville]. Dans ce poste, je suis responsable de [Responsabilités]. J'ai terminé mes études de [Formation] à [Établissement].",
  },
  {
    label: "Je suis actuellement en poste et je dispose d'une large expérience",
    value: "employed_experienced",
    template:
      "Je travaille actuellement en tant que [Poste actuel] chez [Entreprise] à [Ville]. Avec [X] années d'expérience dans [Domaine], j'ai développé une expertise solide en [Compétences clés].",
  },
  {
    label: "J'ai terminé mes études",
    value: "graduate",
    template:
      "Je viens de terminer mes études de [Formation] à [Établissement], où j'ai acquis de solides connaissances en [Domaines d'expertise].",
  },
  {
    label: "Je suis étudiant(e)",
    value: "student",
    template:
      "Je suis actuellement en [Année/Niveau] de [Formation] à [Établissement], où je me spécialise en [Spécialisation].",
  },
  {
    label: "Je suis actuellement sans emploi",
    value: "unemployed",
    template:
      "Suite à [Raison], je suis actuellement en recherche active d'un nouveau défi professionnel qui me permettra de mettre à profit mes compétences en [Compétences].",
  },
];

// Add this after the situationOptions constant
const motivationOptions = [
  {
    label: "Axé sur la carrière",
    value: "career",
    template:
      "Votre entreprise représente pour moi une opportunité unique de développement professionnel. Je suis particulièrement intéressé(e) par [Aspect spécifique] et je souhaite mettre à profit mes compétences en [Compétences clés] au sein de votre équipe. Mon expérience en [Domaine d'expertise] me permettra d'apporter une contribution significative à [Projets/Objectifs de l'entreprise].",
  },
  {
    label: "Axé sur la formation",
    value: "education",
    template:
      "Ma formation en [Formation] m'a permis d'acquérir de solides connaissances en [Domaines d'expertise], que je souhaite mettre en pratique au sein de votre entreprise. Les projets que j'ai réalisés durant mes études, notamment [Projet clé], m'ont préparé(e) aux défis que représente ce poste.",
  },
  {
    label: "Axé sur l'expérience",
    value: "experience",
    template:
      "Fort(e) de mon expérience de [X] années dans [Secteur], j'ai développé une expertise approfondie en [Compétences spécifiques]. Ces compétences, associées à ma connaissance du secteur [Secteur d'activité], seront des atouts précieux pour contribuer à [Objectifs/Projets de l'entreprise].",
  },
  {
    label: "Axé sur l'entreprise",
    value: "company",
    template:
      "Votre entreprise se distingue par [Caractéristique/Valeur de l'entreprise], ce qui correspond parfaitement à ma vision professionnelle. Je suis particulièrement impressionné(e) par [Réalisation/Projet de l'entreprise] et je souhaite contribuer activement à vos futurs succès en apportant [Compétences/Expertise].",
  },
  {
    label: "Axé sur l'innovation",
    value: "innovation",
    template:
      "L'innovation étant au cœur de mes préoccupations, je suis enthousiasmé(e) par [Projet/Technologie innovante] développé(e) par votre entreprise. Mon expérience en [Domaine technique/Innovation] et ma capacité à [Compétence spécifique] me permettront de contribuer efficacement à vos projets innovants.",
  },
  {
    label: "Autre",
    value: "other",
    template: "",
  },
];

// Add this after the motivationOptions constant
const conclusionOptions = [
  {
    label: "Réponse à une offre d'emploi",
    value: "job_offer",
    template:
      "Je souhaiterais vous expliquer plus précisément ma motivation pour le poste de [Emploi recherché] lors d'un entretien. Vous pouvez me joindre par téléphone au [Téléphone], ou par e-mail à l'adresse suivante : [Adresse e-mail].<br/><br/>Je vous remercie par avance de la considération que vous portez à ma candidature.<br/><br/>Cordialement,<br/><br/>[Prénom] [Nom]<br/><br/>Pièce jointe : CV",
  },
  {
    label: "Candidature spontanée",
    value: "spontaneous",
    template:
      "Je reste à votre disposition pour vous rencontrer lors d'un entretien et vous exposer plus en détail mes motivations. Vous pouvez me joindre par téléphone au [Téléphone], ou par e-mail à l'adresse suivante : [Adresse e-mail].<br/><br/>Je vous remercie de l'attention que vous porterez à ma candidature.<br/><br/>Cordialement,<br/><br/>[Prénom] [Nom]<br/><br/>Pièce jointe : CV",
  },
  {
    label: "Stage/Alternance",
    value: "internship",
    template:
      "Je suis disponible pour un entretien afin d'échanger sur les modalités du [Type de contrat] et vous présenter plus en détail mon parcours. Vous pouvez me joindre par téléphone au [Téléphone], ou par e-mail à l'adresse suivante : [Adresse e-mail].<br/><br/>Je vous remercie par avance de l'attention que vous porterez à ma candidature.<br/><br/>Cordialement,<br/><br/>[Prénom] [Nom]<br/><br/>Pièce jointe : CV",
  },
  {
    label: "Recommandation",
    value: "referral",
    template:
      "Je me tiens à votre disposition pour un entretien où je pourrai vous exposer plus en détail mes motivations. Comme suggéré par [Contact], vous pouvez me joindre par téléphone au [Téléphone], ou par e-mail à l'adresse suivante : [Adresse e-mail].<br/><br/>Je vous remercie par avance de l'attention que vous porterez à ma candidature.<br/><br/>Cordialement,<br/><br/>[Prénom] [Nom]<br/><br/>Pièce jointe : CV",
  },
  {
    label: "Autre",
    value: "other",
    template: "",
  },
];

// Add template options
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
    name: "Professional",
    value: "professional",
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
  {
    name: "Student",
    value: "student",
    image: "/assets/student-resume.jpg",
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
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
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

  const [screenBasedScale, setScreenBasedScale] = useState(1);
  const [mobileScale, setMobileScale] = useState(0.8);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Safe reset function to prevent getting stuck in loading state
  const safeResetTemplateLoadingState = useCallback(() => {
    setIsTemplateLoading(false);
    isChangingTemplate.current = false;
    if (templateLoadingTimeoutRef.current) {
      clearTimeout(templateLoadingTimeoutRef.current);
      templateLoadingTimeoutRef.current = null;
    }
  }, []);

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

    // Save the template change to the database immediately
    if (coverId) {
      saveCoverLetter()
        .then(() => {
          // Verify URL consistency
          const urlTemplate = new URL(window.location.href).searchParams.get(
            "template"
          );
          if (urlTemplate !== selectedTemplateValue) {
            console.error(
              `URL template mismatch! URL: ${urlTemplate}, Selected: ${selectedTemplateValue}`
            );
            // Force URL update
            const fixUrl = new URL(window.location.href);
            fixUrl.searchParams.set("template", selectedTemplateValue);
            window.history.replaceState({}, "", fixUrl.toString());
          }

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
        })
        .catch((error) => {
          console.error("Error saving template change:", error);
          safeResetTemplateLoadingState(); // Reset on error
        });
    } else {
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
    }
  };

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

    // Save the template change to the database immediately
    if (coverId) {
      saveCoverLetter()
        .then(() => {
          // Verify URL consistency
          const urlTemplate = new URL(window.location.href).searchParams.get(
            "template"
          );
          if (urlTemplate !== selectedTemplateValue) {
            console.error(
              `URL template mismatch! URL: ${urlTemplate}, Selected: ${selectedTemplateValue}`
            );
            // Force URL update
            const fixUrl = new URL(window.location.href);
            fixUrl.searchParams.set("template", selectedTemplateValue);
            window.history.replaceState({}, "", fixUrl.toString());
          }

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
        })
        .catch((error) => {
          console.error("Error saving template change:", error);
          safeResetTemplateLoadingState(); // Reset on error
        });
    } else {
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
    }
  };

  const selectTemplate = (index: number) => {
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

    // Save the template change to the database immediately
    if (coverId) {
      saveCoverLetter()
        .then(() => {
          // Verify URL consistency
          const urlTemplate = new URL(window.location.href).searchParams.get(
            "template"
          );
          if (urlTemplate !== selectedTemplateValue) {
            console.error(
              `URL template mismatch! URL: ${urlTemplate}, Selected: ${selectedTemplateValue}`
            );
            // Force URL update
            const fixUrl = new URL(window.location.href);
            fixUrl.searchParams.set("template", selectedTemplateValue);
            window.history.replaceState({}, "", fixUrl.toString());
          }

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
        })
        .catch((error) => {
          console.error("Error saving template change:", error);
          safeResetTemplateLoadingState(); // Reset on error
        });
    } else {
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
    }
  };

  const loadCoverLetter = async () => {
    try {
      const response = await fetch(`/api/cover-letter/load?coverId=${coverId}`);
      const data = await response.json();

      if (data.success) {
        setCoverLetterData(data.coverLetter.data);
        setTemplate(data.coverLetter.template || "modern");
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
        setAccentColor(data.coverLetter.accentColor || colorThemes[0].value);
        setFontFamily(data.coverLetter.fontFamily || fontFamilies[0].value);
        setCustomSectionNames(data.coverLetter.customSectionNames || {});
        setSectionPages(data.coverLetter.sectionPages || {});
        setCustomSections(data.coverLetter.customSections || {});

        const sectionsWithData = Object.entries(
          data.coverLetter.data || {}
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
      }
    } catch (error) {
      console.error("Error loading cover letter:", error);
      setSaveStatus("error");
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

      // Get the current Cover Letter ID from the URL, which might have been updated
      const currentCoverId =
        new URLSearchParams(window.location.search).get("id") || coverId;

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
        if (!currentCoverId && data.coverLetter._id) {
          window.history.replaceState(
            {},
            "",
            `/builder/cover-letter?id=${data.coverLetter._id}`
          );
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

  const debouncedSave = (immediate = false) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (immediate) {
      saveCoverLetter();
    } else {
      setSaveStatus("saving");
      saveTimeoutRef.current = setTimeout(saveCoverLetter, 2000);
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

    // Use standard debounce for batch updates
    debouncedSave(false);
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

    // Set a timeout to save after user stops typing
    throttledInputRef.current.timeout = setTimeout(() => {
      // Only save if the value is still the same
      if (throttledInputRef.current.value === value) {
        updateCoverLetterData(section, field, value);
      }
    }, 1000);
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

    // Only save immediately for completed personal info changes
    // For all other changes, use the longer debounce
    const shouldSaveImmediately =
      section === "personalInfo" &&
      field === "firstName" &&
      typeof value === "string" &&
      value.length > 0 &&
      !!coverLetterData.personalInfo?.lastName;

    debouncedSave(shouldSaveImmediately);
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
    }
  };

  const handleDeleteSection = (section: string) => {
    setSectionOrder((prev) => prev.filter((s) => s !== section));
    setActiveSectionMenu(null);
  };

  const handleAssignSectionToPage = (section: string, page: number) => {
    console.log(`Assigning section ${section} to page ${page}`);
    setSectionPages((prev) => {
      const newSectionPages = {
        ...prev,
        [section]: page,
      };
      console.log("Updated section pages:", newSectionPages);
      return newSectionPages;
    });
    setActiveSectionMenu(null);
    debouncedSave(true); // Save immediately when section page is changed
  };

  const toggleSectionMenu = (section: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSectionMenu(activeSectionMenu === section ? null : section);
  };

  const getSectionTitle = (section: string): string => {
    // Base section names
    switch (section) {
      case "personal-info":
        return t(
          "site.builder_cover_letter.sections.personal_info"
        );
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

  const generatePDF = async () => {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("cover-letter.pdf");
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
          Entreprise
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="[Entreprise]"
          value={coverLetterData.recipient.company}
          onChange={(e) =>
            handleThrottledInput("recipient", "company", e.target.value)
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="[Contact]"
          value={coverLetterData.recipient.name}
          onChange={(e) =>
            handleThrottledInput("recipient", "name", e.target.value)
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="[Adresse]"
          value={coverLetterData.recipient.address}
          onChange={(e) =>
            handleThrottledInput("recipient", "address", e.target.value)
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code postal
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="[Code postal]"
            value={coverLetterData.recipient.postalCode}
            onChange={(e) =>
              handleThrottledInput("recipient", "postalCode", e.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ville
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="[Ville]"
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
            Ville
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="[Ville]"
            value={coverLetterData.dateAndSubject.location}
            onChange={(e) =>
              handleThrottledInput("dateAndSubject", "location", e.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={coverLetterData.dateAndSubject.date}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Objet
        </label>
        <RichTextEditor
          value={coverLetterData.dateAndSubject.subject}
          onChange={(value) =>
            handleThrottledInput("dateAndSubject", "subject", value)
          }
          placeholder="[Type de candidature] [Emploi recherché]"
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
            Sélectionnez le contenu
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
            placeholder="Personnalisez votre introduction..."
          />
          <div className="p-3 mt-2 bg-gray-50 rounded-md text-sm text-gray-600">
            <p>Remplacez les éléments entre crochets par vos informations :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {selectedIntroOption === "online" && (
                <>
                  <li>[Site] : Le site web où l'annonce a été publiée</li>
                  <li>[Poste] : L'intitulé du poste</li>
                </>
              )}
              {selectedIntroOption === "spontaneous" && (
                <li>[Poste] : Le poste que vous visez</li>
              )}
              {selectedIntroOption === "print" && (
                <>
                  <li>[Journal/Magazine] : Le nom du support de publication</li>
                  <li>[Date] : La date de parution</li>
                  <li>[Poste] : L'intitulé du poste</li>
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
            Sélectionnez le contenu
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
            placeholder="Personnalisez votre situation actuelle..."
          />
          <div className="p-3 mt-2 bg-gray-50 rounded-md text-sm text-gray-600">
            <p>Remplacez les éléments entre crochets par vos informations :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {selectedSituationOption === "employed" && (
                <>
                  <li>[Poste actuel] : Votre poste actuel</li>
                  <li>[Entreprise] : Nom de votre entreprise actuelle</li>
                  <li>[Ville] : Ville où vous travaillez</li>
                  <li>[Responsabilités] : Vos principales responsabilités</li>
                </>
              )}
              {selectedSituationOption === "employed_graduate" && (
                <>
                  <li>[Poste actuel] : Votre poste actuel</li>
                  <li>[Entreprise] : Nom de votre entreprise actuelle</li>
                  <li>[Ville] : Ville où vous travaillez</li>
                  <li>[Responsabilités] : Vos principales responsabilités</li>
                  <li>[Formation] : Votre diplôme ou formation</li>
                  <li>[Établissement] : Nom de votre école/université</li>
                </>
              )}
              {selectedSituationOption === "employed_experienced" && (
                <>
                  <li>[Poste actuel] : Votre poste actuel</li>
                  <li>[Entreprise] : Nom de votre entreprise actuelle</li>
                  <li>[Ville] : Ville où vous travaillez</li>
                  <li>[X] : Nombre d'années d'expérience</li>
                  <li>[Domaine] : Votre domaine d'expertise</li>
                  <li>[Compétences clés] : Vos principales compétences</li>
                </>
              )}
              {selectedSituationOption === "graduate" && (
                <>
                  <li>[Formation] : Votre diplôme ou formation</li>
                  <li>[Établissement] : Nom de votre école/université</li>
                  <li>
                    [Domaines d'expertise] : Vos domaines de spécialisation
                  </li>
                </>
              )}
              {selectedSituationOption === "student" && (
                <>
                  <li>[Année/Niveau] : Votre niveau d'études actuel</li>
                  <li>[Formation] : Votre formation en cours</li>
                  <li>[Établissement] : Nom de votre école/université</li>
                  <li>[Spécialisation] : Votre domaine de spécialisation</li>
                </>
              )}
              {selectedSituationOption === "unemployed" && (
                <>
                  <li>[Raison] : Contexte de votre recherche</li>
                  <li>[Compétences] : Vos principales compétences</li>
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
            Sélectionnez le contenu
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
            placeholder="Personnalisez votre motivation..."
          />
          <div className="p-3 mt-2 bg-gray-50 rounded-md text-sm text-gray-600">
            <p>Remplacez les éléments entre crochets par vos informations :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {selectedMotivationOption === "career" && (
                <>
                  <li>
                    [Aspect spécifique] : Un aspect particulier de l'entreprise
                    qui vous intéresse
                  </li>
                  <li>
                    [Compétences clés] : Vos principales compétences pertinentes
                  </li>
                  <li>
                    [Domaine d'expertise] : Votre domaine de spécialisation
                  </li>
                  <li>
                    [Projets/Objectifs de l'entreprise] : Les projets ou
                    objectifs de l'entreprise auxquels vous souhaitez contribuer
                  </li>
                </>
              )}
              {selectedMotivationOption === "education" && (
                <>
                  <li>[Formation] : Votre diplôme ou formation</li>
                  <li>
                    [Domaines d'expertise] : Vos domaines de spécialisation
                  </li>
                  <li>
                    [Projet clé] : Un projet significatif réalisé pendant vos
                    études
                  </li>
                </>
              )}
              {selectedMotivationOption === "experience" && (
                <>
                  <li>[X] : Nombre d'années d'expérience</li>
                  <li>[Secteur] : Votre secteur d'activité</li>
                  <li>
                    [Compétences spécifiques] : Vos compétences techniques ou
                    professionnelles
                  </li>
                  <li>
                    [Secteur d'activité] : Le secteur d'activité de l'entreprise
                  </li>
                  <li>
                    [Objectifs/Projets de l'entreprise] : Les objectifs ou
                    projets de l'entreprise
                  </li>
                </>
              )}
              {selectedMotivationOption === "company" && (
                <>
                  <li>
                    [Caractéristique/Valeur de l'entreprise] : Un aspect
                    distinctif ou une valeur de l'entreprise
                  </li>
                  <li>
                    [Réalisation/Projet de l'entreprise] : Une réalisation ou un
                    projet de l'entreprise
                  </li>
                  <li>
                    [Compétences/Expertise] : Vos compétences ou expertise
                    pertinentes
                  </li>
                </>
              )}
              {selectedMotivationOption === "innovation" && (
                <>
                  <li>
                    [Projet/Technologie innovante] : Un projet ou une
                    technologie de l'entreprise
                  </li>
                  <li>
                    [Domaine technique/Innovation] : Votre domaine technique ou
                    d'innovation
                  </li>
                  <li>
                    [Compétence spécifique] : Une compétence technique
                    spécifique
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
            Sélectionnez le contenu
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
            placeholder="Personnalisez votre conclusion..."
          />
          <div className="p-3 mt-2 bg-gray-50 rounded-md text-sm text-gray-600">
            <p>Remplacez les éléments entre crochets par vos informations :</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {selectedConclusionOption === "job_offer" && (
                <>
                  <li>
                    [Emploi recherché] : Le poste pour lequel vous postulez
                  </li>
                  <li>[Téléphone] : Votre numéro de téléphone</li>
                  <li>[Adresse e-mail] : Votre adresse e-mail</li>
                  <li>[Prénom] : Votre prénom</li>
                  <li>[Nom] : Votre nom</li>
                </>
              )}
              {selectedConclusionOption === "spontaneous" && (
                <>
                  <li>[Téléphone] : Votre numéro de téléphone</li>
                  <li>[Adresse e-mail] : Votre adresse e-mail</li>
                  <li>[Prénom] : Votre prénom</li>
                  <li>[Nom] : Votre nom</li>
                </>
              )}
              {selectedConclusionOption === "internship" && (
                <>
                  <li>[Type de contrat] : Stage ou Alternance</li>
                  <li>[Téléphone] : Votre numéro de téléphone</li>
                  <li>[Adresse e-mail] : Votre adresse e-mail</li>
                  <li>[Prénom] : Votre prénom</li>
                  <li>[Nom] : Votre nom</li>
                </>
              )}
              {selectedConclusionOption === "referral" && (
                <>
                  <li>[Contact] : La personne qui vous a recommandé</li>
                  <li>[Téléphone] : Votre numéro de téléphone</li>
                  <li>[Adresse e-mail] : Votre adresse e-mail</li>
                  <li>[Prénom] : Votre prénom</li>
                  <li>[Nom] : Votre nom</li>
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
    const date = e.target.value
      ? new Date(e.target.value).toLocaleDateString("fr-FR")
      : "";
    handleThrottledInput("dateAndSubject", "date", date);
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
  const createNewCoverLetter = async () => {
    try {
      setSaveStatus("saving");

      const response = await fetch("/api/cover-letter/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled Cover Letter",
          data: coverLetterData,
          template,
          sectionOrder,
          accentColor,
          fontFamily,
          customSectionNames,
          sectionPages,
          customSections,
          lastEdited: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveStatus("saved");
        // Update the URL with the new Cover Letter ID
        window.history.replaceState(
          {},
          "",
          `/builder/cover-letter?id=${data.coverLetter._id}`
        );
      } else {
        setSaveStatus("error");
        console.error("Error creating new Cover Letter:", data.error);
      }
    } catch (error) {
      console.error("Error creating new Cover Letter:", error);
      setSaveStatus("error");
    }
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

  return (
    <div className="flex h-screen bg-gray-100">
<<<<<<< HEAD
      <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">
              {t("site.builder.header.cover_letter")}
            </h1>
=======
      <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-200 bg-white">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center gap-2">
          <div className="flex items-center md:gap-4 gap-2">
            <h1 className="text-xl font-bold">Lettre de motivation</h1>
>>>>>>> 37fa46e1ea44b1995a5a7a0d34d07fe824d0e014
            <div className="text-gray-500">
              {saveStatus === "saved" && <Cloud className="w-5 h-5" />}
              {saveStatus === "saving" && (
                <RefreshCw className="w-5 h-5 animate-spin" />
              )}
              {saveStatus === "error" && (
                <CloudOff className="w-5 h-5 text-red-500" />
              )}
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Download className="w-5 h-5" />
              </button>
              {showDownloadOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        generatePDF();
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
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
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
        <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded hover:bg-gray-100"
<<<<<<< HEAD
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <ChevronLeft /> : <ChevronRight />}
            </button>
            <h2 className="text-lg font-semibold">
              {t("site.builder.preview")}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded hover:bg-gray-100"
=======
>>>>>>> 37fa46e1ea44b1995a5a7a0d34d07fe824d0e014
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
<<<<<<< HEAD
            <div className="relative">
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              >
                <Download size={18} />
              </button>
              {showDownloadOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        generatePDF();
                        setShowDownloadOptions(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      {t("site.builder.header.download")}
                    </button>
                  </div>
                </div>
              )}
            </div>
=======
>>>>>>> 37fa46e1ea44b1995a5a7a0d34d07fe824d0e014
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
                data={coverLetterData}
                sectionOrder={sectionOrder}
                accentColor={accentColor}
                fontFamily={fontFamily}
                sectionPages={sectionPages}
                customSectionNames={customSectionNames}
                customSections={customSections}
              />
            )}
            {template === "sherlock" && (
              <CoverLetterPreviewSherlock
                data={coverLetterData}
                sectionOrder={sectionOrder}
                accentColor={accentColor}
                fontFamily={fontFamily}
                sectionPages={sectionPages}
                customSectionNames={customSectionNames}
                customSections={customSections}
              />
            )}
            {template === "minimal" && (
              <CoverLetterPreviewMinimal
                data={coverLetterData}
                sectionOrder={sectionOrder}
                accentColor={accentColor}
                fontFamily={fontFamily}
                sectionPages={sectionPages}
                customSectionNames={customSectionNames}
                customSections={customSections}
              />
            )}
            {template === "classic" && (
              <CoverLetterPreviewClassic
                data={coverLetterData}
                sectionOrder={sectionOrder}
                accentColor={accentColor}
                fontFamily={fontFamily}
                sectionPages={sectionPages}
                customSectionNames={customSectionNames}
                customSections={customSections}
              />
            )}
            {template === "professional" && (
              <CoverLetterPreviewProfessional
                data={coverLetterData}
                sectionOrder={sectionOrder}
                accentColor={accentColor}
                fontFamily={fontFamily}
                sectionPages={sectionPages}
                customSectionNames={customSectionNames}
                customSections={customSections}
              />
            )}
            {template === "circulaire" && (
              <CoverLetterPreviewCirculaire
                data={coverLetterData}
                sectionOrder={sectionOrder}
                accentColor={accentColor}
                fontFamily={fontFamily}
                sectionPages={sectionPages}
                customSectionNames={customSectionNames}
                customSections={customSections}
              />
            )}
            {template === "student" && (
              <CoverLetterPreviewStudent
                data={coverLetterData}
                sectionOrder={sectionOrder}
                accentColor={accentColor}
                fontFamily={fontFamily}
                sectionPages={sectionPages}
                customSectionNames={customSectionNames}
                customSections={customSections}
              />
            )}
            {template === "hr" && (
              <CoverLetterPreviewHR
                data={coverLetterData}
                sectionOrder={sectionOrder}
                accentColor={accentColor}
                fontFamily={fontFamily}
                sectionPages={sectionPages}
                customSectionNames={customSectionNames}
                customSections={customSections}
              />
            )}
            {template === "teal" && (
              <CoverLetterPreviewTeal
                data={coverLetterData}
                sectionOrder={sectionOrder}
                accentColor={accentColor}
                fontFamily={fontFamily}
                sectionPages={sectionPages}
                customSectionNames={customSectionNames}
                customSections={customSections}
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
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                />
              )}
              {template === "sherlock" && (
                <CoverLetterPreviewSherlock
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                />
              )}
              {template === "minimal" && (
                <CoverLetterPreviewMinimal
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                />
              )}
              {template === "classic" && (
                <CoverLetterPreviewClassic
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                />
              )}
              {template === "professional" && (
                <CoverLetterPreviewProfessional
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                />
              )}
              {template === "circulaire" && (
                <CoverLetterPreviewCirculaire
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                />
              )}
              {template === "student" && (
                <CoverLetterPreviewStudent
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                />
              )}
              {template === "hr" && (
                <CoverLetterPreviewHR
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                />
              )}
              {template === "teal" && (
                <CoverLetterPreviewTeal
                  data={coverLetterData}
                  sectionOrder={sectionOrder}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  sectionPages={sectionPages}
                  customSectionNames={customSectionNames}
                  customSections={customSections}
                />
              )}
            </div>
          </div>

          {/* Template selection */}
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
  );
}
