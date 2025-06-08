import React from "react";
import type { CoverLetterData } from "@/types";
import Image from "next/image";

interface CoverLetterPreviewClassicProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
}

export default function CoverLetterPreviewClassic({
  data,
  sectionOrder,
  accentColor = "#3498db",
  fontFamily = "Arial, sans-serif",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
}: CoverLetterPreviewClassicProps) {
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

  // Get section title
  const getSectionTitle = (section: string): string => {
    if (customSectionNames[section]) {
      return customSectionNames[section];
    }

    switch (section) {
      case "introduction":
        return "Introduction";
      case "situation-actuelle":
        return "Situation Actuelle";
      case "motivation":
        return "Motivation";
      case "conclusion":
        return "Conclusion";
      default:
        return section;
    }
  };

  // Render content sections
  const renderSections = (sections: string[]) => {
    return sections.map((section) => {
      if (section === "personal-info") {
        return null;
      }

      if (section.startsWith("custom-")) {
        return (
          <div key={section} className="mb-6 keep-together">
            <div
              dangerouslySetInnerHTML={{
                __html: customSections[section] || "",
              }}
              className="text-sm section-content"
            />
          </div>
        );
      }

      switch (section) {
        case "destinataire":
          return (
            <div key={section} className="mt-6">
              <div className="space-y-4">
                <div className="text-gray-700">
                  <p className="font-medium">{recipient?.company || ""}</p>
                  <p>{recipient?.name || ""}</p>
                  <p>{recipient?.address || ""}</p>
                  <p>
                    {recipient?.postalCode || ""} {recipient?.city || ""}
                  </p>
                </div>
              </div>
            </div>
          );
        case "date-et-objet":
          return (
            <div key={section} className="mt-8 mb-8">
              <div className="text-right mb-4">
                <p>
                  {dateAndSubject?.location || ""}, le{" "}
                  {dateAndSubject?.date ||
                    new Date().toLocaleDateString("fr-FR")}
                </p>
              </div>
              <p className="font-medium">{dateAndSubject?.subject || ""}</p>
            </div>
          );
        case "introduction":
          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html: introduction || "",
                }}
                className="text-sm section-content"
              />
            </div>
          );
        case "situation-actuelle":
          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html: currentSituation || "",
                }}
                className="text-sm section-content"
              />
            </div>
          );
        case "motivation":
          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html: motivation || "",
                }}
                className="text-sm section-content"
              />
            </div>
          );
        case "conclusion":
          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html: conclusion || "",
                }}
                className="text-sm section-content"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  const renderPage = (sections: string[]) => (
    <div className="cv-page">
      <div className="cv-page-content p-8">
        {/* Header with name */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: accentColor }}>
            {personalInfo?.firstName} {personalInfo?.lastName}
          </h1>
          <p className="text-gray-600">{personalInfo?.title}</p>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-8">
          {/* Left column - Contact info */}
          <div className="w-1/3">
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                Contact
              </h2>
              <div className="space-y-2 section-content">
                <div>
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm">
                    {personalInfo?.email || "email@example.com"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Téléphone:</p>
                  <p className="text-sm">
                    {personalInfo?.phone || "+33 6 12 34 56 78"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Adresse:</p>
                  <p className="text-sm">
                    {personalInfo?.address || "123 Rue Example"},{" "}
                    {personalInfo?.postalCode || "75000"}{" "}
                    {personalInfo?.city || "Paris"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Letter content */}
          <div className="w-2/3">{renderSections(sections)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cv-container">
      {/* Page 1 */}
      {renderPage(page1Sections)}

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div className="mt-8 print:mt-0">{renderPage(page2Sections)}</div>
      )}

      <style jsx>{`
        .cv-page {
          width: 210mm;
          min-height: 297mm;
          position: relative;
          margin: 0 auto;
          background: white;
          padding: 20mm;
        }
        .cv-page-content {
          min-height: 257mm;
        }
        @media print {
          .cv-page + .cv-page {
            page-break-before: always;
          }
        }
        .cv-accent-border {
          border-color: ${accentColor};
        }
        .cv-accent-bg {
          background-color: ${accentColor};
        }
        .cv-accent-color {
          color: ${accentColor};
        }
        .keep-together {
          page-break-inside: avoid;
        }
      `}</style>
    </div>
  );
}
