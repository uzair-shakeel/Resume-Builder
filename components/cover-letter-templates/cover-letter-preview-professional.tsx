import React from "react";
import type { CoverLetterData } from "@/types";
import { Mail, Phone, MapPin } from "lucide-react";

interface CoverLetterPreviewProfessionalProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
}

export default function CoverLetterPreviewProfessional({
  data,
  sectionOrder,
  accentColor = "#0369a1",
  fontFamily = "'DejaVu Sans', sans-serif",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
}: CoverLetterPreviewProfessionalProps) {
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
      if (
        section === "personal-info" ||
        section === "destinataire" ||
        section === "date-et-objet"
      ) {
        return null;
      }

      if (section.startsWith("custom-")) {
        return (
          <section key={section} className="mb-8">
            <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">
              {getSectionTitle(section)}
            </h2>
            <div
              dangerouslySetInnerHTML={{
                __html: customSections[section] || "",
              }}
              className="text-gray-600 leading-relaxed"
            />
          </section>
        );
      }

      switch (section) {
        case "introduction":
          return (
            <section key={section} className="mb-8">
              <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">
                {getSectionTitle(section)}
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: introduction }}
                className="text-gray-600 leading-relaxed"
              />
            </section>
          );
        case "situation-actuelle":
          return (
            <section key={section} className="mb-8">
              <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">
                {getSectionTitle(section)}
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: currentSituation }}
                className="text-gray-600 leading-relaxed"
              />
            </section>
          );
        case "motivation":
          return (
            <section key={section} className="mb-8">
              <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">
                {getSectionTitle(section)}
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: motivation }}
                className="text-gray-600 leading-relaxed"
              />
            </section>
          );
        case "conclusion":
          return (
            <section key={section} className="mb-8">
              <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">
                {getSectionTitle(section)}
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: conclusion }}
                className="text-gray-600 leading-relaxed"
              />
            </section>
          );
        default:
          return null;
      }
    });
  };

  const renderHeader = () => (
    <div className="bg-teal-600 text-white p-6 flex items-center gap-6">
      {personalInfo.photo && (
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
          <img
            src={personalInfo.photo}
            alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-teal-100">{personalInfo.title}</p>
        <div className="flex gap-4 mt-2 text-sm text-teal-50">
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {personalInfo.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {personalInfo.phone}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {personalInfo.city}
          </span>
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="w-[240px] bg-gray-900 text-white p-6 min-h-full">
      {/* Recipient Info */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">
          Destinataire
        </h2>
        <div className="space-y-2">
          <p className="text-sm font-medium">{recipient.company}</p>
          <p className="text-sm">{recipient.name}</p>
          <p className="text-sm">{recipient.address}</p>
          <p className="text-sm">
            {recipient.postalCode} {recipient.city}
          </p>
        </div>
      </div>

      {/* Date and Subject */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">
          Date et Objet
        </h2>
        <div className="space-y-2">
          <p className="text-sm">
            {dateAndSubject.location}, le {dateAndSubject.date}
          </p>
          <p className="text-sm font-medium">
            Objet : {dateAndSubject.subject}
          </p>
        </div>
      </div>
    </div>
  );

  const renderMainContent = (sections: string[]) => (
    <div className="flex-1 p-8">{renderSections(sections)}</div>
  );

  const renderPage = (sections: string[]) => (
    <div className="cv-page">
      <div className="cv-page flex flex-col h-full bg-transparent">
        {renderHeader()}
        <div className="flex flex-1">
          {renderSidebar()}
          {renderMainContent(sections)}
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
