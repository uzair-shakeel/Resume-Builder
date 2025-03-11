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

  const renderSection = (section: string) => {
    switch (section) {
      case "profile":
        return renderProfile();
      case "education":
        return renderEducation();
      case "experience":
        return renderExperience();
      default:
        return null;
    }
  };

  const renderPersonalInfo = () => {
    const firstName = getPlaceholderOrValue(
      "personalInfo",
      "firstName",
      personalInfo?.firstName
    );
    const lastName = getPlaceholderOrValue(
      "personalInfo",
      "lastName",
      personalInfo?.lastName
    );
    const title = getPlaceholderOrValue(
      "personalInfo",
      "title",
      personalInfo?.title
    );
    const email = getPlaceholderOrValue(
      "personalInfo",
      "email",
      personalInfo?.email
    );
    const phone = getPlaceholderOrValue(
      "personalInfo",
      "phone",
      personalInfo?.phone
    );
    const address = getPlaceholderOrValue(
      "personalInfo",
      "address",
      personalInfo?.address
    );
    const postalCode = getPlaceholderOrValue(
      "personalInfo",
      "postalCode",
      personalInfo?.postalCode
    );
    const city = getPlaceholderOrValue(
      "personalInfo",
      "city",
      personalInfo?.city
    );

    return (
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 text-[#006273] border-b border-[#006273]/30 pb-2">
          Informations personnelles
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-[#006273]" />
            <span className="text-gray-700">
              {firstName} {lastName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#006273]" />
            <span className="text-gray-700">{email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-[#006273]" />
            <span className="text-gray-700">{phone}</span>
          </div>
          <div className="flex items-start gap-3">
            <Home className="h-5 w-5 text-[#006273] mt-0.5" />
            <div className="text-gray-700">
              <div>{address}</div>
              <div>
                {postalCode} {city}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return data.profile ? (
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 text-[#006273] border-b border-[#006273]/20 pb-2">
          {getSectionTitle("profile")}
        </h3>
        <p className="text-gray-700">
          {getPlaceholderOrValue("profile", "profile", data.profile)}
        </p>
      </div>
    ) : null;
  };

  const renderEducation = () => {
    return (
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 text-[#006273] border-b border-[#006273]/20 pb-2">
          {getSectionTitle("education")}
        </h3>
        <div className="space-y-6">
          {(data.education?.length
            ? data.education
            : placeholderData.education
          ).map((edu: Education, index: number) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <div>
                  <p className="font-bold text-gray-800">{edu.degree}</p>
                  <p className="text-[#006273]">{edu.school}</p>
                </div>
                <div className="text-gray-600 font-medium">{edu.startDate}</div>
              </div>
              {edu.description && (
                <p className="text-gray-700 mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    return (
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 text-[#006273] border-b border-[#006273]/20 pb-2">
          {getSectionTitle("experience")}
        </h3>
        <div className="space-y-6">
          {(data.experience?.length
            ? data.experience
            : placeholderData.experience
          ).map((exp: Experience, index: number) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <div>
                  <p className="font-bold text-gray-800">{exp.position}</p>
                  <p className="text-[#006273]">
                    {exp.company}, {exp.location}
                  </p>
                </div>
                <div className="text-gray-600 font-medium">
                  de {exp.startDate} à {exp.current ? "ce jour" : exp.endDate}
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
      </div>
    );
  };

  const renderSkills = () => {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#006273] border-b border-[#006273]/30 pb-2">
          {getSectionTitle("skills")}
        </h2>
        <div className="space-y-3">
          {(data.skills?.length ? data.skills : placeholderData.skills).map(
            (skill: Skill, index: number) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{skill.name}</span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      className={`w-3 h-3 rounded-full mr-1 ${
                        dot <= Math.round(skill.level / 20)
                          ? "bg-[#006273]"
                          : "bg-gray-200"
                      }`}
                    />
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
    return data.languages?.length || placeholderData.languages ? (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#006273] border-b border-[#006273]/30 pb-2">
          {getSectionTitle("languages")}
        </h2>
        <div className="space-y-2">
          {(data.languages?.length
            ? data.languages
            : placeholderData.languages
          ).map((lang: Language, index: number) => (
            <div key={index} className="text-gray-700">
              <span>{lang.name}: </span>
              <span className="text-gray-600">{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  const renderInterests = () => {
    return data.interests?.length || placeholderData.interests ? (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#006273] border-b border-[#006273]/30 pb-2">
          {getSectionTitle("interests")}
        </h2>
        <div className="space-y-2">
          {(data.interests?.length
            ? data.interests
            : placeholderData.interests
          ).map((interest: Interest, index: number) => (
            <div key={index} className="flex items-start">
              <div className="w-3 h-3 bg-[#006273] mt-1.5 mr-2 flex-shrink-0"></div>
              <span className="text-gray-700">{interest.name}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  const renderPage = (sections: string[]) => (
    <div className="cv-page bg-white shadow-lg">
      <div className="cv-page-content flex h-full">
        {/* Left sidebar */}
        <div className="w-1/3 relative bg-[#e6eaeb]  min-h-[297mm]">
          {/* Top teal curved section */}
          <div className="absolute top-0 left-0 w-full h-[160px] bg-[#006273]">
            <div
              className="absolute bottom-[-77px] left-0 w-full h-24"
              style={{
                background: "#006273",
                clipPath: "ellipse(55% 60% at 52% 0%)",
              }}
            ></div>
          </div>

          {/* Name at the top */}
          <div className="relative z-10 pt-12 px-8 text-center">
            <h1 className="text-2xl font-bold text-white">
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
          </div>

          {/* Profile photo */}
          <div className="relative z-10 flex justify-center mt-6">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={personalInfo?.photo || placeholderData.personalInfo.photo}
                alt={`${getPlaceholderOrValue(
                  "personalInfo",
                  "firstName",
                  personalInfo?.firstName
                )} ${getPlaceholderOrValue(
                  "personalInfo",
                  "lastName",
                  personalInfo?.lastName
                )}`}
                width={144}
                height={144}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Content sections */}
          <div className="relative z-10 px-8 pt-8 pb-32">
            {sections.includes("personal-info") && renderPersonalInfo()}
            {sections.includes("skills") && renderSkills()}
            {sections.includes("languages") && renderLanguages()}
            {sections.includes("interests") && renderInterests()}
          </div>

          {/* Bottom teal curved section */}
          <div className="absolute bottom-0 left-0 w-full h-[85px] bg-[#006273]">
            <div
              className="absolute top-0 left-0 w-full h-20"
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
              .filter((section) =>
                ["profile", "experience", "education"].includes(section)
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
      `}</style>
    </div>
  );
}
