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

    // Otherwise use the default name
    switch (section) {
      case "personal-info":
        return "INFORMATIONS PERSONNELLES";
      case "profile":
        return "PROFIL";
      case "education":
        return "FORMATION";
      case "experience":
        return "EXPÉRIENCE PROFESSIONNELLE";
      case "skills":
        return "COMPÉTENCES";
      case "languages":
        return "LANGUES";
      case "interests":
        return "CENTRES D'INTÉRÊT";
      default:
        if (section.startsWith("custom-")) {
          return "SECTION PERSONNALISÉE";
        }
        return "";
    }
  };

  const renderPersonalInfo = () => {
    return (
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-3">
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
        <p className="text-xl mb-4">
          {getPlaceholderOrValue("personalInfo", "title", personalInfo?.title)}
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <span>
            {getPlaceholderOrValue(
              "personalInfo",
              "email",
              personalInfo?.email
            )}
          </span>
          <span>|</span>
          <span>
            {getPlaceholderOrValue(
              "personalInfo",
              "phone",
              personalInfo?.phone
            )}
          </span>
          <span>|</span>
          <span>
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
            {getPlaceholderOrValue("personalInfo", "city", personalInfo?.city)}
          </span>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div
        className={`mb-6 ${
          breakSettings.keepHeadingsWithContent ? "keep-together" : ""
        }`}
      >
        <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("profile")}
        </h2>
        <p className="text-sm">
          {getPlaceholderOrValue("profile", "profile", data.profile)}
        </p>
      </div>
    );
  };

  const renderEducation = () => {
    return (
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("education")}
        </h2>
        <div className="space-y-4">
          {(data.education?.length
            ? data.education
            : placeholderData.education
          ).map((edu: Education, index: number) => (
            <div
              key={index}
              className={`${
                index > 0 && breakSettings.minLinesBeforeBreak > 0 ? "mt-4" : ""
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
      </div>
    );
  };

  const renderExperience = () => {
    return (
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("experience")}
        </h2>
        <div className="space-y-4">
          {(data.experience?.length
            ? data.experience
            : placeholderData.experience
          ).map((exp: Experience, index: number) => (
            <div
              key={index}
              className={`${
                index > 0 && breakSettings.minLinesBeforeBreak > 0 ? "mt-4" : ""
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
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    return (
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("skills")}
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {(data.skills?.length ? data.skills : placeholderData.skills).map(
            (skill: Skill, index: number) => (
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
            )
          )}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    return (
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("languages")}
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {(data.languages?.length
            ? data.languages
            : placeholderData.languages
          ).map((language: Language, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{language.name}</span>
              <span className="text-sm text-gray-600">{language.level}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInterests = () => {
    return (
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-3 pb-2 border-b-2"
          style={{ borderColor: accentColor }}
        >
          {getSectionTitle("interests")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {(data.interests?.length
            ? data.interests
            : placeholderData.interests
          ).map((interest: Interest, index: number) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              {interest.name}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Render custom section
  const renderCustomSection = (section: string) => {
    const sectionData = data[section] as CustomSectionItem[];

    if (!sectionData || sectionData.length === 0) return null;

    return (
      <div className="mb-6">
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
          }
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Page 1 */}
      <div
        className="cv-page bg-white"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          boxSizing: "border-box",
          margin: "0 auto",
        }}
      >
        {page1Sections.map((section) => (
          <div key={section}>{renderSection(section)}</div>
        ))}
      </div>

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div
          className="cv-page bg-white"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "20mm",
            boxSizing: "border-box",
            margin: "2rem auto 0",
            pageBreakBefore: "always",
          }}
        >
          {/* Always include personal info at the top of page 2 */}
          {renderPersonalInfo()}

          {/* Render sections for page 2 */}
          {page2Sections.map((section) => (
            <div key={section}>{renderSection(section)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
