import React from "react";
import type { CoverLetterData } from "@/types";
import Image from "next/image";
import { Mail, Phone, Home, User } from "lucide-react";

interface CoverLetterPreviewCirculaireProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
}

export default function CoverLetterPreviewCirculaire({
  data,
  sectionOrder,
  accentColor = "#006273",
  fontFamily = "inter",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
}: CoverLetterPreviewCirculaireProps) {
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

  // Render personal info section for sidebar
  const renderPersonalInfo = () => {
    return (
      <div className="mt-6">
        <h2
          style={{ color: accentColor, borderColor: accentColor }}
          className="text-xl font-bold mb-4 border-b pb-2"
        >
          Informations personnelles
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User style={{ color: accentColor }} className="h-5 w-5" />
            <span className="text-gray-700">
              {personalInfo?.firstName || "Prénom"}{" "}
              {personalInfo?.lastName || "Nom"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Mail style={{ color: accentColor }} className="h-5 w-5" />
            <span className="text-gray-700">
              {personalInfo?.email || "email@example.com"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone style={{ color: accentColor }} className="h-5 w-5" />
            <span className="text-gray-700">
              {personalInfo?.phone || "+33 6 12 34 56 78"}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <Home style={{ color: accentColor }} className="h-5 w-5 mt-0.5" />
            <div className="text-gray-700">
              <div>{personalInfo?.address || "123 Rue Example"}</div>
              <div>
                {personalInfo?.postalCode || "75000"}{" "}
                {personalInfo?.city || "Paris"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render recipient info section for sidebar
  const renderRecipientInfo = () => {
    return (
      <div className="mt-6">
        <h2
          style={{ color: accentColor, borderColor: accentColor }}
          className="text-xl font-bold mb-4 border-b pb-2"
        >
          Destinataire
        </h2>
        <div className="space-y-4">
          <div className="text-gray-700">
            <p className="font-medium">
              {recipient?.company || "Entreprise XYZ"}
            </p>
            <p>{recipient?.name || "Responsable Recrutement"}</p>
            <p>{recipient?.address || "456 Avenue Business"}</p>
            <p>
              {recipient?.postalCode || "75001"} {recipient?.city || "Paris"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render date and subject section for sidebar
  const renderDateAndSubject = () => {
    return (
      <div className="mt-6">
        <h2
          style={{ color: accentColor, borderColor: accentColor }}
          className="text-xl font-bold mb-4 border-b pb-2"
        >
          Date et Objet
        </h2>
        <div className="space-y-4">
          <div className="text-gray-700">
            <p>
              {dateAndSubject?.location || "Paris"}, le{" "}
              {dateAndSubject?.date || "01/01/2023"}
            </p>
            <p className="font-medium mt-2">
              Objet :{" "}
              {dateAndSubject?.subject || "Candidature pour le poste de..."}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render content sections
  const renderSections = (sections: string[]) => {
    return sections.map((section) => {
      if (
        section === "personal-info" ||
        section === "destinataire" ||
        section === "date-et-objet"
      ) {
        return null;
      }

      if (section.startsWith("custom-")) {
        return (
          <div key={section} className="mb-8">
            <h3
              style={{ color: accentColor, borderColor: accentColor }}
              className="text-2xl font-bold mb-4 border-b pb-2"
            >
              {getSectionTitle(section)}
            </h3>
            <div
              dangerouslySetInnerHTML={{
                __html: customSections?.[section] || "",
              }}
              className="text-gray-700"
            />
          </div>
        );
      }

      switch (section) {
        case "introduction":
          return (
            <div key={section} className="mb-8">
              <h3
                style={{ color: accentColor, borderColor: accentColor }}
                className="text-2xl font-bold mb-4 border-b pb-2"
              >
                {getSectionTitle(section)}
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: introduction || "" }}
                className="text-gray-700"
              />
            </div>
          );
        case "situation-actuelle":
          return (
            <div key={section} className="mb-8">
              <h3
                style={{ color: accentColor, borderColor: accentColor }}
                className="text-2xl font-bold mb-4 border-b pb-2"
              >
                {getSectionTitle(section)}
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: currentSituation || "" }}
                className="text-gray-700"
              />
            </div>
          );
        case "motivation":
          return (
            <div key={section} className="mb-8">
              <h3
                style={{ color: accentColor, borderColor: accentColor }}
                className="text-2xl font-bold mb-4 border-b pb-2"
              >
                {getSectionTitle(section)}
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: motivation || "" }}
                className="text-gray-700"
              />
            </div>
          );
        case "conclusion":
          return (
            <div key={section} className="mb-8">
              <h3
                style={{ color: accentColor, borderColor: accentColor }}
                className="text-2xl font-bold mb-4 border-b pb-2"
              >
                {getSectionTitle(section)}
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: conclusion || "" }}
                className="text-gray-700"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  const renderPage = (sections: string[]) => (
    <div className="cv-page bg-white shadow-lg">
      <div className="cv-page flex h-full">
        {/* Left sidebar */}
        <div className="w-1/3 relative bg-[#e6eaeb] min-h-[297mm]">
          {/* Top teal curved section */}
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute top-0 left-0 w-full h-[160px]"
          >
            <div
              className="absolute bottom-[-77px] left-0 w-full h-24"
              style={{
                background: accentColor,
                clipPath: "ellipse(55% 60% at 52% 0%)",
              }}
            ></div>
          </div>

          {/* Name at the top */}
          <div className="relative z-10 pt-12 px-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              {personalInfo?.firstName || "Prénom"}{" "}
              {personalInfo?.lastName || "Nom"}
            </h1>
          </div>

          {/* Profile photo */}
          <div className="relative z-10 flex justify-center mt-6">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={personalInfo?.photo || "/placeholder-profile.jpg"}
                alt={`${personalInfo?.firstName || "Prénom"} ${
                  personalInfo?.lastName || "Nom"
                }`}
                width={144}
                height={144}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Content sections */}
          <div className="relative z-10 px-8 pt-8 pb-32">
            {renderPersonalInfo()}
            {renderRecipientInfo()}
            {renderDateAndSubject()}
          </div>

          {/* Bottom teal curved section */}
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute bottom-0 left-0 w-full h-[125px]"
          >
            <div
              className="absolute top-0 left-0 w-full h-20"
              style={{
                background: "#e6eaeb",
                clipPath: "ellipse(60% 60% at 52% 0%)",
              }}
            ></div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-2/3 p-8">
          <div className="space-y-6">{renderSections(sections)}</div>
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
        }

        .cv-page-content {
          min-height: 297mm;
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
