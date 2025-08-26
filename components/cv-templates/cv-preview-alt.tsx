import React from "react";
import type { CVData, CustomSectionItem } from "@/types";
import Image from "next/image";
import { Mail, Phone, MapPin, Home } from "lucide-react";
import { placeholderData, getPlaceholderOrValue } from "@/lib/utils";

interface CVPreviewAltProps {
  data: CVData;
  sectionOrder: string[];
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
  language?: string;
  accentColor?: string;
  fontFamily?: string;
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
  previewMode?: boolean;
  showFirstPageOnly?: boolean;
}

export default function CVPreviewAlt({
  data,
  sectionOrder,
  pageBreakSettings,
  accentColor = "#3498db",
  fontFamily = "'DejaVu Sans', sans-serif",
  sectionPages = {},
  customSectionNames = {},
  previewMode = false,
  showFirstPageOnly = false,
  language = "fr",
}: CVPreviewAltProps) {
  const {
    personalInfo = {},
    profile = "",
    education = [],
    experience = [],
    skills = [],
    languages = [],
    interests = [],
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
      return customSectionNames[section];
    }

    // Otherwise use the default name based on language
    switch (section) {
      case "personal-info":
        return language === "fr"
          ? "Informations personnelles"
          : "Personal Information";
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
      case "references":
        return language === "fr" ? "Références" : "References";
      case "socials":
        return language === "fr" ? "Réseaux sociaux" : "Social Networks";
      case "contact":
        return language === "fr" ? "Contact" : "Contact";
      default:
        if (section.startsWith("custom-")) {
          return language === "fr" ? "Section personnalisée" : "Custom Section";
        }
        return section;
    }
  };

  const renderSection = (section: string) => {
    switch (section) {
      case "personal-info":
        return null; // Personal info is always in sidebar
      case "profile":
        return renderProfile();
      case "education":
        return renderEducation();
      case "experience":
        return renderExperience();
      case "skills":
        return null; // Skills are always in sidebar
      case "languages":
        return null; // Languages are always in sidebar
      case "interests":
        return null; // Interests are always in sidebar
      default:
        // Handle custom sections
        if (section.startsWith("custom-") && data[section]) {
          return renderCustomSection(section);
        }
        return null;
    }
  };

  const renderProfile = () => (
    <section className="mb-8">
      {profile && (
        <>
          <h2 className="text-xl text-gray-800 font-medium mb-3">
            {getSectionTitle("profile")}
          </h2>
          <p className="text-gray-600 leading-relaxed">{profile}</p>
        </>
      )}
    </section>
  );

  const renderEducation = () => (
    <section className="mb-8">
      {education?.length > 0 && (
        <>
          <h2 className="text-xl text-gray-800 font-medium mb-4">
            {getSectionTitle("education")}
          </h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{edu.school}</p>
                  <p className="text-gray-600">{edu.degree}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                </p>
              </div>
              {"description" in edu && edu.description && (
                <p className="text-gray-600 mt-2 text-sm">{edu.description}</p>
              )}
            </div>
          ))}
        </>
      )}
    </section>
  );

  const renderExperience = () => (
    <section className="mb-8">
      {experience?.length > 0 && (
        <>
          <h2 className="text-xl text-gray-800 font-medium mb-4">
            {getSectionTitle("experience")}
          </h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{exp.position}</p>
                  <p className="text-gray-600">
                    {exp.company}, {exp.location}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </p>
              </div>
              {exp.description && (
                <p className="text-gray-600 mt-2 text-sm whitespace-pre-line">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </>
      )}
    </section>
  );

  // Render custom section
  const renderCustomSection = (section: string) => {
    const sectionData = data[section] as CustomSectionItem[];

    if (!sectionData || sectionData.length === 0) return null;

    return (
      <section className="mb-8">
        {sectionData.length > 0 && (
          <>
            <h2 className="text-xl text-gray-800 font-medium mb-4">
              {getSectionTitle(section)}
            </h2>
            {sectionData.map((item, index) => (
              <div key={index} className="mb-4">
                {item.title && (
                  <p className="font-medium text-gray-800">{item.title}</p>
                )}
                {item.description && (
                  <p className="text-gray-600 mt-2 text-sm whitespace-pre-line">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </section>
    );
  };

  const renderSidebar = () => (
    <div className="cv-sidebar w-1/3 bg-purple-50 p-6 min-h-[297mm]">
      {/* Photo */}
      <div className="mb-6 flex justify-center">
        {personalInfo && "photo" in personalInfo && personalInfo.photo && (
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
            <Image
              src={personalInfo.photo as string}
              alt={`${
                "firstName" in personalInfo
                  ? (personalInfo.firstName as string) || ""
                  : ""
              } ${
                "lastName" in personalInfo
                  ? (personalInfo.lastName as string) || ""
                  : ""
              }`}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="mb-6">
        {personalInfo &&
          (("email" in personalInfo && personalInfo.email) ||
            ("phone" in personalInfo && personalInfo.phone) ||
            ("address" in personalInfo && personalInfo.address) ||
            ("postalCode" in personalInfo && personalInfo.postalCode) ||
            ("city" in personalInfo && personalInfo.city)) && (
            <>
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                {getSectionTitle("personal-info")}
              </h2>
              <div className="space-y-2">
                {personalInfo &&
                  "email" in personalInfo &&
                  personalInfo.email && (
                    <div className="flex items-start">
                      <Mail className="w-4 h-4 text-gray-700 mt-0.5 mr-2" />
                      <span className="text-sm text-gray-900">
                        {personalInfo.email as string}
                      </span>
                    </div>
                  )}
                {personalInfo &&
                  "phone" in personalInfo &&
                  personalInfo.phone && (
                    <div className="flex items-start">
                      <Phone className="w-4 h-4 text-gray-700 mt-0.5 mr-2" />
                      <span className="text-sm text-gray-900">
                        {personalInfo.phone as string}
                      </span>
                    </div>
                  )}
                {personalInfo &&
                  (("address" in personalInfo && personalInfo.address) ||
                    ("postalCode" in personalInfo && personalInfo.postalCode) ||
                    ("city" in personalInfo && personalInfo.city)) && (
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-700 mt-0.5 mr-2" />
                      <span className="text-sm text-gray-900">
                        {"address" in personalInfo
                          ? (personalInfo.address as string) || ""
                          : ""}
                        {"postalCode" in personalInfo &&
                          personalInfo.postalCode &&
                          `, ${personalInfo.postalCode as string}`}
                        {"city" in personalInfo &&
                          personalInfo.city &&
                          `, ${personalInfo.city as string}`}
                      </span>
                    </div>
                  )}
              </div>
            </>
          )}
      </div>

      {/* Skills */}
      <div className="mb-6">
        {skills?.length > 0 && (
          <>
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              {getSectionTitle("skills")}
            </h2>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-900">{skill.name}</span>
                    <span className="text-xs text-gray-700">
                      {skill.level}/5
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-1.5">
                    <div
                      className="bg-gray-700 h-1.5 rounded-full"
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Languages */}
      <div>
        {languages?.length > 0 && (
          <>
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              {getSectionTitle("languages")}
            </h2>
            <div className="space-y-2">
              {languages.map((language, index) => (
                <div key={index}>
                  <div className="text-sm text-gray-900">{language.name}</div>
                  <div className="text-sm text-gray-700">{language.level}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Interests */}
      <div>
        {interests?.length > 0 && (
          <>
            <h2 className="text-lg font-medium text-gray-900 mb-3">
              {getSectionTitle("interests")}
            </h2>
            <div className="space-y-1">
              {interests.map((interest, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                  <span className="text-sm text-gray-900">{interest.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
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
    >
      {/* Page 1 */}
      <div className="cv-page">
        <div className="flex min-h-[297mm]">
          {/* Sidebar */}
          {renderSidebar()}

          {/* Main Content */}
          <div className="cv-main-content flex-1 p-8 min-h-[297mm]">
            {page1Sections.map((section) => renderSection(section))}
          </div>
        </div>
      </div>

      {/* Page 2 (if needed) */}
      {hasPage2 && !showFirstPageOnly && (
        <div className="cv-page">
          <div className="cv-page-content flex min-h-[297mm]">
            {/* Sidebar */}
            {renderSidebar()}

            {/* Main Content */}
            <div className="cv-main-content flex-1 p-8 min-h-[297mm]">
              {page2Sections.map((section) => renderSection(section))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cv-page {
          width: 210mm;
          min-height: 297mm;
          position: relative;
          margin: 0 auto;
          background: white;
        }
        .cv-page + .cv-page {
          margin-top: 2rem;
        }
        @media print {
          .cv-page + .cv-page {
            margin-top: 0;
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
}
