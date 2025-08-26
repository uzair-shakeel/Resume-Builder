import type { CVData, CustomSectionItem } from "@/types";
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

interface CVPreviewMinimalProps {
  data: CVData;
  sectionOrder: string[];
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
  language?: string;
  template?: string;
  accentColor?: string;
  fontFamily?: string;
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
}

export default function CVPreviewMinimal({
  data,
  sectionOrder,
  pageBreakSettings,
  template = "modern",
  accentColor = "#2a6496",
  fontFamily = "inter",
  sectionPages = {},
  customSectionNames = {},
  language = "fr",
}: CVPreviewMinimalProps) {
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

  const renderPersonalDetails = () => {
    return (
      <div className="personal-details">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
          {getSectionTitle("personal-info")}
        </h3>

        <div className="space-y-4">
          {(personalInfo?.firstName || personalInfo?.lastName) && (
            <div>
              <h4 className="font-medium">
                {language === "fr" ? "Nom" : "Name"}
              </h4>
              <p>
                {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
              </p>
            </div>
          )}

          {personalInfo?.email && (
            <div>
              <h4 className="font-medium">
                {language === "fr" ? "E-mail" : "Email"}
              </h4>
              <p>{personalInfo?.email}</p>
            </div>
          )}

          {personalInfo?.phone && (
            <div>
              <h4 className="font-medium">
                {language === "fr" ? "Téléphone" : "Phone"}
              </h4>
              <p>{personalInfo?.phone}</p>
            </div>
          )}

          {(personalInfo?.address ||
            personalInfo?.postalCode ||
            personalInfo?.city) && (
            <div>
              <h4 className="font-medium">
                {language === "fr" ? "Adresse" : "Address"}
              </h4>
              {personalInfo?.address && <p>{personalInfo?.address}</p>}
              {(personalInfo?.postalCode || personalInfo?.city) && (
                <p>
                  {personalInfo?.postalCode || ""} {personalInfo?.city || ""}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    if (!profile) return null;

    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-3"
          style={{ color: accentColor }}
        >
          {getSectionTitle("profile")}
        </h3>
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: profile }}
        />
      </div>
    );
  };

  const renderExperience = () => {
    if (!sectionOrder.includes("experience")) return null;
    return data.experience?.length > 0 ? (
      <div className="mb-8">
        {data.experience?.length > 0 && (
          <>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {getSectionTitle("experience")}
            </h3>
            <div className="border-t border-gray-200 pt-3 space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {exp.position}
                      </h4>
                      <p className="text-gray-600">
                        {exp.company}, {exp.location}
                      </p>
                    </div>
                    <div className="text-right" style={{ color: accentColor }}>
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      {exp.description.split("\n").map((item, i) => (
                        <div key={i} className="text-gray-700">
                          {item.startsWith("•")
                            ? item.substring(1).trim()
                            : item}
                        </div>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderEducation = () => {
    if (!sectionOrder.includes("education")) return null;
    return data.education?.length > 0 ? (
      <div className="mb-8">
        {data.education?.length > 0 && (
          <>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {getSectionTitle("education")}
            </h3>
            <div className="border-t border-gray-200 pt-3 space-y-6">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {edu.degree}
                      </h4>
                      <p className="text-gray-600">{edu.school}</p>
                    </div>
                    <div className="text-right" style={{ color: accentColor }}>
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderSkills = () => {
    if (!sectionOrder.includes("skills")) return null;
    return data.skills?.length > 0 ? (
      <div className="mb-8">
        {data.skills?.length > 0 && (
          <>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {getSectionTitle("skills")}
            </h3>
            <div className="border-t border-gray-200 pt-3">
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{skill.name}</span>
                      <span className="text-gray-500">{skill.level * 20}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5">
                      <div
                        className="h-1.5"
                        style={{
                          width: `${skill.level * 20}%`,
                          backgroundColor: accentColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderLanguages = () => {
    if (!sectionOrder.includes("languages")) return null;
    return data.languages?.length > 0 ? (
      <div className="mb-8">
        {data.languages?.length > 0 && (
          <>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {getSectionTitle("languages")}
            </h3>
            <div className="border-t border-gray-200 pt-3">
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-700">{lang.name}</span>
                    <span className="text-gray-500">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderInterests = () => {
    if (!sectionOrder.includes("interests")) return null;
    return data.interests?.length > 0 ? (
      <div className="mb-8">
        {data.interests?.length > 0 && (
          <>
            <h3
              className="text-xl font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {getSectionTitle("interests")}
            </h3>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full text-gray-700"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    {interest.name}
                  </span>
                ))}
              </div>
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
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-3"
          style={{ color: accentColor }}
        >
          {getSectionTitle(section)}
        </h3>
        <div className="border-t border-gray-200 pt-3 space-y-4">
          {sectionData.map((item, index) => (
            <div key={index}>
              {item.title && (
                <h4 className="font-semibold text-gray-800">{item.title}</h4>
              )}
              {item.description && (
                <p className="mt-2 text-gray-700">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render sections
  const renderSection = (section: string) => {
    switch (section) {
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
        if (section.startsWith("custom-")) {
          return renderCustomSection(section);
        }
        return null;
    }
  };

  return (
    <div className="cv-container print:p-0">
      {/* Page 1 */}
      <div
        className={`cv-page font-${fontFamily} bg-white`}
        style={{
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Header bar */}
        <div
          className="w-full h-12 print:h-12"
          style={{ backgroundColor: accentColor }}
        ></div>

        {/* Main name header */}
        <div className="px-12 py-8 print:px-12 print:py-8">
          {(personalInfo?.firstName || personalInfo?.lastName) && (
            <h1
              className="text-3xl font-bold"
              style={{
                color: accentColor,
                marginBottom: 0,
              }}
            >
              {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
            </h1>
          )}
          {personalInfo?.title && (
            <p className="text-gray-600 mt-2">{personalInfo?.title}</p>
          )}
        </div>

        {/* Main content */}
        <div className="px-12 pb-12 flex print:px-12 print:pb-12">
          {/* Left column - Personal details */}
          <div className="w-1/3 pr-8 print:pr-8">
            {personalInfo?.photo && (
              <div className="mb-6 print:mb-6">
                <div className="relative w-full pb-[100%]">
                  <Image
                    src={personalInfo.photo}
                    alt={`${personalInfo?.firstName || ""} ${
                      personalInfo?.lastName || ""
                    }`}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 240px) 100vw, 240px"
                  />
                </div>
              </div>
            )}
            {renderPersonalDetails()}
          </div>

          {/* Right column - Main content */}
          <div className="w-2/3 print:w-2/3">
            {/* Render sections for page 1 */}
            {page1Sections.map((section) => (
              <div key={section} className="print:break-inside-avoid">
                {renderSection(section)}
              </div>
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div
          className="w-full h-12 absolute bottom-0 print:h-12"
          style={{ backgroundColor: accentColor }}
        ></div>
      </div>

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div
          className={`cv-page font-${fontFamily} bg-white mt-8 print:mt-0`}
          style={{
            width: "210mm",
            minHeight: "297mm",
            margin: "0 auto",
            position: "relative",
            boxSizing: "border-box",
            pageBreakBefore: "always",
          }}
        >
          {/* Header bar */}
          <div
            className="w-full h-12 print:h-12"
            style={{ backgroundColor: accentColor }}
          ></div>

          {/* Main name header */}
          <div className="px-12 py-8 print:px-12 print:py-8">
            {(personalInfo?.firstName || personalInfo?.lastName) && (
              <h1
                className="text-3xl font-bold"
                style={{
                  color: accentColor,
                  marginBottom: 0,
                }}
              >
                {personalInfo?.firstName || ""} {personalInfo?.lastName || ""}
              </h1>
            )}
            {personalInfo?.title && (
              <p className="text-gray-600 mt-2">{personalInfo?.title}</p>
            )}
          </div>

          {/* Main content */}
          <div className="px-12 pb-12 flex print:px-12 print:pb-12">
            {/* Left column - Personal details */}
            <div className="w-1/3 pr-8 print:pr-8">
              {personalInfo?.photo && (
                <div className="mb-6 print:mb-6">
                  <div className="relative w-full pb-[100%]">
                    <Image
                      src={personalInfo.photo}
                      alt={`${personalInfo?.firstName || ""} ${
                        personalInfo?.lastName || ""
                      }`}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 240px) 100vw, 240px"
                    />
                  </div>
                </div>
              )}
              {renderPersonalDetails()}
            </div>

            {/* Right column - Main content */}
            <div className="w-2/3 print:w-2/3">
              {/* Render sections for page 2 */}
              {page2Sections.map((section) => (
                <div key={section} className="print:break-inside-avoid">
                  {renderSection(section)}
                </div>
              ))}
            </div>
          </div>

          {/* Footer bar */}
          <div
            className="w-full h-12 absolute bottom-0 print:h-12"
            style={{ backgroundColor: accentColor }}
          ></div>
        </div>
      )}
    </div>
  );
}
