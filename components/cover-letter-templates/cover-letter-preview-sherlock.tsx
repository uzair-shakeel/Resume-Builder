import React from "react";
import type { CoverLetterData } from "@/types";
import {
  Mail,
  Phone,
  MapPin,
  Home,
  Briefcase,
  Calendar,
  FileText,
} from "lucide-react";
import { getPlaceholder } from "@/lib/placeholder-data";

interface CoverLetterPreviewSherlockProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
  language?: string;
}

export default function CoverLetterPreviewSherlock({
  data,
  sectionOrder,
  accentColor = "#3498db",
  fontFamily = "'DejaVu Sans', sans-serif",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
  language = "fr",
}: CoverLetterPreviewSherlockProps) {
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
          <div key={section} className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              {getSectionTitle(section)}
            </h2>
            <div
              dangerouslySetInnerHTML={{
                __html: customSections[section] || "",
              }}
              className="text-sm"
            />
          </div>
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
            <div className="mb-6">
              <div className="space-y-4">
                <div className="text-gray-700">
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
                  <div
                    className="font-bold mt-2"
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
            </div>
          );
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
                className="text-sm"
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
                className="text-sm"
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
                className="text-sm"
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
                className="text-sm"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="cv-page w-[210mm] h-[297mm] relative bg-white shadow-lg mx-auto overflow-hidden">
      <div className="flex h-full">
        {/* Left sidebar */}
        <div
          className="w-1/3 h-full p-6 text-white"
          style={{ backgroundColor: accentColor }}
        >
          {/* Personal Info */}
          <div className="mb-8">
            {personalInfo.photo && (
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30">
                <img
                  src={personalInfo.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h2 className="text-xl font-bold uppercase tracking-wider mb-2 text-center">
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
            </h2>
            <p className="text-center text-sm uppercase tracking-wider mb-4 opacity-90">
              {getPlaceholder(
                "personalInfo",
                "title",
                personalInfo.title,
                language
              )}
            </p>
            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex items-center mb-2">
                <Mail className="w-4 h-4 mr-2" />
                <p className="text-sm">
                  {getPlaceholder(
                    "personalInfo",
                    "email",
                    personalInfo.email,
                    language
                  )}
                </p>
              </div>
              <div className="flex items-center mb-2">
                <Phone className="w-4 h-4 mr-2" />
                <p className="text-sm">
                  {getPlaceholder(
                    "personalInfo",
                    "phone",
                    personalInfo.phone,
                    language
                  )}
                </p>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <p className="text-sm">
                  {getPlaceholder(
                    "personalInfo",
                    "address",
                    personalInfo.address,
                    language
                  )}
                  ,{" "}
                  {getPlaceholder(
                    "personalInfo",
                    "postalCode",
                    personalInfo.postalCode,
                    language
                  )}{" "}
                  {getPlaceholder(
                    "personalInfo",
                    "city",
                    personalInfo.city,
                    language
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-2/3 p-6">
          <div className="flex justify-between">
            {/* Name and title */}
            <div className="w-1/3 mb-8">
              <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              <p className="text-sm uppercase tracking-wider text-gray-800">
                {personalInfo.title}
              </p>
            </div>

            {/* Contact info */}
            <div className="mb-8">
              <div className="flex items-center justify-end gap-3 mb-2">
                <p className="text-sm text-gray-700">
                  {personalInfo.address}, {personalInfo.city},{" "}
                  {personalInfo.postalCode}
                </p>
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mb-2">
                <p className="text-sm text-gray-700">{personalInfo.phone}</p>
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                  <Phone className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <p className="text-sm text-gray-700">{personalInfo.email}</p>
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                  <Mail className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Letter Content */}
          {renderSections(page1Sections)}
        </div>
      </div>

      {/* Page 2 if needed */}
      {hasPage2 && (
        <div className="cv-page w-[210mm] h-[297mm] relative bg-white shadow-lg mx-auto overflow-hidden page-break-before">
          <div className="flex h-full">
            {/* Left sidebar */}
            <div
              className="w-1/3 h-full p-6 text-white"
              style={{ backgroundColor: accentColor }}
            >
              {/* Personal Info - simplified for page 2 */}
              <div className="mb-8">
                <h2 className="text-xl font-bold uppercase tracking-wider mb-2 text-center">
                  {personalInfo.firstName} {personalInfo.lastName}
                </h2>
                <p className="text-center text-sm uppercase tracking-wider mb-4 opacity-90">
                  {personalInfo.title}
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="w-2/3 p-6">
              <div className="flex justify-between mb-6">
                {/* Name and title */}
                <div className="w-1/3">
                  <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h1>
                  <p className="text-sm uppercase tracking-wider text-gray-800">
                    {personalInfo.title}
                  </p>
                </div>
              </div>

              {/* Page 2 Content */}
              {renderSections(page2Sections)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
