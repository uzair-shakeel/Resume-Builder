import React from "react";
import type { CVData, CustomSectionItem } from "@/types";
import Image from "next/image";
import { placeholderData, getPlaceholderOrValue } from "@/lib/utils";

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
        return data.experience?.length > 0 ? (
          <div className="mb-8">
            {data.experience?.length > 0 && (
              <>
                <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
                  {getSectionTitle(section)}
                </h2>
                <div className="relative">
                  {/* Continuous vertical line that spans the entire timeline */}
                  <div
                    style={{ backgroundColor: accentColor }}
                    className="absolute left-[calc(33.333%+5.2px)] top-2 bottom-10 w-0.5 "
                  ></div>

                  {data.experience.map((exp, index) => (
                    <div key={index} className="mb-8 relative">
                      <div className="flex">
                        <div className="w-1/3">
                          <p className="font-semibold text-sm uppercase">
                            {exp.company}
                          </p>
                          {exp.location && (
                            <p className="text-xs text-gray-500">
                              {exp.location}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            {exp.startDate} -{" "}
                            {exp.current ? "Present" : exp.endDate}
                          </p>
                        </div>
                        <div className="w-2/3">
                          <div className="flex relative pl-6 items-start">
                            {/* Timeline dot */}
                            <div
                              style={{ backgroundColor: accentColor }}
                              className="absolute left-0 top-1.5 w-3 h-3 rounded-full  z-10"
                            ></div>

                            <p className="font-semibold text-sm">
                              {exp.position}
                            </p>
                          </div>
                          <div className="pl-6 mt-1">
                            <p
                              className="text-xs text-gray-700"
                              dangerouslySetInnerHTML={{
                                __html: exp.description
                                  ? exp.description
                                      .replace(/\n/g, "<br/>")
                                      .replace(/\./g, ".<br/>")
                                  : "",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null;
      case "education":
        return data.education?.length > 0 ? (
          <div className="mb-8">
            {data.education?.length > 0 && (
              <>
                <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
                  {getSectionTitle(section)}
                </h2>
                {data.education.map((edu, index) => (
                  <div key={index} className="mb-6 relative">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Left column - School and dates */}
                      <div className="col-span-1">
                        <p className="font-semibold text-sm uppercase">
                          {edu.school}
                        </p>
                        <p className="text-xs text-gray-500">
                          {edu.startDate} -{" "}
                          {edu.current ? "Present" : edu.endDate}
                        </p>
                      </div>

                      {/* Right column - Degree and description */}
                      <div className="col-span-2 relative pl-6">
                        {/* Timeline dot */}
                        <div
                          style={{ backgroundColor: accentColor }}
                          className="absolute left-0 top-1.5 w-3 h-3 rounded-full "
                        ></div>

                        {/* Vertical line connecting dots (except for last item) */}
                        {index < data.education.length - 1 && (
                          <div
                            className="absolute left-[5.2px] top-3 w-0.5 "
                            style={{
                              height: "calc(100% + 1.5rem)",
                              backgroundColor: accentColor,
                            }}
                          ></div>
                        )}

                        <p className="font-semibold text-sm">{edu.degree}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : null;
      case "skills":
        return data.skills?.length > 0 ? (
          <div className="mb-8">
            {data.skills?.length > 0 && (
              <>
                <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
                  {getSectionTitle(section)}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {data.skills.slice(0, 6).map((skill, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-xs uppercase mb-1 text-gray-600">
                        {skill.name}
                      </p>
                      <div className="w-full bg-gray-200 h-2 rounded-sm">
                        <div
                          className="h-full  rounded-sm"
                          style={{
                            width: `${(skill.level / 5) * 100}%`,
                            backgroundColor: accentColor,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null;
      case "languages":
        return data.languages?.length > 0 ? (
          <div className="mb-8">
            {data.languages?.length > 0 && (
              <>
                <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
                  {getSectionTitle(section)}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {data.languages.map((language, index) => (
                    <div key={index} className="mb-2">
                      <p className="text-xs uppercase mb-1 text-gray-600">
                        {language.name}
                      </p>
                      <div className="w-full bg-gray-200 h-2 rounded-sm">
                        <div
                          className=" h-2 rounded-sm"
                          style={{
                            width:
                              language.level === "Natif" ||
                              language.level === "Native/Bilingual" ||
                              language.level === "Native" ||
                              language.level === "Bilingual"
                                ? "100%"
                                : language.level === "Courant" ||
                                  language.level === "Full Professional"
                                ? "80%"
                                : language.level === "Avancé" ||
                                  language.level === "Professional Working"
                                ? "60%"
                                : language.level === "Intermédiaire" ||
                                  language.level === "Limited Working"
                                ? "40%"
                                : language.level === "Elementary"
                                ? "20%"
                                : "50%", // Default value if level doesn't match any known value
                            backgroundColor: accentColor,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null;
      case "interests":
        return data.interests?.length > 0 ? (
          <div className="mb-8">
            {data.interests?.length > 0 && (
              <>
                <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
                  {getSectionTitle(section)}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm rounded-full text-gray-700 bg-gray-100"
                    >
                      {interest.name}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null;
      default:
        // Handle custom sections
        if (section.startsWith("custom-") && data[section]) {
          return data[section].length > 0 ? (
            <div className="mb-8">
              {data[section].length > 0 && (
                <>
                  <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
                    {getSectionTitle(section)}
                  </h2>
                  <div className="space-y-4">
                    {(data[section] as CustomSectionItem[]).map(
                      (item, index) => (
                        <div key={index}>
                          {item.title && (
                            <p className="font-semibold text-sm">
                              {item.title}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-xs text-gray-700 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ) : null;
        }
        return null;
    }
  };

  return (
    <div
      style={{
        fontFamily: fontFamily,
      }}
      className="cv-container"
    >
      {/* Page 1 */}
      <div className="cv-page bg-white">
        <div className="cv-page-content flex">
          {/* Left sidebar */}
          <div className="w-1/3 cv-sidebar bg-gray-700 text-white flex flex-col p-6">
            {/* Photo */}
            <div className="mx-auto mb-4">
              {personalInfo?.photo && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-500 bg-gray-500">
                  <Image
                    src={personalInfo?.photo}
                    alt={`${personalInfo?.firstName || ""} ${
                      personalInfo?.lastName || ""
                    }`}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* About me - only show if profile is in section order */}
            {sectionOrder.includes("profile") && data.profile && (
              <div className="mb-6">
                {data.profile && (
                  <>
                    <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                      {getSectionTitle("profile")}
                    </h2>
                    <p className="text-sm text-gray-300">{data.profile}</p>
                  </>
                )}
              </div>
            )}

            {/* Links - always show heading if socials exist */}
            {data.socials?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                  {getSectionTitle("socials")}
                </h2>
                <div className="text-sm">
                  {data.socials.map((social: Social, index: number) => (
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
                  ))}
                </div>
              </div>
            )}

            {/* Reference - always show heading if references exist */}
            {data.references?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                  {getSectionTitle("references")}
                </h2>
                {data.references.map((reference: Reference, index: number) => (
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
                ))}
              </div>
            )}

            {/* Hobbies/Interests */}
            {data.interests?.length > 0 &&
              sectionOrder.includes("interests") && (
                <div>
                  <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                    {getSectionTitle("interests")}
                  </h2>
                  <ul className="text-sm text-gray-300">
                    {data.interests.map((interest, index) => (
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
                  {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
                </h1>
                {personalInfo?.title && (
                  <p className="text-sm uppercase tracking-wider text-gray-800">
                    {personalInfo?.title}
                  </p>
                )}
              </div>

              {/* Contact info */}
              <div className="mb-8">
                {(personalInfo?.address ||
                  personalInfo?.city ||
                  personalInfo?.postalCode) && (
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <p className="text-sm text-gray-700">
                      {personalInfo?.address || ""}, {personalInfo?.city || ""},{" "}
                      {personalInfo?.postalCode || ""}
                    </p>
                    <div
                      style={{ backgroundColor: accentColor }}
                      className="w-6 h-6 rounded-full y63hnhgb  flex items-center justify-center mr-2"
                    >
                      <span className="text-white text-xs">📍</span>
                    </div>
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <p className="text-sm text-gray-700">
                      {personalInfo?.phone}
                    </p>
                    <div
                      style={{ backgroundColor: accentColor }}
                      className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                    >
                      <span className="text-white text-xs">📞</span>
                    </div>
                  </div>
                )}
                {personalInfo?.email && (
                  <div className="flex items-center justify-end gap-3">
                    <p className="text-sm text-gray-700">
                      {personalInfo?.email}
                    </p>
                    <div
                      style={{ backgroundColor: accentColor }}
                      className="w-6 h-6 rounded-full  flex items-center justify-center mr-2"
                    >
                      <span className="text-white text-xs">✉️</span>
                    </div>
                  </div>
                )}
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

              {/* About me - only show if profile is in section order */}
              {sectionOrder.includes("profile") && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                    {getSectionTitle("profile")}
                  </h2>
                  <p className="text-sm text-gray-300">
                    {profile || placeholderData.profile}
                  </p>
                </div>
              )}

              {/* Socials for page 2 - always show heading */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                  {getSectionTitle("socials")}
                </h2>
                <div className="text-sm">
                  {socials && socials.length > 0
                    ? socials.map((social: Social, index: number) => (
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
                    : placeholderData.socials.map((social, index) => (
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
                      ))}
                </div>
              </div>

              {/* References for page 2 - always show heading */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
                  {getSectionTitle("references")}
                </h2>
                {references && references.length > 0
                  ? references.map((reference: Reference, index: number) => (
                      <div key={index} className="text-sm mb-4">
                        <p className="font-semibold mb-1">
                          {reference.name.toUpperCase()}
                        </p>
                        <p className="text-gray-300 mb-1">
                          {reference.company}
                        </p>
                        <p className="text-gray-300 mb-1">{reference.phone}</p>
                        <a
                          href={`mailto:${reference.email}`}
                          className="text-gray-300 text-xs break-words underline hover:text-gray-100"
                        >
                          {reference.email}
                        </a>
                      </div>
                    ))
                  : placeholderData.references.map((reference, index) => (
                      <div key={index} className="text-sm mb-4">
                        <p className="font-semibold mb-1">
                          {reference.name.toUpperCase()}
                        </p>
                        <p className="text-gray-300 mb-1">
                          {reference.company}
                        </p>
                        <p className="text-gray-300 mb-1">{reference.phone}</p>
                        <a
                          href={`mailto:${reference.email}`}
                          className="text-gray-300 text-xs break-words underline hover:text-gray-100"
                        >
                          {reference.email}
                        </a>
                      </div>
                    ))}
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
                      {(interests?.length
                        ? interests
                        : placeholderData.interests
                      ).map((interest, index) => (
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
                    {personalInfo?.firstName ||
                      placeholderData.personalInfo.firstName}{" "}
                    {personalInfo?.lastName ||
                      placeholderData.personalInfo.lastName}
                  </h1>
                  <p className="text-sm uppercase tracking-wider text-gray-800">
                    {personalInfo?.title || placeholderData.personalInfo.title}
                  </p>
                </div>

                {/* Contact info */}
                <div className="mb-8">
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <p className="text-sm text-gray-700">
                      {personalInfo?.address ||
                        placeholderData.personalInfo.address}
                      ,{" "}
                      {personalInfo?.city || placeholderData.personalInfo.city},{" "}
                      {personalInfo?.postalCode ||
                        placeholderData.personalInfo.postalCode}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">📍</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <p className="text-sm text-gray-700">
                      {personalInfo?.phone ||
                        placeholderData.personalInfo.phone}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                      <span className="text-white text-xs">📞</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <p className="text-sm text-gray-700">
                      {personalInfo?.email ||
                        placeholderData.personalInfo.email}
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
