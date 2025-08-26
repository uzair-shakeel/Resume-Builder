import React from "react";
import type { CVData, CustomSectionItem } from "@/types";
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

interface CVPreviewHRProps {
  data: CVData;
  sectionOrder: string[];
  accentColor?: string;
  fontFamily?: string;
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
  language?: string;
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
}

export default function CVPreviewHR({
  data,
  sectionOrder,
  accentColor = "#9b59b6",
  fontFamily = "Arial, sans-serif",
  pageBreakSettings,
  sectionPages = {},
  customSectionNames = {},
  language = "fr",
}: CVPreviewHRProps) {
  const {
    personalInfo,
    profile,
    education,
    experience,
    skills,
    languages,
    interests,
  } = data;

  // Default page break settings if not provided
  const breakSettings = pageBreakSettings || {
    keepHeadingsWithContent: true,
    avoidOrphanedHeadings: true,
    minLinesBeforeBreak: 3,
  };

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
      return customSectionNames[section].toUpperCase();
    }

    // Otherwise use the default name based on language
    switch (section) {
      case "personal-info":
        return language === "fr"
          ? "INFORMATIONS PERSONNELLES"
          : "PERSONAL INFORMATION";
      case "profile":
        return language === "fr" ? "PROFIL" : "PROFILE";
      case "education":
        return language === "fr" ? "ÉDUCATION" : "EDUCATION";
      case "experience":
        return language === "fr"
          ? "EXPÉRIENCE PROFESSIONNELLE"
          : "PROFESSIONAL EXPERIENCE";
      case "skills":
        return language === "fr" ? "COMPÉTENCES" : "SKILLS";
      case "languages":
        return language === "fr" ? "LANGUES" : "LANGUAGES";
      case "interests":
        return language === "fr" ? "CENTRES D'INTÉRÊT" : "INTERESTS";
      case "references":
        return language === "fr" ? "RÉFÉRENCES" : "REFERENCES";
      case "socials":
        return language === "fr" ? "RÉSEAUX SOCIAUX" : "SOCIAL NETWORKS";
      case "contact":
        return language === "fr" ? "CONTACT" : "CONTACT";
      default:
        if (section.startsWith("custom-")) {
          return language === "fr" ? "SECTION PERSONNALISÉE" : "CUSTOM SECTION";
        }
        return section.toUpperCase();
    }
  };

  const renderPersonalInfo = () => {
    return (
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-3">
          {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
        </h1>
        {personalInfo?.title && (
          <p className="text-xl mb-4">{personalInfo?.title}</p>
        )}
        <div className="flex justify-center space-x-4 text-sm">
          {personalInfo?.email && <span>{personalInfo?.email}</span>}
          {personalInfo?.email && personalInfo?.phone && <span>|</span>}
          {personalInfo?.phone && <span>{personalInfo?.phone}</span>}
          {personalInfo?.phone &&
            (personalInfo?.address ||
              personalInfo?.postalCode ||
              personalInfo?.city) && <span>|</span>}
          {(personalInfo?.address ||
            personalInfo?.postalCode ||
            personalInfo?.city) && (
            <span>
              {personalInfo?.address || ""}
              {personalInfo?.postalCode && `, ${personalInfo?.postalCode}`}
              {personalInfo?.city && ` ${personalInfo?.city}`}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    if (!profile) return null;

    return (
      <div className="mb-8">
        <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("profile")}
        </h2>
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: profile }}
        />
      </div>
    );
  };

  const renderEducation = () => {
    return data.education?.length > 0 ? (
      <div className="mb-6">
        {data.education?.length > 0 && (
          <>
            <h2
              className="text-xl font-semibold mb-3 pb-2 border-b-2"
              style={{ borderColor: accentColor }}
            >
              {getSectionTitle("education")}
            </h2>
            <div className="space-y-4">
              {data.education.map((edu: Education, index: number) => (
                <div
                  key={index}
                  className={`${
                    index > 0 && breakSettings.minLinesBeforeBreak > 0
                      ? "mt-4"
                      : ""
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <span className="text-sm">
                      {edu.startDate} - {edu.current ? "Présent" : edu.endDate}
                    </span>
                  </div>
                  <p className="text-sm mb-1">{edu.school}</p>
                  {edu.description && (
                    <p className="text-sm text-gray-600">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderExperience = () => {
    return data.experience?.length > 0 ? (
      <div className="mb-6">
        {data.experience?.length > 0 && (
          <>
            <h2
              className="text-xl font-semibold mb-3 pb-2 border-b-2"
              style={{ borderColor: accentColor }}
            >
              {getSectionTitle("experience")}
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp: Experience, index: number) => (
                <div
                  key={index}
                  className={`${
                    index > 0 && breakSettings.minLinesBeforeBreak > 0
                      ? "mt-4"
                      : ""
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <h3 className="font-semibold">{exp.position}</h3>
                    <span className="text-sm">
                      {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm mb-1">
                    {exp.company}, {exp.location}
                  </p>
                  {exp.description && (
                    <div
                      className="text-sm text-gray-600 mt-2"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderSkills = () => {
    return data.skills?.length > 0 ? (
      <div className="mb-6">
        {data.skills?.length > 0 && (
          <>
            <h2
              className="text-xl font-semibold mb-3 pb-2 border-b-2"
              style={{ borderColor: accentColor }}
            >
              {getSectionTitle("skills")}
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {data.skills.map((skill: Skill, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{skill.name}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className="w-3 h-3 rounded-full mx-0.5"
                        style={{
                          backgroundColor:
                            level <= skill.level ? accentColor : "#e2e8f0",
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderLanguages = () => {
    return data.languages?.length > 0 ? (
      <div className="mb-6">
        {data.languages?.length > 0 && (
          <>
            <h2
              className="text-xl font-semibold mb-3 pb-2 border-b-2"
              style={{ borderColor: accentColor }}
            >
              {getSectionTitle("languages")}
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {data.languages.map((language: Language, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{language.name}</span>
                  <span className="text-sm text-gray-600">
                    {language.level}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderInterests = () => {
    return data.interests?.length > 0 ? (
      <div className="mb-6">
        {data.interests?.length > 0 && (
          <>
            <h2
              className="text-xl font-semibold mb-3 pb-2 border-b-2"
              style={{ borderColor: accentColor }}
            >
              {getSectionTitle("interests")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest: Interest, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  {interest.name}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  // Render custom section
  const renderCustomSection = (section: string) => {
    const sectionData = data[section] as CustomSectionItem[];

    if (!sectionData || sectionData.length === 0) return null;

    return (
      <div className="mb-6">
        {sectionData.length > 0 && (
          <>
            <h2
              className="text-xl font-semibold mb-3 pb-2 border-b-2"
              style={{ borderColor: accentColor }}
            >
              {getSectionTitle(section)}
            </h2>
            <div className="space-y-4">
              {sectionData.map((item, index) => (
                <div key={index} className="mb-4">
                  {item.title && (
                    <p className="font-semibold text-sm">{item.title}</p>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderSection = (section: string) => {
    switch (section) {
      case "personal-info":
        return renderPersonalInfo();
      case "profile":
        return renderProfile();
      case "education":
        return renderEducation();
      case "experience":
        return renderExperience();
      case "skills":
        return renderSkills();
      case "languages":
        return renderLanguages();
      case "interests":
        return renderInterests();
      default:
        // Handle custom sections
        if (section.startsWith("custom-") && data[section]) {
          return renderCustomSection(section);
        }
        return null;
    }
  };

  return (
    <div className="cv-container">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
            padding: 0;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          .cv-page {
            padding: 20mm !important;
            box-sizing: border-box !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            break-after: page !important;
            page-break-after: always !important;
          }
        }

        /* Non-print styles */
        .cv-page {
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          box-sizing: border-box;
          margin: 0 auto;
          background: white;
        }

        .cv-page + .cv-page {
          margin-top: 2rem;
        }

        @media screen {
          .cv-container {
            padding: 2rem 0;
          }
        }
      `}</style>

      {/* Page 1 */}
      <div className="cv-page">
        <div className="px-[50px] py-[30px]">
          {page1Sections.map((section) => (
            <div key={section}>{renderSection(section)}</div>
          ))}
        </div>
      </div>

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div className="cv-page">
          <div className="px-[50px] py-[30px]">
            {/* Always include personal info at the top of page 2 */}
            {renderPersonalInfo()}

            {/* Render sections for page 2 */}
            {page2Sections.map((section) => (
              <div key={section}>{renderSection(section)}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
