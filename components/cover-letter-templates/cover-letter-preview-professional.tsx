import React from "react";
import type { CoverLetterData } from "@/types";
import { Mail, Phone, MapPin } from "lucide-react";
import { getPlaceholder } from "@/lib/placeholder-data";

interface CoverLetterPreviewProfessionalProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
  language?: string;
}

export default function CoverLetterPreviewProfessional({
  data,
  sectionOrder,
  accentColor = "#0369a1",
  fontFamily = "'DejaVu Sans', sans-serif",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
  language = "fr",
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
      if (section === "personal-info") {
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
        case "destinataire":
          return (
            <div className="mt-6">
              <div className="space-y-4">
                <div className="text-gray-700">
                  <p className="font-medium">
                    {getPlaceholder(
                      "recipient",
                      "company",
                      recipient?.company,
                      language
                    )}
                  </p>
                  <p>
                    {getPlaceholder(
                      "recipient",
                      "name",
                      recipient?.name,
                      language
                    )}
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
                    {getPlaceholder(
                      "recipient",
                      "city",
                      recipient?.city,
                      language
                    )}
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
              </div>
              <p className="font-medium">
                {language === "fr" ? "Objet : " : "Subject: "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: getPlaceholder(
                      "dateAndSubject",
                      "subject",
                      dateAndSubject?.subject,
                      language
                    ),
                  }}
                />
              </p>
            </div>
          );
        case "introduction":
          return (
            <section key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: getPlaceholder(
                    "sections",
                    "introduction",
                    introduction,
                    language
                  ),
                }}
                className="text-gray-600 leading-relaxed"
              />
            </section>
          );
        case "situation-actuelle":
          return (
            <section key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: getPlaceholder(
                    "sections",
                    "currentSituation",
                    currentSituation,
                    language
                  ),
                }}
                className="text-gray-600 leading-relaxed"
              />
            </section>
          );
        case "motivation":
          return (
            <section key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: getPlaceholder(
                    "sections",
                    "motivation",
                    motivation,
                    language
                  ),
                }}
                className="text-gray-600 leading-relaxed"
              />
            </section>
          );
        case "conclusion":
          return (
            <section key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: getPlaceholder(
                    "sections",
                    "conclusion",
                    conclusion,
                    language
                  ),
                }}
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
            alt={`${getPlaceholder(
              "personalInfo",
              "firstName",
              personalInfo.firstName,
              language
            )} ${getPlaceholder(
              "personalInfo",
              "lastName",
              personalInfo.lastName,
              language
            )}`}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold">
          {getPlaceholder(
            "personalInfo",
            "firstName",
            personalInfo.firstName,
            language
          )}{" "}
          {getPlaceholder(
            "personalInfo",
            "lastName",
            personalInfo.lastName,
            language
          )}
        </h1>
        <p className="text-teal-100 pb-2">
          {getPlaceholder(
            "personalInfo",
            "title",
            personalInfo.title,
            language
          )}
        </p>
        <div className="flex gap-4 text-sm text-teal-50">
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {getPlaceholder(
              "personalInfo",
              "email",
              personalInfo.email,
              language
            )}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {getPlaceholder(
              "personalInfo",
              "phone",
              personalInfo.phone,
              language
            )}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {getPlaceholder(
              "personalInfo",
              "city",
              personalInfo.city,
              language
            )}
          </span>
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="w-[240px] bg-gray-900 text-white p-6 min-h-full"></div>
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
