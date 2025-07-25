import type { CVData } from "@/types";
import Image from "next/image";
import { Mail, Phone, Home, User } from "lucide-react";
import { getPlaceholderOrValue, placeholderData } from "@/lib/utils";

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

interface CVPreviewCirculaireProps {
  data: CVData;
  sectionOrder: string[];
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
  template?: string;
  accentColor?: string;
  fontFamily?: string;
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
}

export default function CVPreviewCirculaire({
  data,
  sectionOrder,
  pageBreakSettings,
  template = "modern",
  accentColor = "#006273",
  fontFamily = "inter",
  sectionPages = {},
  customSectionNames = {},
}: CVPreviewCirculaireProps) {
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
      case "personal-info":
        return "Informations personnelles";
      default:
        if (section.startsWith("custom-")) {
          return "Section personnalisée";
        }
        return "";
    }
  };

  const renderCustomSection = (section: string) => {
    if (section.startsWith("custom-") && data[section]) {
      return (
        <div className="mt-6">
          <h2
            style={{ color: accentColor, borderColor: accentColor }}
            className="text-xl font-bold mb-4 border-b pb-2"
          >
            {getSectionTitle(section)}
          </h2>
          <div className="space-y-4">
            {(data[section] as any[]).map((item, index) => (
              <div key={index} className="mb-4">
                {item.title && (
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-gray-700 mt-1 whitespace-pre-line">
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
  };

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
        // Handle custom sections
        if (section.startsWith("custom-")) {
          return renderCustomSection(section);
        }
        return null;
    }
  };

  const renderPersonalInfo = () => {
    const firstName =
      personalInfo && "firstName" in personalInfo
        ? personalInfo.firstName || ""
        : "";
    const lastName =
      personalInfo && "lastName" in personalInfo
        ? personalInfo.lastName || ""
        : "";
    const title =
      personalInfo && "title" in personalInfo ? personalInfo.title || "" : "";
    const email =
      personalInfo && "email" in personalInfo ? personalInfo.email || "" : "";
    const phone =
      personalInfo && "phone" in personalInfo ? personalInfo.phone || "" : "";
    const address =
      personalInfo && "address" in personalInfo
        ? personalInfo.address || ""
        : "";
    const postalCode =
      personalInfo && "postalCode" in personalInfo
        ? personalInfo.postalCode || ""
        : "";
    const city =
      personalInfo && "city" in personalInfo ? personalInfo.city || "" : "";

    return (
      <div className="mt-6">
        {(firstName ||
          lastName ||
          title ||
          email ||
          phone ||
          address ||
          postalCode ||
          city) && (
          <>
            <h2
              style={{ color: accentColor, borderColor: accentColor }}
              className="text-xl font-bold mb-4 border-b pb-2"
            >
              Informations personnelles
            </h2>
            <div className="space-y-4">
              {(firstName || lastName) && (
                <div className="flex items-center gap-3">
                  <User style={{ color: accentColor }} className="h-5 w-5  " />
                  <span className="text-gray-700">
                    {firstName} {lastName}
                  </span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3">
                  <Mail style={{ color: accentColor }} className="h-5 w-5  " />
                  <span className="text-gray-700">{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3">
                  <Phone style={{ color: accentColor }} className="h-5 w-5  " />
                  <span className="text-gray-700">{phone}</span>
                </div>
              )}
              {(address || postalCode || city) && (
                <div className="flex items-start gap-3">
                  <Home
                    style={{ color: accentColor }}
                    className="h-5 w-5   mt-0.5"
                  />
                  <div className="text-gray-700">
                    {address && <div>{address}</div>}
                    {(postalCode || city) && (
                      <div>
                        {postalCode} {city}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderProfile = () => {
    return data.profile ? (
      <div className="mb-8">
        {data.profile && (
          <>
            <h3
              style={{ color: accentColor, borderColor: accentColor }}
              className="text-2xl font-bold mb-4  border-b  pb-2"
            >
              {getSectionTitle("profile")}
            </h3>
            <p className="text-gray-700">{data.profile}</p>
          </>
        )}
      </div>
    ) : null;
  };

  const renderEducation = () => {
    return (
      <div className="mb-8">
        {data.education?.length > 0 && (
          <>
            <h3
              style={{ color: accentColor, borderColor: accentColor }}
              className="text-2xl font-bold mb-4  border-b  pb-2"
            >
              {getSectionTitle("education")}
            </h3>
            <div className="space-y-6">
              {data.education.map((edu: Education, index: number) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <div>
                      <p className="font-bold text-gray-800">{edu.degree}</p>
                      <p style={{ color: accentColor }} className=" ">
                        {edu.school}
                      </p>
                    </div>
                    <div className="text-gray-600 font-medium">
                      {edu.startDate}
                      {edu.current ? "ce jour" : edu.endDate}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderExperience = () => {
    return (
      <div className="mb-8">
        {data.experience?.length > 0 && (
          <>
            <h3
              style={{ color: accentColor, borderColor: accentColor }}
              className="text-2xl font-bold mb-4  border-b  pb-2"
            >
              {getSectionTitle("experience")}
            </h3>
            <div className="space-y-6">
              {data.experience.map((exp: Experience, index: number) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <div>
                      <p className="font-bold text-gray-800">{exp.position}</p>
                      <p style={{ color: accentColor }} className=" ">
                        {exp.company}, {exp.location}
                      </p>
                    </div>
                    <div className="text-gray-600 font-medium">
                      {exp.startDate} 
                      {exp.current ? "ce jour" : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="mt-3 text-gray-700">
                      <div className="whitespace-pre-line">
                        {exp.description.split("\n").map((item, i) => (
                          <div key={i} className="flex items-start">
                            <span className="mr-2 text-black">•</span>
                            <span>{item.replace("• ", "")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderSkills = () => {
    return (
      <div className="mb-8">
        {data.skills?.length > 0 && (
          <>
            <h2
              style={{ color: accentColor, borderColor: accentColor }}
              className={`text-xl font-bold mb-4  border-b pt-6 pb-2`}
            >
              {getSectionTitle("skills")}
            </h2>
            <div className="space-y-3">
              {data.skills.map((skill: Skill, index: number) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{skill.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderLanguages = () => {
    return data.languages?.length > 0 ? (
      <div className="mb-8">
        {data.languages?.length > 0 && (
          <>
            <h2
              style={{ color: accentColor, borderColor: accentColor }}
              className="text-xl font-bold mb-4  border-b  pb-2"
            >
              {getSectionTitle("languages")}
            </h2>
            <div className="space-y-2">
              {data.languages.map((lang: Language, index: number) => (
                <div key={index} className="text-gray-700">
                  <span>{lang.name}: </span>
                  <span className="text-gray-600">{lang.level}</span>
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
      <div className="mb-8">
        {data.interests?.length > 0 && (
          <>
            <h2
              style={{ color: accentColor, borderColor: accentColor }}
              className="text-xl font-bold mb-4  border-b  pb-2"
            >
              {getSectionTitle("interests")}
            </h2>
            <div className="space-y-2">
              {data.interests.map((interest: Interest, index: number) => (
                <div key={index} className="flex items-start">
                  <div
                    style={{ backgroundColor: accentColor }}
                    className="w-3 h-3  mt-1.5 mr-2 flex-shrink-0"
                  ></div>
                  <span className="text-gray-700">{interest.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderPage = (sections: string[]) => (
    <div className="cv-page bg-white shadow-lg">
      <div className="flex h-full">
        {/* Left sidebar */}
        <div className="w-1/3 relative bg-[#e6eaeb]  min-h-[297mm]">
          {/* Top teal curved section */}
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute top-0 left-0 w-full h-[160px] "
          >
            <div
              className="absolute bottom-[-77px] left-0 w-full h-24"
              style={{
                background: accentColor,

                clipPath: "ellipse(55% 60% at 52% 0%)",
              }}
            ></div>
          </div>

          {/* Name at the top */}
          <div className="relative z-10 pt-12 px-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              {personalInfo && "firstName" in personalInfo
                ? personalInfo.firstName || ""
                : ""}{" "}
              {personalInfo && "lastName" in personalInfo
                ? personalInfo.lastName || ""
                : ""}
            </h1>
          </div>

          {/* Profile photo */}
          <div className="relative z-10 flex justify-center mt-6">
            {personalInfo && "photo" in personalInfo && personalInfo.photo && (
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={personalInfo.photo}
                  alt={`${
                    personalInfo && "firstName" in personalInfo
                      ? personalInfo.firstName || ""
                      : ""
                  } ${
                    personalInfo && "lastName" in personalInfo
                      ? personalInfo.lastName || ""
                      : ""
                  }`}
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          {/* Content sections */}
          <div className="relative z-10 px-8 pt-8 pb-32">
            {sections.includes("personal-info") && renderPersonalInfo()}
            {sections.includes("skills") && renderSkills()}
            {sections.includes("languages") && renderLanguages()}
            {sections.includes("interests") && renderInterests()}
          </div>

          {/* Bottom teal curved section */}
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute bottom-10 left-0 w-full h-[125px] "
          >
            <div
              className="absolute  top-0 left-0 w-full h-20"
              style={{
                background: "#e6eaeb",
                clipPath: "ellipse(60% 60% at 52% 0%)",
              }}
            ></div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-2/3 p-8">
          <div className="space-y-6">
            {sections
              .filter(
                (section) =>
                  ![
                    "skills",
                    "languages",
                    "interests",
                    "personal-info",
                  ].includes(section)
              )
              .map((section) => (
                <div key={section}>{renderSection(section)}</div>
              ))}
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
    </div>
  );
}
