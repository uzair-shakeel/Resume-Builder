import type {
  CVData,
  EducationItem,
  ExperienceItem,
  SkillItem,
  LanguageItem,
  InterestItem,
} from "@/types";
import Image from "next/image";
import { Mail, Phone, MapPin, Home } from "lucide-react";
import {
  getPlaceholderOrValue,
  getArrayPlaceholderOrValue,
  placeholderData,
} from "@/lib/utils";

interface CVPreviewProps {
  data: CVData;
  sectionOrder: string[];
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
  accentColor?: string;
  fontFamily?: string;
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
}

export default function CVPreview({
  data,
  sectionOrder,
  pageBreakSettings,
  accentColor = "#3498db",
  fontFamily = "'DejaVu Sans', sans-serif",
  sectionPages = {},
  customSectionNames = {},
}: CVPreviewProps) {
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
        return null;
    }
  };

  const renderPersonalInfo = () => {
    return (
      <div className="space-y-2 mb-6">
        <h2 className="text-lg font-semibold section-title">
          {getSectionTitle("personal-info")}
        </h2>
        <div className="space-y-2">
          {personalInfo.email && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span>
                {personalInfo.address}
                {personalInfo.postalCode && `, ${personalInfo.postalCode}`}
                {personalInfo.city && `, ${personalInfo.city}`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return profile ? (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 section-title">
          {getSectionTitle("profile")}
        </h2>
        <p className="text-gray-700">{profile}</p>
      </div>
    ) : null;
  };

  const renderEducation = () => {
    return education.length > 0 ? (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 section-title">
          {getSectionTitle("education")}
        </h2>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="keep-together">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.school}</p>
                </div>
                <div className="text-sm text-gray-500 cv-date">
                  {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                </div>
              </div>
              {"description" in edu && (edu as any).description && (
                <p className="text-gray-600 mt-1 text-sm">
                  {(edu as any).description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  const renderExperience = () => {
    return experience.length > 0 ? (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 section-title">
          {getSectionTitle("experience")}
        </h2>
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={index} className="keep-together">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{exp.position}</h3>
                  <p className="text-gray-700">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </p>
                </div>
                <div className="text-sm text-gray-500 cv-date">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </div>
              </div>
              {exp.description && (
                <p className="text-gray-600 mt-1 text-sm">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  const renderSkills = () => {
    return skills.length > 0 ? (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 section-title">
          {getSectionTitle("skills")}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">{skill.name}</span>
                <span className="text-gray-500 text-sm">{skill.level}/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 cv-skill-bar">
                <div
                  className="cv-accent-bg h-1.5 rounded-full"
                  style={{ width: `${(skill.level / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  const renderLanguages = () => {
    return languages.length > 0 ? (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 section-title">
          {getSectionTitle("languages")}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((language, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-700">{language.name}</span>
              <span className="text-gray-500 text-sm">{language.level}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  const renderInterests = () => {
    return interests.length > 0 ? (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 section-title">
          {getSectionTitle("interests")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full text-gray-700 bg-gray-100"
            >
              {interest.name}
            </span>
          ))}
        </div>
      </div>
    ) : null;
  };

  // Helper function to get section title with custom names
  const getSectionTitle = (section: string): string => {
    // If there's a custom name for this section, use it
    if (customSectionNames && customSectionNames[section]) {
      return customSectionNames[section];
    }

    // Otherwise use the default name
    switch (section) {
      case "personal-info":
        return "Personal Information";
      case "profile":
        return "Profile";
      case "education":
        return "Education";
      case "experience":
        return "Professional Experience";
      case "skills":
        return "Skills";
      case "languages":
        return "Languages";
      case "interests":
        return "Interests";
      default:
        return "";
    }
  };

  return (
    <div
      className="cv-container"
      style={
        {
          "--accent-color": accentColor,
          fontFamily: fontFamily,
        } as React.CSSProperties
      }
    >
      {/* Page 1 */}
      <div className="cv-page">
        <div className="cv-page-content">
          <header className="mb-6">
            <h1 className="text-3xl font-bold mb-1">
              {getPlaceholderOrValue(
                "personalInfo",
                "firstName",
                personalInfo.firstName
              )}{" "}
              {getPlaceholderOrValue(
                "personalInfo",
                "lastName",
                personalInfo.lastName
              )}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {getPlaceholderOrValue(
                "personalInfo",
                "title",
                personalInfo.title
              )}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {data.personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.address && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>
                    {data.personalInfo.address}
                    {data.personalInfo.postalCode &&
                      `, ${data.personalInfo.postalCode}`}
                    {data.personalInfo.city && `, ${data.personalInfo.city}`}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Render sections for page 1 */}
          {page1Sections.map((section) => (
            <div key={section}>{renderSection(section)}</div>
          ))}
        </div>
      </div>

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div className="cv-page">
          <div className="cv-page-content">
            <header className="mb-6">
              <h1 className="text-3xl font-bold mb-1">
                {getPlaceholderOrValue(
                  "personalInfo",
                  "firstName",
                  personalInfo.firstName
                )}{" "}
                {getPlaceholderOrValue(
                  "personalInfo",
                  "lastName",
                  personalInfo.lastName
                )}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {getPlaceholderOrValue(
                  "personalInfo",
                  "title",
                  personalInfo.title
                )}
              </p>
            </header>

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
