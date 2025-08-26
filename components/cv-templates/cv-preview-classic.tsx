import React from "react";
import type { CVData } from "@/types";
import Image from "next/image";
import { placeholderData } from "@/lib/utils";

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
  previewMode?: boolean;
  showFirstPageOnly?: boolean;
  language?: string;
}

export default function CVPreviewClassic({
  data,
  sectionOrder,
  sectionPages = {},
  customSectionNames = {},
  accentColor = "#3498db",
  fontFamily = "Arial, sans-serif",
  pageBreakSettings,
  previewMode = false,
  showFirstPageOnly = false,
  language = "fr",
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

    // Otherwise use the default name based on language
    switch (section) {
      case "profile":
        return language === "fr" ? "Profil" : "Profile";
      case "education":
        return language === "fr" ? "Éducation" : "Education";
      case "experience":
        return language === "fr"
          ? "Expérience professionnelle"
          : "Professional Experience";
      case "skills":
        return language === "fr" ? "Compétences" : "Skills";
      case "languages":
        return language === "fr" ? "Langues" : "Languages";
      case "interests":
        return language === "fr" ? "Centres d'intérêt" : "Interests";
      case "personal-info":
        return language === "fr"
          ? "Informations personnelles"
          : "Personal Information";
      case "references":
        return language === "fr" ? "Références" : "References";
      case "socials":
        return language === "fr" ? "Réseaux sociaux" : "Social Networks";
      case "contact":
        return language === "fr" ? "Contact" : "Contact";
      default:
        return section;
    }
  };

  // Add default page break settings
  const breakSettings = pageBreakSettings || {
    keepHeadingsWithContent: true,
    avoidOrphanedHeadings: true,
    minLinesBeforeBreak: 3,
  };

  // Header with name and title
  const renderHeader = () => (
    <div className="text-center mb-8">
      {personalInfo &&
        (personalInfo["firstName"] || personalInfo["lastName"]) && (
          <h1 className="text-2xl font-bold mb-2">
            {personalInfo["firstName"] || ""} {personalInfo["lastName"] || ""}
          </h1>
        )}
      {personalInfo && personalInfo["title"] && (
        <p className="text-gray-600">{personalInfo["title"]}</p>
      )}
    </div>
  );

  // Photo
  const renderPhoto = () => (
    <div className="mb-6 flex justify-center">
      {personalInfo && personalInfo["photo"] && (
        <div className="w-32 h-32 overflow-hidden rounded-full border-2 cv-accent-border">
          <Image
            src={personalInfo["photo"]}
            alt={`${personalInfo["firstName"] || ""} ${
              personalInfo["lastName"] || ""
            }`}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  );

  // Personal information
  const renderPersonalInfo = () => (
    <div className="mb-6">
      <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
        {getSectionTitle("contact")}
      </h2>
      <div className="space-y-2 section-content">
        {personalInfo && personalInfo["email"] && (
          <div>
            <p className="text-sm font-medium">
              {language === "fr" ? "E-mail:" : "Email:"}
            </p>
            <p className="text-sm">{personalInfo["email"]}</p>
          </div>
        )}
        {personalInfo && personalInfo["phone"] && (
          <div>
            <p className="text-sm font-medium">
              {language === "fr" ? "Téléphone:" : "Phone:"}
            </p>
            <p className="text-sm">{personalInfo["phone"]}</p>
          </div>
        )}
        {personalInfo &&
          (personalInfo["address"] ||
            personalInfo["postalCode"] ||
            personalInfo["city"]) && (
            <div>
              <p className="text-sm font-medium">
                {language === "fr" ? "Adresse:" : "Address:"}
              </p>
              <p className="text-sm">
                {personalInfo["address"] || ""}
                {personalInfo["address"] &&
                  (personalInfo["postalCode"] || personalInfo["city"]) &&
                  ", "}
                {personalInfo["postalCode"] || ""} {personalInfo["city"] || ""}
              </p>
            </div>
          )}
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!profile) return null;

    return (
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">
          {getSectionTitle("profile")}
        </h2>
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: profile }}
        />
      </div>
    );
  };

  const renderPage = (sections: string[]) => (
    <div className="cv-page">
      <div className="cv-page-content">
        {renderHeader()}

        {/* Two-column layout */}
        <div className="flex">
          {/* Left column */}
          <div className="w-1/3 pr-6">
            {renderPhoto()}

            {renderPersonalInfo()}

            {/* Skills */}
            {sections.includes("skills") && skills?.length > 0 && (
              <div
                className={`mb-6 ${
                  breakSettings.keepHeadingsWithContent ? "keep-together" : ""
                }`}
              >
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  {getSectionTitle("skills")}
                </h2>
                <div className="space-y-2 section-content">
                  {skills.map((skill, index) => (
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
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {sections.includes("languages") && languages?.length > 0 && (
              <div
                className={`mb-6 ${
                  breakSettings.keepHeadingsWithContent ? "keep-together" : ""
                }`}
              >
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  {getSectionTitle("languages")}
                </h2>
                <div className="space-y-2 section-content">
                  {languages.map((language, index) => (
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
            {sections.includes("interests") && interests?.length > 0 && (
              <div
                className={`mb-6 ${
                  breakSettings.keepHeadingsWithContent ? "keep-together" : ""
                }`}
              >
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  {getSectionTitle("interests")}
                </h2>
                <ul className="list-disc list-inside text-sm space-y-1 section-content">
                  {interests.map((interest, index) => (
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
                  return profile ? (
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
                      <div
                        className="text-sm section-content"
                        dangerouslySetInnerHTML={{ __html: profile }}
                      />
                    </div>
                  ) : null;
                case "experience":
                  return experience?.length > 0 ? (
                    <div key={section} className="mb-6">
                      <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                        {getSectionTitle("experience")}
                      </h2>
                      <div className="space-y-4 section-content">
                        {experience.map((exp, index) => (
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
                  ) : null;
                case "education":
                  return education?.length > 0 ? (
                    <div key={section} className="mb-6">
                      <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                        {getSectionTitle("education")}
                      </h2>
                      <div className="space-y-4 section-content">
                        {education.map((edu, index) => (
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
                  ) : null;
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
    <div
      style={
        {
          "--accent-color": accentColor,
          fontFamily: fontFamily,
        } as React.CSSProperties
      }
      className="cv-container"
    >
      {/* Page 1 */}
      {renderPage(page1Sections)}

      {/* Page 2 (if needed) */}
      {hasPage2 && !showFirstPageOnly && (
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
          border-color: var(--accent-color) !important;
        }
        .cv-accent-bg {
          background-color: var(--accent-color) !important;
        }
        .cv-accent-color {
          color: var(--accent-color) !important;
        }
      `}</style>
    </div>
  );
}
