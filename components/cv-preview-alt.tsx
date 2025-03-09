import React from "react";
import type { CVData, CustomSectionItem } from "@/types";
import Image from "next/image";
import { Mail, Phone, MapPin, Home } from "lucide-react";

interface CVPreviewAltProps {
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

export default function CVPreviewAlt({
  data,
  sectionOrder,
  pageBreakSettings,
  accentColor = "#3498db",
  fontFamily = "'DejaVu Sans', sans-serif",
  sectionPages = {},
  customSectionNames = {},
}: CVPreviewAltProps) {
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

  const renderProfile = () =>
    profile && (
      <section className="mb-8">
        <h2 className="text-xl text-purple-800 font-medium mb-3">
          {getSectionTitle("profile")}
        </h2>
        <p className="text-gray-600 leading-relaxed">{profile}</p>
      </section>
    );

  const renderEducation = () =>
    education.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-purple-800 font-medium mb-4">
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
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
          </div>
        ))}
      </section>
    );

  const renderExperience = () =>
    experience.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-purple-800 font-medium mb-4">
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
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            {exp.description && (
              <p className="text-gray-600 mt-2 text-sm whitespace-pre-line">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </section>
    );

  // Render custom section
  const renderCustomSection = (section: string) => {
    const sectionData = data[section] as CustomSectionItem[];

    if (!sectionData || sectionData.length === 0) return null;

    return (
      <section className="mb-8">
        <h2 className="text-xl text-purple-800 font-medium mb-4">
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
      </section>
    );
  };

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
        <div className="cv-page-content flex">
          {/* Sidebar */}
          <div className="cv-sidebar w-1/3 bg-purple-50 p-6">
            {/* Photo */}
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                <Image
                  src={personalInfo.photo || "/placeholder-user.jpg"}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-purple-900 mb-3">
                {getSectionTitle("personal-info")}
              </h2>
              <div className="space-y-2">
                {personalInfo.email && (
                  <div className="flex items-start">
                    <Mail className="w-4 h-4 text-purple-700 mt-0.5 mr-2" />
                    <span className="text-sm text-purple-900">
                      {personalInfo.email}
                    </span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-start">
                    <Phone className="w-4 h-4 text-purple-700 mt-0.5 mr-2" />
                    <span className="text-sm text-purple-900">
                      {personalInfo.phone}
                    </span>
                  </div>
                )}
                {personalInfo.address && (
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-purple-700 mt-0.5 mr-2" />
                    <span className="text-sm text-purple-900">
                      {personalInfo.address}
                      {personalInfo.postalCode &&
                        `, ${personalInfo.postalCode}`}
                      {personalInfo.city && `, ${personalInfo.city}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-medium text-purple-900 mb-3">
                  {getSectionTitle("skills")}
                </h2>
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-purple-900">
                          {skill.name}
                        </span>
                        <span className="text-xs text-purple-700">
                          {skill.level}/5
                        </span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-1.5">
                        <div
                          className="bg-purple-700 h-1.5 rounded-full"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-purple-900 mb-3">
                  {getSectionTitle("languages")}
                </h2>
                <div className="space-y-2">
                  {languages.map((language, index) => (
                    <div key={index}>
                      <div className="text-sm text-purple-900">
                        {language.name}
                      </div>
                      <div className="text-sm text-purple-700">
                        {language.level}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-purple-900 mb-3">
                  {getSectionTitle("interests")}
                </h2>
                <div className="space-y-1">
                  {interests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-700 rounded-full" />
                      <span className="text-sm text-purple-900">
                        {interest.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="cv-main-content flex-1 p-8">
            {page1Sections.map((section) => renderSection(section))}
          </div>
        </div>
      </div>

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div className="cv-page">
          <div className="cv-page-content flex">
            {/* Sidebar */}
            <div className="cv-sidebar w-1/3 bg-purple-50 p-6">
              {/* Photo */}
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src={personalInfo.photo || "/placeholder-user.jpg"}
                    alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-purple-900 mb-3">
                  {getSectionTitle("personal-info")}
                </h2>
                <div className="space-y-2">
                  {personalInfo.email && (
                    <div className="flex items-start">
                      <Mail className="w-4 h-4 text-purple-700 mt-0.5 mr-2" />
                      <span className="text-sm text-purple-900">
                        {personalInfo.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="cv-main-content flex-1 p-8">
              {page2Sections.map((section) => renderSection(section))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
