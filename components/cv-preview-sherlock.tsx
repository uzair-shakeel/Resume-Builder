import React from "react";
import type { CVData, CustomSectionItem } from "@/types";
import Image from "next/image";

// Define the types locally to avoid import issues
interface Reference {
  name: string;
  company: string;
  phone: string;
  email: string;
}

interface Social {
  platform: string;
  url: string;
}

interface CVPreviewSherlockProps {
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

export default function CVPreviewSherlock({
  data,
  sectionOrder,
  pageBreakSettings,
  accentColor = "#3498db",
  fontFamily = "'DejaVu Sans', sans-serif",
  sectionPages = {},
  customSectionNames = {},
}: CVPreviewSherlockProps) {
  const {
    personalInfo,
    profile,
    education,
    experience,
    skills,
    languages,
    interests,
    references,
    socials,
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
        return "Work Experience";
      case "skills":
        return "Skills";
      case "languages":
        return "Languages";
      case "interests":
        return "Hobbies";
      default:
        return "";
    }
  };

  // Helper function to render sections
  const renderSection = (section: string) => {
    switch (section) {
      case "personal-info":
        return null; // Personal info is always in header
      case "profile":
        return null; // Profile is now only shown in the sidebar
      case "references":
        return null; // References are only shown in the sidebar
      case "socials":
        return null; // Socials are only shown in the sidebar
      case "experience":
        return (
          <div className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              {getSectionTitle(section)}
            </h2>
            <div className="relative">
              {/* Continuous vertical line that spans the entire timeline */}
              <div className="absolute left-[calc(33.333%+5.2px)] top-2 bottom-10 w-0.5 bg-gray-700"></div>

              {experience.map((exp, index) => (
                <div key={index} className="mb-8 relative">
                  <div className="flex">
                    <div className="w-1/3">
                      <p className="font-semibold text-sm uppercase">
                        {exp.company}
                      </p>
                      {exp.location && (
                        <p className="text-xs text-gray-500">{exp.location}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                    <div className="w-2/3">
                      <div className="flex relative pl-6 items-start">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gray-700 z-10"></div>

                        <p className="font-semibold text-sm">{exp.position}</p>
                      </div>
                      <div className="pl-6 mt-1">
                        <p
                          className="text-xs text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: exp.description
                              .replace(/\n/g, "<br/>")
                              .replace(/\./g, ".<br/>"),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "education":
        return (
          <div className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              {getSectionTitle(section)}
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-6 relative">
                <div className="grid grid-cols-3 gap-4">
                  {/* Left column - School and dates */}
                  <div className="col-span-1">
                    <p className="font-semibold text-sm uppercase">
                      {edu.school}
                    </p>
                    <p className="text-xs text-gray-500">
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    </p>
                  </div>

                  {/* Right column - Degree and description */}
                  <div className="col-span-2 relative pl-6">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gray-700"></div>

                    {/* Vertical line connecting dots (except for last item) */}
                    {index < education.length - 1 && (
                      <div
                        className="absolute left-[5.2px] top-3 w-0.5 bg-gray-700"
                        style={{ height: "calc(100% + 1.5rem)" }}
                      ></div>
                    )}

                    <p className="font-semibold text-sm">{edu.degree}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case "skills":
        return (
          <div className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              {getSectionTitle(section)}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {skills.slice(0, 6).map((skill, index) => (
                <div key={index} className="mb-2">
                  <p className="text-xs uppercase mb-1 text-gray-600">
                    {skill.name}
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-sm">
                    <div
                      className="h-full bg-gray-700 rounded-sm"
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "languages":
        return (
          <div className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              {getSectionTitle(section)}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((language, index) => (
                <div key={index} className="mb-2">
                  <p className="text-xs uppercase mb-1 text-gray-600">
                    {language.name}
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-sm">
                    <div
                      className="bg-gray-700 h-2 rounded-sm"
                      style={{
                        width:
                          language.level === "Natif"
                            ? "100%"
                            : language.level === "Courant"
                            ? "80%"
                            : language.level === "Avancé"
                            ? "60%"
                            : language.level === "Intermédiaire"
                            ? "40%"
                            : "20%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "interests":
        return (
          <div className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              {getSectionTitle(section)}
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
        );
      default:
        // Handle custom sections
        if (section.startsWith("custom-") && data[section]) {
          return (
            <div className="mb-8">
              <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
                {getSectionTitle(section)}
              </h2>
              <div className="space-y-4">
                {(data[section] as CustomSectionItem[]).map((item, index) => (
                  <div key={index}>
                    {item.title && (
                      <p className="font-semibold text-sm">{item.title}</p>
                    )}
                    {item.description && (
                      <p className="text-xs text-gray-700 mt-1">
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
      <div className="cv-page bg-white">
        <div className="cv-page-content flex">
          {/* Left sidebar */}
          <div className="w-1/3 cv-sidebar bg-gray-700 text-white flex flex-col">
            {/* Photo */}
            <div className="mx-auto mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-500 bg-gray-500">
                <Image
                  src={personalInfo.photo || "/placeholder-user.jpg"}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* About me - only show if profile is in section order */}
            {profile && sectionOrder.includes("profile") && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                  {getSectionTitle("profile")}
                </h2>
                <p className="text-sm text-gray-300">{profile}</p>
              </div>
            )}

            {/* Links - always show heading */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                {getSectionTitle("socials")}
              </h2>
              <div className="text-sm">
                {socials && socials.length > 0 ? (
                  socials.map((social: Social, index: number) => (
                    <div key={index} className="mb-2">
                      <p className="mb-1">{social.platform}:</p>
                      <a
                        href={
                          social.url.startsWith("http")
                            ? social.url
                            : `https://${social.url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 mb-2 text-xs break-words underline hover:text-gray-100"
                      >
                        {social.url}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300 text-xs">
                    No social links provided
                  </p>
                )}
              </div>
            </div>

            {/* Reference - always show heading */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                {getSectionTitle("references")}
              </h2>
              {references && references.length > 0 ? (
                references.map((reference: Reference, index: number) => (
                  <div key={index} className="text-sm mb-4">
                    <p className="font-semibold mb-1">
                      {reference.name.toUpperCase()}
                    </p>
                    <p className="text-gray-300 mb-1">{reference.company}</p>
                    <p className="text-gray-300 mb-1">{reference.phone}</p>
                    <a
                      href={`mailto:${reference.email}`}
                      className="text-gray-300 text-xs break-words underline hover:text-gray-100"
                    >
                      {reference.email}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-xs">No references provided</p>
              )}
            </div>

            {/* Hobbies/Interests */}
            {interests &&
              interests.length > 0 &&
              sectionOrder.includes("interests") && (
                <div>
                  <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                    {getSectionTitle("interests")}
                  </h2>
                  <ul className="text-sm text-gray-300">
                    {interests.map((interest, index) => (
                      <li key={index} className="mb-1">
                        • {interest.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                    <span className="text-white text-xs">📍</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 mb-2">
                  <p className="text-sm text-gray-700">{personalInfo.phone}</p>
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                    <span className="text-white text-xs">📞</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <p className="text-sm text-gray-700">{personalInfo.email}</p>
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                    <span className="text-white text-xs">✉️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Render sections for page 1 */}
            {page1Sections.map((section) => (
              <div key={section}>{renderSection(section)}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Page 2 */}
      {hasPage2 && (
        <div className="cv-page">
          <div className="cv-page-content flex">
            {/* Left sidebar */}
            <div className="w-1/3 cv-sidebar bg-gray-700 text-white flex flex-col">
              {/* Photo */}
              <div className="mx-auto mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-500 bg-gray-500">
                  <Image
                    src={personalInfo.photo || "/placeholder-user.jpg"}
                    alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* About me - only show if profile is in section order */}
              {profile && sectionOrder.includes("profile") && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                    {getSectionTitle("profile")}
                  </h2>
                  <p className="text-sm text-gray-300">{profile}</p>
                </div>
              )}

              {/* Socials for page 2 - always show heading */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                  {getSectionTitle("socials")}
                </h2>
                <div className="text-sm">
                  {socials && socials.length > 0 ? (
                    socials.map((social: Social, index: number) => (
                      <div key={index} className="mb-2">
                        <p className="mb-1">{social.platform}:</p>
                        <a
                          href={
                            social.url.startsWith("http")
                              ? social.url
                              : `https://${social.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 mb-2 text-xs break-words underline hover:text-gray-100"
                        >
                          {social.url}
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-300 text-xs">
                      No social links provided
                    </p>
                  )}
                </div>
              </div>

              {/* References for page 2 - always show heading */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                  {getSectionTitle("references")}
                </h2>
                {references && references.length > 0 ? (
                  references.map((reference: Reference, index: number) => (
                    <div key={index} className="text-sm mb-4">
                      <p className="font-semibold mb-1">
                        {reference.name.toUpperCase()}
                      </p>
                      <p className="text-gray-300 mb-1">{reference.company}</p>
                      <p className="text-gray-300 mb-1">{reference.phone}</p>
                      <a
                        href={`mailto:${reference.email}`}
                        className="text-gray-300 text-xs break-words underline hover:text-gray-100"
                      >
                        {reference.email}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300 text-xs">
                    No references provided
                  </p>
                )}
              </div>

              {/* Interests for page 2 */}
              {interests &&
                interests.length > 0 &&
                sectionOrder.includes("interests") && (
                  <div>
                    <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                      {getSectionTitle("interests")}
                    </h2>
                    <ul className="text-sm text-gray-300">
                      {interests.map((interest, index) => (
                        <li key={index} className="mb-1">
                          • {interest.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                      <span className="text-white text-xs">📍</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <p className="text-sm text-gray-700">
                      {personalInfo.phone}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">📞</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <p className="text-sm text-gray-700">
                      {personalInfo.email}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✉️</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Render sections for page 2 */}
              {page2Sections.map((section) => (
                <div key={section}>{renderSection(section)}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
