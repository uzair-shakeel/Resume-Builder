import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";

// Dynamically import all CV preview components
const CVPreviewAlt = dynamic(() => import("./cv-preview-alt"));
const CVPreviewClassic = dynamic(() => import("./cv-preview-classic"));
const CVPreviewPro = dynamic(() => import("./cv-preview-pro"));
const CVPreviewSherlock = dynamic(() => import("./cv-preview-sherlock"));
const CVPreviewHR = dynamic(() => import("./cv-preview-hr"));
const CVPreviewMinimal = dynamic(() => import("./cv-preview-minimal"));
const CVPreviewTeal = dynamic(() => import("./cv-preview-teal"));
const CVPreviewCirculaire = dynamic(() => import("./cv-preview-circulaire"));
const CVPreviewStudent = dynamic(() => import("./cv-preview-student"));

interface CVPreviewGeneratorProps {
  cv: any;
  onPreviewGenerated: (preview: string) => void;
}

// Minimal default structure to prevent undefined errors
const defaultData = {
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
};

export default function CVPreviewGenerator({
  cv,
  onPreviewGenerated,
}: CVPreviewGeneratorProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generatePreview = async () => {
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
              scale: 2, // Higher quality
              useCORS: true,
              logging: false,
              width: 794, // A4 width in pixels at 96 DPI
              height: 1123, // A4 height in pixels at 96 DPI
            });
            const preview = canvas.toDataURL("image/jpeg", 0.9); // Higher JPEG quality
            onPreviewGenerated(preview);
          } catch (error) {
            console.error("Error generating preview:", error);
          }
        }
      }
    };

    const timeoutId = setTimeout(generatePreview, 500);
    return () => clearTimeout(timeoutId);
  }, [cv, onPreviewGenerated]);

  const renderTemplate = () => {
    // Ensure data structure is properly initialized
    const storedData = cv.data || {};
    const mergedData = {
      ...defaultData,
      ...storedData,
      // Ensure nested objects are also properly merged
      personalInfo: {
        ...defaultData.personalInfo,
        ...(storedData.personalInfo || {}),
      },
    };

    const commonProps = {
      data: mergedData,
      sectionOrder:
        cv.sectionOrder ||
        Object.keys(mergedData).filter((key) => key !== "personalInfo"),
      accentColor: cv.accentColor || "#3b82f6",
      fontFamily: cv.fontFamily || "'DejaVu Sans', sans-serif",
      sectionPages: cv.sectionPages || {},
      customSectionNames: cv.customSectionNames || {},
      pageBreakSettings: cv.pageBreakSettings || {},
    };

    switch (cv.template) {
      case "modern":
        return <CVPreviewAlt {...commonProps} />;
      case "classic":
        return <CVPreviewClassic {...commonProps} />;
      case "pro":
        return <CVPreviewPro {...commonProps} />;
      case "sherlock":
        return <CVPreviewSherlock {...commonProps} />;
      case "hr":
        return <CVPreviewHR {...commonProps} />;
      case "minimal":
        return <CVPreviewMinimal {...commonProps} />;
      case "teal":
        return <CVPreviewTeal {...commonProps} />;
      case "circulaire":
        return <CVPreviewCirculaire {...commonProps} />;
      case "student":
        return <CVPreviewStudent {...commonProps} />;
      default:
        return <CVPreviewAlt {...commonProps} />;
    }
  };

  return (
    <div
      ref={previewRef}
      className="absolute left-0 top-0 w-[21cm] scale-50 origin-top-left"
      style={
        {
          fontFamily: cv.fontFamily || "'DejaVu Sans', sans-serif",
          "--accent-color": cv.accentColor || "#3b82f6",
          backgroundColor: "transparent",
        } as React.CSSProperties
      }
    >
      {renderTemplate()}
    </div>
  );
}
