import React from "react";
import type { CoverLetterData } from "@/types";
import Image from "next/image";

interface CoverLetterPreviewTealProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
  language?: string;
}

export default function CoverLetterPreviewTeal({
  data,
  sectionOrder,
  accentColor = "#2BCBBA",
  fontFamily = "Arial, sans-serif",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
  language = "fr",
}: CoverLetterPreviewTealProps) {
  const {
    personalInfo,
    recipient,
    dateAndSubject,
    introduction,
    currentSituation,
    motivation,
    conclusion,
  } = data;

  // Filter sections for page 1 and page 2
  const page1Sections = sectionOrder.filter(
    (section) => !sectionPages[section] || sectionPages[section] === 1
  );
  const page2Sections = sectionOrder.filter(
    (section) => sectionPages[section] === 2
  );
  const hasPage2 = page2Sections.length > 0;

  // Helper function to get section title with custom names
  const getSectionTitle = (section: string): string => {
    // If there's a custom name for this section, use it
    if (customSectionNames && customSectionNames[section]) {
      return customSectionNames[section];
    }

    // Otherwise use the default name
    switch (section) {
      case "personal-info":
        return "Personal Information";
      case "destinataire":
        return "Recipient";
      case "date-et-objet":
        return "Date and Subject";
      case "introduction":
        return "Introduction";
      case "situation-actuelle":
        return "Current Situation";
      case "motivation":
        return "Motivation";
      case "conclusion":
        return "Conclusion";
      default:
        if (section.startsWith("custom-")) {
          return "Custom Section";
        }
        return section;
    }
  };

  // Render header with personal info
  const renderHeader = () => {
    return (
      <div className="bg-gray-100 p-4">
        {/* Header with name and photo */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-medium" style={{ color: accentColor }}>
              {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
            </h1>
            <div className="text-xl text-gray-600 mt-1">
              {personalInfo?.title || ""}
            </div>
          </div>
          {personalInfo?.photo && (
            <div
              className="w-24 h-24 rounded-full overflow-hidden border-2"
              style={{ borderColor: accentColor }}
            >
              <Image
                src={personalInfo.photo || "/placeholder-user.jpg"}
                alt={`${personalInfo?.firstName || ""} ${
                  personalInfo?.lastName || ""
                }`}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Contact information */}
        <div className="flex flex-wrap gap-y-2 mb-6">
          <div className="flex items-center mr-6">
            <span className="mr-2" style={{ color: accentColor }}>
              ✉
            </span>
            <span>{personalInfo?.email || ""}</span>
          </div>
          <div className="flex items-center mr-6">
            <span className="mr-2" style={{ color: accentColor }}>
              ☏
            </span>
            <span>{personalInfo?.phone || ""}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2" style={{ color: accentColor }}>
              ⌂
            </span>
            <span>
              {personalInfo?.address || ""}
              {personalInfo?.city && `, ${personalInfo?.city}`}
              {personalInfo?.postalCode && `, ${personalInfo?.postalCode}`}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render recipient section
  const renderRecipient = () => {
    return (
      <div className="py-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <div>
                <p className="font-bold">{recipient?.company || ""}</p>
                <p>{recipient?.name || ""}</p>
                <p>{recipient?.address || ""}</p>
                <p className="text-gray-600">
                  {recipient?.postalCode || ""} {recipient?.city || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render date and subject section
  const renderDateAndSubject = () => {
    return (
      <div className="pb-8">
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Objet:</strong>{" "}
            <span
              dangerouslySetInnerHTML={{
                __html: dateAndSubject?.subject || "",
              }}
            />
          </p>
        </div>
      </div>
    );
  };

  // Render introduction section
  const renderIntroduction = () => {
    return (
      <div className="mb-8">
        <div
          dangerouslySetInnerHTML={{
            __html: introduction || "",
          }}
          className="text-gray-700"
        />
      </div>
    );
  };

  // Render current situation section
  const renderCurrentSituation = () => {
    return (
      <div className="mb-8">
        <div
          dangerouslySetInnerHTML={{
            __html: currentSituation || "",
          }}
          className="text-gray-700"
        />
      </div>
    );
  };

  // Render motivation section
  const renderMotivation = () => {
    return (
      <div className="mb-8">
        <div
          dangerouslySetInnerHTML={{
            __html: motivation || "",
          }}
          className="text-gray-700"
        />
      </div>
    );
  };

  // Render conclusion section
  const renderConclusion = () => {
    return (
      <div className="mb-8">
        <div
          dangerouslySetInnerHTML={{
            __html: conclusion || "",
          }}
          className="text-gray-700"
        />
      </div>
    );
  };

  // Render custom section
  const renderCustomSection = (section: string) => {
    return (
      <div className="mb-8">
        <div
          dangerouslySetInnerHTML={{
            __html: customSections?.[section] || "",
          }}
          className="text-gray-700"
        />
      </div>
    );
  };

  // Helper function to render a section based on its type
  const renderSection = (section: string) => {
    switch (section) {
      case "personal-info":
        return null; // Personal info is in the header
      case "destinataire":
        return renderRecipient();
      case "date-et-objet":
        return renderDateAndSubject();
      case "introduction":
        return renderIntroduction();
      case "situation-actuelle":
        return renderCurrentSituation();
      case "motivation":
        return renderMotivation();
      case "conclusion":
        return renderConclusion();
      default:
        if (section.startsWith("custom-")) {
          return renderCustomSection(section);
        }
        return null;
    }
  };

  return (
    <div className={`cv-preview-teal font-${fontFamily}`}>
      {/* Page 1 */}
      <div className="cv-page bg-white">
        <div className="cv-page-content mx-auto">
          {renderHeader()}
          <div className="p-4">
            {page1Sections.map((section) => (
              <div key={section}>{renderSection(section)}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div className="cv-page bg-white mt-8 print:mt-0">
          <div className="cv-page-content mx-auto">
            {renderHeader()}
            <div className="p-4">
              {page2Sections.map((section) => (
                <div key={section}>{renderSection(section)}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cv-page {
          width: 210mm;
          min-height: 297mm;
          position: relative;
          margin: 0 auto;
          background: white;
        }
        .cv-page-content {
          height: 100%;
        }
        @media print {
          .cv-page + .cv-page {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
}
