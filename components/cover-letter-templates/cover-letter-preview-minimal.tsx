import React from "react";
import type { CoverLetterData } from "@/types";
import Image from "next/image";

interface CoverLetterPreviewMinimalProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
}

export default function CoverLetterPreviewMinimal({
  data,
  sectionOrder,
  accentColor = "#2a6496",
  fontFamily = "inter",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
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

  // Render personal details section for sidebar
  const renderPersonalDetails = () => {
    return (
      <div className="personal-details">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
          Informations personnelles
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Nom</h4>
            <p>
              {personalInfo?.firstName || "Prénom"}{" "}
              {personalInfo?.lastName || "Nom"}
            </p>
          </div>

          <div>
            <h4 className="font-medium">Email</h4>
            <p>{personalInfo?.email || "email@example.com"}</p>
          </div>

          <div>
            <h4 className="font-medium">Téléphone</h4>
            <p>{personalInfo?.phone || "+33 6 12 34 56 78"}</p>
          </div>

          <div>
            <h4 className="font-medium">Adresse</h4>
            <p>{personalInfo?.address || "123 Rue Example"}</p>
            <p>
              {personalInfo?.postalCode || "75000"}{" "}
              {personalInfo?.city || "Paris"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render recipient details section
  const renderRecipientDetails = () => {
    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-3"
          style={{ color: accentColor }}
        >
          Destinataire
        </h3>
        <div className="border-t border-gray-200 pt-3">
          <p className="font-semibold text-gray-800">
            {recipient?.company || "Entreprise XYZ"}
          </p>
          <p className="text-gray-700">
            {recipient?.name || "Responsable Recrutement"}
          </p>
          <p className="text-gray-700">
            {recipient?.address || "456 Avenue Business"}
          </p>
          <p className="text-gray-700">
            {recipient?.postalCode || "75001"} {recipient?.city || "Paris"}
          </p>
        </div>
      </div>
    );
  };

  // Render date and subject section
  const renderDateAndSubject = () => {
    
  };

  // Render content sections
  const renderSections = (sections: string[]) => {
    return sections.map((section) => {
      if (
        section === "personal-info"
      ) {
        return null;
      }

      if (section.startsWith("custom-")) {
        return (
          <div key={section} className="mb-8">
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {getSectionTitle(section)}
            </h3>
            <div className="border-t border-gray-200 pt-3">
              <div
                dangerouslySetInnerHTML={{
                  __html: customSections?.[section] || "",
                }}
                className="text-gray-700"
              />
            </div>
          </div>
        );
      }

      switch (section) {
        case "destinataire":
          return (
            <div className="mt-6">
              {/* <h2
          style={{ color: accentColor, borderColor: accentColor }}
          className="text-xl font-bold mb-4 border-b pb-2"
        >
          Destinataire
        </h2> */}
              <div className="space-y-4">
                <div className="text-gray-700">
                  <p className="font-medium">
                    {recipient?.company || "Entreprise XYZ"}
                  </p>
                  <p>{recipient?.name || "Responsable Recrutement"}</p>
                  <p>{recipient?.address || "456 Avenue Business"}</p>
                  <p>
                    {recipient?.postalCode || "75001"}{" "}
                    {recipient?.city || "Paris"}
                  </p>
                </div>
              </div>
            </div>
          );
        case "date-et-objet":
          return (
            <div className="mt-6">
              {/* <h2
          style={{ color: accentColor, borderColor: accentColor }}
          className="text-xl font-bold mb-4 border-b pb-2"
        >
          Date et Objet
        </h2> */}
              <div className="space-y-4">
                <div className="text-gray-700">
                  <p className="flex items-end justify-end">
                    {dateAndSubject?.location || "Paris"}, le{" "}
                    {dateAndSubject?.date || "01/01/2023"}
                  </p>
                  <p className="font-bold mt-2">
                    {dateAndSubject?.subject ||
                      "Candidature pour le poste de..."}
                  </p>
                </div>
              </div>
            </div>
          );
        case "introduction":
          return (
            <div key={section} className="mb-8">
              {/* <h3
                className="text-xl font-semibold mb-3"
                style={{ color: accentColor }}
              >
                {getSectionTitle(section)}
              </h3> */}
              <div className="border-t border-gray-200 pt-3">
                <div
                  dangerouslySetInnerHTML={{ __html: introduction || "" }}
                  className="text-gray-700"
                />
              </div>
            </div>
          );
        case "situation-actuelle":
          return (
            <div key={section} className="mb-8">
              {/* <h3
                className="text-xl font-semibold mb-3"
                style={{ color: accentColor }}
              >
                {getSectionTitle(section)}
              </h3> */}
              <div className="border-t border-gray-200 pt-3">
                <div
                  dangerouslySetInnerHTML={{ __html: currentSituation || "" }}
                  className="text-gray-700"
                />
              </div>
            </div>
          );
        case "motivation":
          return (
            <div key={section} className="mb-8">
              {/* <h3
                className="text-xl font-semibold mb-3"
                style={{ color: accentColor }}
              >
                {getSectionTitle(section)}
              </h3> */}
              <div className="border-t border-gray-200 pt-3">
                <div
                  dangerouslySetInnerHTML={{ __html: motivation || "" }}
                  className="text-gray-700"
                />
              </div>
            </div>
          );
        case "conclusion":
          return (
            <div key={section} className="mb-8">
              {/* <h3
                className="text-xl font-semibold mb-3"
                style={{ color: accentColor }}
              >
                {getSectionTitle(section)}
              </h3> */}
              <div className="border-t border-gray-200 pt-3">
                <div
                  dangerouslySetInnerHTML={{ __html: conclusion || "" }}
                  className="text-gray-700"
                />
              </div>
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
      <div className="px-12 py-8 print:px-12 print:py-8">
        <h1
          className="text-3xl font-bold"
          style={{
            color: accentColor,
            marginBottom: 0,
          }}
        >
          {personalInfo?.firstName || "Prénom"}{" "}
          {personalInfo?.lastName || "Nom"}
        </h1>
        <p className="text-gray-600 mt-2">
          {personalInfo?.title || "Titre professionnel"}
        </p>
      </div>

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
          {renderPersonalDetails()}
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
