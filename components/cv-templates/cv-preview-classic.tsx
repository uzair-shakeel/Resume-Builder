import React from "react";
import type { CVData } from "@/types";
import Image from "next/image";
import { placeholderData, getPlaceholderOrValue } from "@/lib/utils";

// Define the types locally to avoid import issues
interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

interface Experience {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

interface Skill {
  name: string;
  level: number;
}

interface Language {
  name: string;
  level: string;
}

interface Interest {
  name: string;
}

interface CVPreviewClassicProps {
  data: CVData;
  sectionOrder: string[];
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
  accentColor?: string;
  fontFamily?: string;
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
}

export default function CVPreviewClassic({
  data,
  sectionOrder,
  sectionPages = {},
  customSectionNames = {},
  accentColor = "#3498db",
  fontFamily = "Arial, sans-serif",
  pageBreakSettings,
}: CVPreviewClassicProps) {
  const {
    personalInfo = {},
    profile = "",
    education = [],
    experience = [],
    skills = [],
    languages = [],
    interests = [],
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
      case "profile":
        return "Profil";
      case "education":
        return "Formation";
      case "experience":
        return "Expérience professionnelle";
      case "skills":
        return "Compétences";
      case "languages":
        return "Langues";
      case "interests":
        return "Centres d'intérêt";
      default:
        return "";
    }
  };

  // Add default page break settings
  const breakSettings = pageBreakSettings || {
    keepHeadingsWithContent: true,
    avoidOrphanedHeadings: true,
    minLinesBeforeBreak: 3,
  };

