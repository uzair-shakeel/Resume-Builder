import type { CVData } from "@/types";
import { getPlaceholderOrValue, placeholderData } from "@/lib/utils";
import { Home, HomeIcon, Mail, Phone } from "lucide-react";

// Define the types locally to avoid import issues
interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  location?: string;
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

interface CVPreviewStudentProps {
  data: CVData;
  sectionOrder: string[];
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
  customSections?: Record<string, string>;
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
  template?: string;
  accentColor?: string;
  fontFamily?: string;
  previewMode?: boolean;
  showFirstPageOnly?: boolean;
}

export default function CVPreviewStudent({
  data,
  sectionOrder,
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
  pageBreakSettings,
  template = "modern",
  accentColor = "#a5d8ff",
  fontFamily = "inter",
  previewMode = false,
  showFirstPageOnly = false,
}: CVPreviewStudentProps) {
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
      case "profile":
        return "Summary";
      case "education":
        return "Education";
      case "experience":
        return "Experience";
      case "skills":
        return "Skills";
      case "languages":
        return "Languages";
      case "interests":
        return "Interests";
      case "achievements":
        return "Achievements";
      case "technical-skills":
        return "Technical Skills";
      case "activities":
        return "Activities";
      case "key-skills":
        return "Key Skills";
      case "volunteer-work":
        return "Volunteer Work";
      default:
        if (section.startsWith("custom-")) {
          return section.replace("custom-", "Custom Section ");
        }
        return (
          section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, " ")
        );
    }
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
      case "achievements":
        return renderAchievements();
      case "technical-skills":
        return renderTechnicalSkills();
      case "activities":
        return renderActivities();
      case "key-skills":
        return renderKeySkills();
      case "volunteer-work":
        return renderVolunteerWork();
      default:
        if (section.startsWith("custom-") && customSections[section]) {
          return renderCustomSection(section);
        }
        return null;
    }
  };

  const renderCustomSection = (sectionKey: string) => {
    const content = customSections[sectionKey] || "";
    const title =
      customSectionNames[sectionKey] ||
      sectionKey.replace("custom-", "Custom Section ");

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">{title}</h3>
        <div className="space-y-1 text-base">
          {content.split("\n").map((item, i) => (
            <p key={i} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{item.replace(/^• /, "")}</span>
            </p>
          ))}
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    const firstName = personalInfo?.firstName || "";
    const lastName = personalInfo?.lastName || "";
    const title = personalInfo?.title || "";

    return (
      <div className="header mb-8">
        <h1 className="text-5xl font-bold tracking-[0.2em] text-center mb-4">
          {firstName.toUpperCase()} {lastName.toUpperCase()}
        </h1>
        {title && (
          <div className="relative py-4">
            <div
              className="absolute top-0 left-0 right-0 h-[1px] cv-accent-bg"
            ></div>
            <h2 className="text-2xl text-center uppercase tracking-widest">
              {title}
            </h2>
            <div
              className="absolute bottom-0 left-0 right-0 h-[1px] cv-accent-bg"
            ></div>
          </div>
        )}
      </div>
    );
  };

  const renderPersonalInfo = () => {
    const email = personalInfo?.email || "";
    const phone = personalInfo?.phone || "";
    const address = personalInfo?.address || "";
    const postalCode = personalInfo?.postalCode || "";
    const city = personalInfo?.city || "";

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">
          {getSectionTitle("personal-info") || "Contact"}
        </h3>
        <div className="space-y-3 text-base">
          {phone && (
            <div className="flex items-center gap-3">
              <span className="inline-block">
                <Phone size={18} />
              </span>
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-3">
              <span className="inline-block">
                <Mail size={18} />
              </span>
              <span>{email}</span>
            </div>
          )}
          {(address || city || postalCode) && (
            <div className="flex items-center gap-3">
              <span className="inline-block">
                <HomeIcon size={18} />
              </span>
              <div>
                {address && <p>{address},</p>}
                {(city || postalCode) && (
                  <p>
                    {city && city}
                    {city && postalCode && ", "}
                    {postalCode && postalCode}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return data.profile ? (
      <div className="mb-8">
        {data.profile && (
          <>
            <h3 className="text-xl font-bold mb-4 uppercase">
              {getSectionTitle("profile")}
            </h3>
            <p className="text-base">{data.profile}</p>
          </>
        )}
      </div>
    ) : null;
  };

  const renderEducation = () => {
    return data.education?.length > 0 ? (
      <div className="mb-8">
        {data.education?.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-4 uppercase">
              {getSectionTitle("education")}
            </h3>
            <div className="space-y-2">
              {data.education.map((edu: Education, index: number) => (
                <div key={index} className="text-base">
                  <p className="font-bold uppercase">
                    {edu.school}
                    {edu.location ? `, ${edu.location}` : ""}
                  </p>
                  <p>
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </p>
                </div>
              ))}
            </div>
            <div
              className="mt-6 h-[1px] cv-accent-bg"
            ></div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderExperience = () => {
    return data.experience?.length > 0 ? (
      <div className="mb-8">
        {data.experience?.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-4 uppercase">
              {getSectionTitle("experience")}
            </h3>
            <div className="space-y-6">
              {data.experience.map((exp: Experience, index: number) => (
                <div key={index} className="text-base">
                  <p className="font-bold uppercase">{exp.position}</p>
                  <p>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                  {exp.description && (
                    <div className="mt-2">
                      {exp.description.split("\n").map((item, i) => (
                        <p key={i} className="flex items-start mb-1">
                          <span className="mr-2">•</span>
                          <span>{item.replace(/^• /, "")}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div
              className="mt-6 h-[1px] cv-accent-bg"
            ></div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderSkills = () => {
    return data.skills?.length > 0 ? (
      <div className="mb-8">
        {data.skills?.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-4 uppercase">
              {getSectionTitle("skills")}
            </h3>
            <div className="space-y-2">
              {data.skills.map((skill: Skill, index: number) => (
                <div key={index} className="text-base">
                  <div className="flex justify-between mb-1">
                    <span>{skill.name}</span>
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
      <div className="mb-8">
        {data.languages?.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-4 uppercase">
              {getSectionTitle("languages")}
            </h3>
            <div className="space-y-2">
              {data.languages.map((lang: Language, index: number) => (
                <div
                  key={index}
                  className="flex flex-col justify-between text-base"
                >
                  <span>{lang.name}</span>
                  <span>{lang.level}</span>
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
            <h3 className="text-xl font-bold mb-4 uppercase">
              {getSectionTitle("interests")}
            </h3>
            <div className="space-y-1">
              {data.interests.map((interest: Interest, index: number) => (
                <p key={index} className="flex items-start text-base">
                  <span className="mr-2">•</span>
                  <span>{interest.name}</span>
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    ) : null;
  };

  const renderAchievements = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">
          {getSectionTitle("achievements")}
        </h3>
        <div className="space-y-1 text-base">
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              National Society
              <br />
              Cras ac enim leo / 2022
            </span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              National Society
              <br />
              Vestibulum ac justo / 2023
            </span>
          </p>
        </div>
      </div>
    );
  };

  const renderTechnicalSkills = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">
          {getSectionTitle("technical-skills")}
        </h3>
        <div className="space-y-1 text-base">
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Computer</span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Math</span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Microsoft Office</span>
          </p>
        </div>
      </div>
    );
  };

  const renderActivities = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">
          {getSectionTitle("activities")}
        </h3>
        <div className="text-base">
          <p className="font-bold">VELIT BIBENDUM</p>
          <p className="font-bold">HIGH SCHOOL TENNIS TEAM</p>
          <p>2021 - Present</p>
        </div>
      </div>
    );
  };

  const renderKeySkills = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">
          {getSectionTitle("key-skills")}
        </h3>
        <div className="space-y-1 text-base">
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Friendly</span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Good listener</span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Courteous</span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Helpful</span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Guest services</span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Interpersonal</span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Positive attitude</span>
          </p>
          <p className="flex items-start">
            <span className="mr-2">•</span>
            <span>Customer service</span>
          </p>
        </div>
      </div>
    );
  };

  const renderVolunteerWork = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">
          {getSectionTitle("volunteer-work")}
        </h3>
        <div className="space-y-6 text-base">
          <div>
            <p className="font-bold uppercase">SUSPENDISSE UT JUSTO COACH</p>
            <p>2021 - Present</p>
          </div>
          <div>
            <p className="font-bold uppercase">IN PHARETRA ARCU PROGRAM</p>
            <p>2022 - Present</p>
          </div>
        </div>
      </div>
    );
  };

  // Render a single page with the given sections
  const renderPage = (sections: string[], isFirstPage: boolean = true) => (
    <div className="cv-page max-w-[1000px] mx-auto font-sans bg-white">
      {isFirstPage && <div className="p-8 pb-0">{renderHeader()}</div>}
      <div className="flex relative">
        {/* Left sidebar with curved bottom */}
        <div className="w-1/3 p-8 pt-0 relative">
          {isFirstPage ? (
            <>
              {sections.includes("personal-info") && renderPersonalInfo()}
              <div className="custom-shape-divider-top-1741392645">
                <svg
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                    className="shape-fill"
                  ></path>
                </svg>
              </div>
              <div className="absolute top-[220px] left-0 w-full h-full cv-sidebar"></div>
              <div className="relative z-10 mt-[150px]">
                {sections
                  .filter(
                    (section) =>
                      section !== "personal-info" &&
                      section !== "profile" &&
                      section !== "education" &&
                      section !== "experience" &&
                      section !== "volunteer-work"
                  )
                  .map((section) => renderSection(section))}
              </div>
            </>
          ) : (
            <>
              <div className="absolute top-0 left-0 w-full h-full cv-sidebar"></div>
              <div className="relative z-10 py-[40px]">
                {sections
                  .filter(
                    (section) =>
                      section !== "profile" &&
                      section !== "education" &&
                      section !== "experience" &&
                      section !== "volunteer-work"
                  )
                  .map((section) => renderSection(section))}
              </div>
            </>
          )}
        </div>

        {/* Main content */}
        <div className={`w-2/3 p-8 ${isFirstPage ? "pt-0" : "pt-[40px]"}`}>
          {sections
            .filter(
              (section) =>
                section === "profile" ||
                section === "education" ||
                section === "experience" ||
                section === "volunteer-work"
            )
            .map((section) => renderSection(section))}
        </div>
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
      className="py-[40px]"
    >
      {/* Page 1 */}
      {renderPage(page1Sections, true)}

      {/* Page 2 (if needed) */}
      {hasPage2 && !showFirstPageOnly && (
        <div className="mt-8 print:mt-0">
          {renderPage(page2Sections, false)}
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
        @media print {
          .cv-page + .cv-page {
            page-break-before: always;
          }
        }
        .cv-sidebar {
          background-color: var(--accent-color);
          opacity: 0.2;
        }
        .shape-fill {
          fill: var(--accent-color);
          opacity: 0.2;
        }
        .cv-accent-bg {
          background-color: var(--accent-color) !important;
        }
      `}</style>
    </div>
  );
}