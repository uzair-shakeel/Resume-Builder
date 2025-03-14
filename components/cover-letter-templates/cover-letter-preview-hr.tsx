import React from "react";
import type { CoverLetterData } from "@/types";
import { getPlaceholder } from "@/lib/placeholder-data";

interface CoverLetterPreviewHRProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
  language?: string;
}

export default function CoverLetterPreviewHR({
  data,
  sectionOrder,
  accentColor = "#9b59b6",
  fontFamily = "Arial, sans-serif",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
  language = "fr",
}: CoverLetterPreviewHRProps) {
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
      return customSectionNames[section].toUpperCase();
    }

    // Otherwise use the default name
    switch (section) {
      case "personal-info":
        return "INFORMATIONS PERSONNELLES";
      case "destinataire":
        return "DESTINATAIRE";
      case "date-et-objet":
        return "DATE ET OBJET";
      case "introduction":
        return "INTRODUCTION";
      case "situation-actuelle":
        return "SITUATION ACTUELLE";
      case "motivation":
        return "MOTIVATION";
      case "conclusion":
        return "CONCLUSION";
      default:
        if (section.startsWith("custom-")) {
          return "SECTION PERSONNALISÉE";
        }
        return section.toUpperCase();
    }
  };

  const renderPersonalInfo = () => {
    return (
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          {getPlaceholder(
            "personalInfo",
            "firstName",
            personalInfo?.firstName,
            language
          )}{" "}
          {getPlaceholder(
            "personalInfo",
            "lastName",
            personalInfo?.lastName,
            language
          )}
        </h1>
        <p className="text-xl mb-4 text-gray-700">
          {getPlaceholder(
            "personalInfo",
            "title",
            personalInfo?.title,
            language
          )}
        </p>
        <div className="flex justify-center space-x-4 text-sm text-gray-600">
          <span>
            {getPlaceholder(
              "personalInfo",
              "email",
              personalInfo?.email,
              language
            )}
          </span>
          <span>|</span>
          <span>
            {getPlaceholder(
              "personalInfo",
              "phone",
              personalInfo?.phone,
              language
            )}
          </span>
          <span>|</span>
          <span>
            {getPlaceholder(
              "personalInfo",
              "address",
              personalInfo?.address,
              language
            )}
            ,{" "}
            {getPlaceholder(
              "personalInfo",
              "postalCode",
              personalInfo?.postalCode,
              language
            )}{" "}
            {getPlaceholder(
              "personalInfo",
              "city",
              personalInfo?.city,
              language
            )}
          </span>
        </div>
      </div>
    );
  };

  const renderRecipient = () => {
    return (
      <div className="mb-6 keep-together">
        {/* <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("destinataire")}
        </h2> */}
        <div className="space-y-2 text-sm">
          <p className="font-semibold">
            {getPlaceholder(
              "recipient",
              "company",
              recipient?.company,
              language
            )}
          </p>
          <p>
            {getPlaceholder("recipient", "name", recipient?.name, language)}
          </p>
          <p>
            {getPlaceholder(
              "recipient",
              "address",
              recipient?.address,
              language
            )}
          </p>
          <p>
            {getPlaceholder(
              "recipient",
              "postalCode",
              recipient?.postalCode,
              language
            )}{" "}
            {getPlaceholder("recipient", "city", recipient?.city, language)}
          </p>
        </div>
      </div>
    );
  };

  const renderDateAndSubject = () => {
    return (
      <div className="mb-6 keep-together">
        {/* <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("date-et-objet")}
        </h2> */}
        <div className="space-y-2 text-sm">
          <p className="flex items-end justify-end">
            {getPlaceholder(
              "dateAndSubject",
              "location",
              dateAndSubject?.location,
              language
            )}
            , le{" "}
            {dateAndSubject?.date ||
              new Date().toLocaleDateString(
                language === "fr" ? "fr-FR" : "en-US"
              )}
          </p>
          <p className="font-semibold">
            {getPlaceholder(
              "dateAndSubject",
              "subject",
              dateAndSubject?.subject,
              language
            )}
          </p>
        </div>
      </div>
    );
  };

  const renderIntroduction = () => {
    return (
      <div className="mb-6 keep-together">
        {/* <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("introduction")}
        </h2> */}
        <div
          dangerouslySetInnerHTML={{
            __html: getPlaceholder(
              "sections",
              "introduction",
              introduction,
              language
            ),
          }}
          className="text-sm text-gray-700"
        />
      </div>
    );
  };

  const renderCurrentSituation = () => {
    return (
      <div className="mb-6 keep-together">
        {/* <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("situation-actuelle")}
        </h2> */}
        <div
          dangerouslySetInnerHTML={{
            __html: getPlaceholder(
              "sections",
              "currentSituation",
              currentSituation,
              language
            ),
          }}
          className="text-sm text-gray-700"
        />
      </div>
    );
  };

  const renderMotivation = () => {
    return (
      <div className="mb-6 keep-together">
        {/* <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("motivation")}
        </h2> */}
        <div
          dangerouslySetInnerHTML={{
            __html: getPlaceholder(
              "sections",
              "motivation",
              motivation,
              language
            ),
          }}
          className="text-sm text-gray-700"
        />
      </div>
    );
  };

  const renderConclusion = () => {
    return (
      <div className="mb-6 keep-together">
        {/* <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("conclusion")}
        </h2> */}
        <div
          dangerouslySetInnerHTML={{
            __html: getPlaceholder(
              "sections",
              "conclusion",
              conclusion,
              language
            ),
          }}
          className="text-sm text-gray-700"
        />
      </div>
    );
  };

  // Render custom section
  const renderCustomSection = (section: string) => {
    return (
      <div className="mb-6 keep-together">
        {/* <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2 text-gray-800"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle(section)}
        </h2> */}
        <div
          dangerouslySetInnerHTML={{
            __html: customSections?.[section] || "",
          }}
          className="text-sm text-gray-700"
        />
      </div>
    );
  };

  const renderSection = (section: string) => {
    switch (section) {
      case "personal-info":
        return renderPersonalInfo();
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
        // Handle custom sections
        if (section.startsWith("custom-")) {
          return renderCustomSection(section);
        }
        return null;
    }
  };

  return (
    <div className="cv-container">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
          }
        }
        .keep-together {
          page-break-inside: avoid;
        }
      `}</style>

      {/* Page 1 */}
      <div
        className="cv-page bg-white"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          boxSizing: "border-box",
          margin: "0 auto",
          fontFamily: fontFamily,
        }}
      >
        {page1Sections.map((section) => (
          <div key={section}>{renderSection(section)}</div>
        ))}
      </div>

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div
          className="cv-page bg-white"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm",
            boxSizing: "border-box",
            margin: "2rem auto 0",
            pageBreakBefore: "always",
            fontFamily: fontFamily,
          }}
        >
          {/* Always include personal info at the top of page 2 */}
          {renderPersonalInfo()}

          {/* Render sections for page 2 */}
          {page2Sections.map((section) => (
            <div key={section}>{renderSection(section)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
