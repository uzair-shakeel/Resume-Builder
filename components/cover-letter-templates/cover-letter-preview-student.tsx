import React from "react";
import type { CoverLetterData } from "@/types";
import { Home, HomeIcon, Mail, Phone } from "lucide-react";

interface CoverLetterPreviewStudentProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
}

export default function CoverLetterPreviewStudent({
  data,
  sectionOrder,
  accentColor = "#a5d8ff",
  fontFamily = "inter",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
}: CoverLetterPreviewStudentProps) {
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

  // Render header with name and title
  const renderHeader = () => {
    return (
      <div className="header mb-8">
        <h1 className="text-5xl font-bold tracking-[0.2em] text-center mb-4">
          {personalInfo?.firstName?.toUpperCase() || "PRÉNOM"}{" "}
          {personalInfo?.lastName?.toUpperCase() || "NOM"}
        </h1>
        <div className="relative py-4">
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute top-0 left-0 right-0 h-[1px]"
          ></div>
          <h2 className="text-2xl text-center uppercase tracking-widest">
            {personalInfo?.title || "Titre professionnel"}
          </h2>
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute bottom-0 left-0 right-0 h-[1px]"
          ></div>
        </div>
      </div>
    );
  };

  // Render personal info section
  const renderPersonalInfo = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">Contact</h3>
        <div className="space-y-3 text-base">
          <div className="flex items-center gap-3">
            <span className="inline-block">
              <Phone size={18} />
            </span>
            <span>{personalInfo?.phone || "+33 6 12 34 56 78"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block">
              <Mail size={18} />
            </span>
            <span>{personalInfo?.email || "email@example.com"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block">
              <HomeIcon size={18} />
            </span>
            <div>
              <p>{personalInfo?.address || "123 Rue Example"},</p>
              <p>
                {personalInfo?.city || "Paris"},{" "}
                {personalInfo?.postalCode || "75000"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render recipient details section
  const renderRecipientDetails = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">Destinataire</h3>
        <div className="space-y-2 text-base">
          <p className="font-bold uppercase">
            {recipient?.company || "ENTREPRISE XYZ"}
          </p>
          <p>{recipient?.name || "Responsable Recrutement"}</p>
          <p>{recipient?.address || "456 Avenue Business"}</p>
          <p>
            {recipient?.city || "Paris"}, {recipient?.postalCode || "75001"}
          </p>
        </div>
      </div>
    );
  };

  // Render date and subject section
  const renderDateAndSubject = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">Date et Objet</h3>
        <div className="space-y-2 text-base">
          <p>
            {dateAndSubject?.location || "Paris"}, le{" "}
            {dateAndSubject?.date || "01/01/2023"}
          </p>
          <p className="font-bold">
            Objet :{" "}
            {dateAndSubject?.subject || "Candidature pour le poste de..."}
          </p>
        </div>
        <div
          style={{ backgroundColor: accentColor }}
          className="mt-6 h-[1px]"
        ></div>
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
            <h3 className="text-xl font-bold mb-4 uppercase">
              {getSectionTitle(section)}
            </h3>
            <div
              dangerouslySetInnerHTML={{
                __html: customSections?.[section] || "",
              }}
              className="text-base"
            />
            <div
              style={{ backgroundColor: accentColor }}
              className="mt-6 h-[1px]"
            ></div>
          </div>
        );
      }

      switch (section) {
        case "introduction":
          return (
            <div key={section} className="mb-8">
              <h3 className="text-xl font-bold mb-4 uppercase">
                {getSectionTitle(section)}
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: introduction || "" }}
                className="text-base"
              />
              <div
                style={{ backgroundColor: accentColor }}
                className="mt-6 h-[1px]"
              ></div>
            </div>
          );
        case "situation-actuelle":
          return (
            <div key={section} className="mb-8">
              <h3 className="text-xl font-bold mb-4 uppercase">
                {getSectionTitle(section)}
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: currentSituation || "" }}
                className="text-base"
              />
              <div
                style={{ backgroundColor: accentColor }}
                className="mt-6 h-[1px]"
              ></div>
            </div>
          );
        case "motivation":
          return (
            <div key={section} className="mb-8">
              <h3 className="text-xl font-bold mb-4 uppercase">
                {getSectionTitle(section)}
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: motivation || "" }}
                className="text-base"
              />
              <div
                style={{ backgroundColor: accentColor }}
                className="mt-6 h-[1px]"
              ></div>
            </div>
          );
        case "conclusion":
          return (
            <div key={section} className="mb-8">
              <h3 className="text-xl font-bold mb-4 uppercase">
                {getSectionTitle(section)}
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: conclusion || "" }}
                className="text-base"
              />
              <div
                style={{ backgroundColor: accentColor }}
                className="mt-6 h-[1px]"
              ></div>
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="cv-page max-w-[1000px] mx-auto font-sans bg-white">
      <div className="p-8 pb-0">{renderHeader()}</div>
      <div className="flex relative">
        {/* Left sidebar with curved bottom */}
        <div className="w-1/3 p-8 pt-0 relative">
          {renderPersonalInfo()}
          <div className="absolute top-[210px] left-0 w-full h-full cv-sidebar z-10">
            <div className="custom-shape-divider-top-1741905911 mt-[-0.1px] absolute top-[-1px] left-0 w-full h-full">
              <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  className="shape-fill"
                ></path>
              </svg>
            </div>
          </div>
          <div className="relative z-10 mt-[100px]">
            {renderRecipientDetails()}
            {renderDateAndSubject()}
          </div>
        </div>

        {/* Main content */}
        <div className="w-2/3 p-8 pt-0">{renderSections(page1Sections)}</div>
      </div>

      {/* Page 2 if needed */}
      {hasPage2 && (
        <div className="cv-page max-w-[1000px] mx-auto font-sans bg-white mt-8 print:mt-0 page-break-before">
          <div className="p-8 pb-0">{renderHeader()}</div>
          <div className="cv-page-content flex relative">
            {/* Left sidebar with curved bottom */}
            <div className="w-1/3 p-8 pt-0 relative">
              {renderPersonalInfo()}
              <div className="custom-shape-divider-top-1741392645">
                <svg
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                    className="shape-fill"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-[220px] left-0 w-full h-full cv-sidebar"></div>
              <div className="relative z-10 mt-[100px]">
                {renderRecipientDetails()}
              </div>
            </div>

            {/* Main content */}
            <div className="w-2/3 p-8 pt-0">
              {renderSections(page2Sections)}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-shape-divider-top-1741392645 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          transform: rotate(180deg);
        }

        .custom-shape-divider-top-1741392645 svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 150px;
        }

        .custom-shape-divider-top-1741392645 .shape-fill {
          fill: #f3f4f6;
        }

        .cv-sidebar {
          background-color: #f3f4f6;
          z-index: 1;
        }

        @media print {
          .page-break-before {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
}