  const renderPage = (sections: string[]) => (
    <div className="cv-page">
      <div className="cv-page-content">
        {/* Header with name and title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {getPlaceholderOrValue(
              "personalInfo",
              "firstName",
              personalInfo?.firstName
            )}{" "}
            {getPlaceholderOrValue(
              "personalInfo",
              "lastName",
              personalInfo?.lastName
            )}
          </h1>
          <p className="text-gray-600">
            {getPlaceholderOrValue(
              "personalInfo",
              "title",
              personalInfo?.title
            )}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex">
          {/* Left column */}
          <div className="w-1/3 pr-6">
            {/* Photo */}
            <div className="mb-6 flex justify-center">
              <div
                className="w-32 h-32 overflow-hidden rounded-full border-2"
                style={{ borderColor: accentColor }}
              >
                <Image
                  src={
                    personalInfo?.photo || placeholderData.personalInfo.photo
                  }
                  alt={`${getPlaceholderOrValue(
                    "personalInfo",
                    "firstName",
                    personalInfo?.firstName
                  )} ${getPlaceholderOrValue(
                    "personalInfo",
                    "lastName",
                    personalInfo?.lastName
                  )}`}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Personal information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                Contact
              </h2>
              <div className="space-y-2 section-content">
                <div>
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm">
                    {getPlaceholderOrValue(
                      "personalInfo",
                      "email",
                      personalInfo?.email
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Téléphone:</p>
                  <p className="text-sm">
                    {getPlaceholderOrValue(
                      "personalInfo",
                      "phone",
                      personalInfo?.phone
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Adresse:</p>
                  <p className="text-sm">
                    {getPlaceholderOrValue(
                      "personalInfo",
                      "address",
                      personalInfo?.address
                    )}
                    ,{" "}
                    {getPlaceholderOrValue(
                      "personalInfo",
                      "postalCode",
                      personalInfo?.postalCode
                    )}{" "}
                    {getPlaceholderOrValue(
                      "personalInfo",
                      "city",
                      personalInfo?.city
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            {sections.includes("skills") && (
              <div
                className={`mb-6 ${
                  breakSettings.keepHeadingsWithContent ? "keep-together" : ""
                }`}
              >
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  {getSectionTitle("skills")}
                </h2>
                <div className="space-y-2 section-content">
                  {(skills?.length ? skills : placeholderData.skills).map(
                    (skill, index) => (
                      <div key={index}>
                        <p className="text-sm font-medium">{skill.name}</p>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div
                            className="h-2 rounded-full cv-accent-bg"
                            style={{
                              width: `${
                                (parseInt(String(skill.level)) / 5) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Languages */}
            {sections.includes("languages") && (
              <div
                className={`mb-6 ${
                  breakSettings.keepHeadingsWithContent ? "keep-together" : ""
                }`}
              >
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  {getSectionTitle("languages")}
                </h2>
                <div className="space-y-2 section-content">
                  {(languages?.length
                    ? languages
                    : placeholderData.languages
                  ).map((language, index) => (
                    <div key={index}>
                      <p className="text-sm font-medium">{language.name}</p>
                      <p className="text-sm cv-accent-color">
                        {language.level}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {sections.includes("interests") && (
              <div
                className={`mb-6 ${
                  breakSettings.keepHeadingsWithContent ? "keep-together" : ""
                }`}
              >
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  {getSectionTitle("interests")}
                </h2>
                <ul className="list-disc list-inside text-sm space-y-1 section-content">
                  {(interests?.length
                    ? interests
                    : placeholderData.interests
                  ).map((interest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                      <span className="text-sm text-gray-900">
                        {interest.name}
                      </span>
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="w-2/3">
            {sections.map((section) => {
              switch (section) {
                case "profile":
                  return (
                    <div
                      key={section}
                      className={`mb-6 ${
                        breakSettings.keepHeadingsWithContent
                          ? "keep-together"
                          : ""
                      }`}
                    >
                      <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                        {getSectionTitle("profile")}
                      </h2>
                      <p className="text-sm section-content">
                        {profile || placeholderData.profile}
                      </p>
                    </div>
                  );
                case "experience":
                  return (
                    <div key={section} className="mb-6">
                      <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                        {getSectionTitle("experience")}
                      </h2>
                      <div className="space-y-4 section-content">
                        {(experience?.length
                          ? experience
                          : placeholderData.experience
                        ).map((exp, index) => (
                          <div
                            key={index}
                            className={`${
                              index > 0 && index < experience.length - 1
                                ? "keep-together"
                                : ""
                            }`}
                          >
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium">
                                {exp.position}
                              </h3>
                              <p className="text-sm cv-accent-color">
                                {exp.startDate} -{" "}
                                {exp.current ? "Present" : exp.endDate}
                              </p>
                            </div>
                            <p className="text-sm italic">
                              {exp.company}, {exp.location}
                            </p>
                            {exp.description && (
                              <p className="text-sm mt-1 whitespace-pre-line">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                case "education":
                  return (
                    <div key={section} className="mb-6">
                      <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                        {getSectionTitle("education")}
                      </h2>
                      <div className="space-y-4 section-content">
                        {(education?.length
                          ? education
                          : placeholderData.education
                        ).map((edu, index) => (
                          <div
                            key={index}
                            className={`${
                              index > 0 && index < education.length - 1
                                ? "keep-together"
                                : ""
                            }`}
                          >
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium">
                                {edu.degree}
                              </h3>
                              <p className="text-sm cv-accent-color">
                                {edu.startDate} -{" "}
                                {edu.current ? "Present" : edu.endDate}
                              </p>
                            </div>
                            <p className="text-sm italic">{edu.school}</p>
                            {edu.description && (
                              <p className="text-sm mt-1">{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                default:
                  // Handle custom sections
                  if (
                    section.startsWith("custom-") &&
                    data[section] &&
                    !["skills", "languages", "interests"].includes(section)
                  ) {
                    return (
                      <div key={section} className="mb-6">
                        <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                          {getSectionTitle(section)}
                        </h2>
                        <div className="space-y-4 section-content">
                          {(data[section] as any[]).map((item, index) => (
                            <div key={index} className="keep-together">
                              {item.title && (
                                <div className="flex justify-between">
                                  <h3 className="text-sm font-medium">
                                    {item.title}
                                  </h3>
                                </div>
                              )}
                              {item.description && (
                                <p className="text-sm mt-1 whitespace-pre-line">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
              }
            })}
          </div>
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
        .cv-accent-border {
          border-color: ${accentColor};
        }
        .cv-accent-bg {
          background-color: ${accentColor};
        }
        .cv-accent-color {
          color: ${accentColor};
        }
      `}</style>
    </div>
  );
}
