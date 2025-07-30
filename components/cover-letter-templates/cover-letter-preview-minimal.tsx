import React from "react";
import type { CoverLetterData } from "@/types";
import { getPlaceholder } from "@/lib/placeholder-data";
import Image from "next/image";

interface CoverLetterPreviewMinimalProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
  language?: string;
}

export default function CoverLetterPreviewMinimal({
  data,
  sectionOrder,
  accentColor = "#000000",
  fontFamily = "inter",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
  language = "fr",
}: CoverLetterPreviewMinimalProps) {
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
        return language === "fr" ? "Introduction" : "Introduction";
      case "situation-actuelle":
        return language === "fr" ? "Situation Actuelle" : "Current Situation";
      case "motivation":
        return language === "fr" ? "Motivation" : "Motivation";
      case "conclusion":
        return language === "fr" ? "Conclusion" : "Conclusion";
      default:
        return section;
    }
  };

  // Render header with personal info
  const renderHeader = () => {
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
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
        <p className="text-gray-600">
          {getPlaceholder(
            "personalInfo",
            "title",
            personalInfo?.title,
            language
          )}
        </p>
        <div className="mt-4 text-sm text-gray-600">
          <p>
            {getPlaceholder(
              "personalInfo",
              "email",
              personalInfo?.email,
              language
            )}
          </p>
          <p>
            {getPlaceholder(
              "personalInfo",
              "phone",
              personalInfo?.phone,
              language
            )}
          </p>
          <p>
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
          </p>
        </div>
      </div>
    );
  };

  // Render recipient info
  const renderRecipient = () => {
    return (
      <div className="mb-8">
        <div className="text-sm">
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

  // Render date and subject
  const renderDateAndSubject = () => {
    return (
      <div className="mb-8">
        <div className="text-sm">
          <p className="text-right mb-4">
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
          <div
            className="font-semibold"
            dangerouslySetInnerHTML={{
              __html: getPlaceholder(
                "dateAndSubject",
                "subject",
                dateAndSubject?.subject,
                language
              ),
            }}
          />
        </div>
      </div>
    );
  };

  // Render content sections
  const renderSections = (sections: string[]) => {
    return sections.map((section) => {
      if (section === "personal-info") {
        return null;
      }

      if (section.startsWith("custom-")) {
        return (
          <div key={section} className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              {getSectionTitle(section)}
            </h3>
            <div
              dangerouslySetInnerHTML={{
                __html: customSections?.[section] || "",
              }}
              className="text-sm leading-relaxed"
            />
          </div>
        );
      }

      switch (section) {
        case "destinataire":
          return renderRecipient();
        case "date-et-objet":
          return renderDateAndSubject();
        case "introduction":
          return (
            <div key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: getPlaceholder(
                    "sections",
                    "introduction",
                    introduction,
                    language
                  ),
                }}
                className="text-sm leading-relaxed"
              />
            </div>
          );
        case "situation-actuelle":
          return (
            <div key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: getPlaceholder(
                    "sections",
                    "currentSituation",
                    currentSituation,
                    language
                  ),
                }}
                className="text-sm leading-relaxed"
              />
            </div>
          );
        case "motivation":
          return (
            <div key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: getPlaceholder(
                    "sections",
                    "motivation",
                    motivation,
                    language
                  ),
                }}
                className="text-sm leading-relaxed"
              />
            </div>
          );
        case "conclusion":
          return (
            <div key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: getPlaceholder(
                    "sections",
                    "conclusion",
                    conclusion,
                    language
                  ),
                }}
                className="text-sm leading-relaxed"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  const renderPage = (sections: string[]) => (
    <div
      className={`cv-page font-${fontFamily} bg-white`}
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Header bar */}
      <div
        className="w-full h-12 print:h-12"
        style={{ backgroundColor: accentColor }}
      ></div>

      {/* Main name header */}
      <div className="px-12 py-8 print:px-12 print:py-8">{renderHeader()}</div>

      {/* Main content */}
      <div className="px-12 pb-12 flex print:px-12 print:pb-12">
        {/* Left column - Personal details */}
        <div className="w-1/3 pr-8 print:pr-8">
          {personalInfo?.photo && (
            <div className="mb-6 print:mb-6">
              <div className="relative w-full pb-[100%]">
                <Image
                  src={personalInfo.photo || "/placeholder-profile.jpg"}
                  alt={`${personalInfo?.firstName || "Prénom"} ${
                    personalInfo?.lastName || "Nom"
                  }`}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 240px) 100vw, 240px"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right column - Main content */}
        <div className="w-2/3 print:w-2/3">
          {/* Render sections */}
          {sections.map((section) => (
            <div key={section} className="print:break-inside-avoid">
              {renderSections([section])}
            </div>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div
        className="w-full h-12 absolute bottom-0 print:h-12"
        style={{ backgroundColor: accentColor }}
      ></div>
    </div>
  );

  return (
    <div className="cv-container print:p-0">
      {/* Page 1 */}
      {renderPage(page1Sections)}

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div className="mt-8 print:mt-0">{renderPage(page2Sections)}</div>
      )}
    </div>
  );
}
