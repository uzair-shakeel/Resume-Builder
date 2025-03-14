import type {
  CVData,
  CustomSectionItem,
  EducationItem,
  ExperienceItem,
  SkillItem,
  LanguageItem,
  InterestItem,
  PersonalInfoData,
} from "@/types";
import Image from "next/image";
import { placeholderData } from "@/lib/utils";

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

interface CVPreviewTealProps {
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

export default function CVPreviewTeal({
  data,
  sectionOrder,
  accentColor = "#2BCBBA",
  fontFamily = "Arial, sans-serif",
  pageBreakSettings,
  sectionPages = {},
  customSectionNames = {},
}: CVPreviewTealProps) {
  const {
    personalInfo,
    profile,
    education,
    experience,
    skills,
    languages,
    interests,
  } = data;

  // Add default page break settings
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
        return "Experience";
      case "skills":
        return "Skills";
      case "languages":
        return "Languages";
      case "interests":
        return "Interests";
      default:
        if (section.startsWith("custom-")) {
          return "Custom Section";
        }
        return "";
    }
  };

  // Helper function to render a section based on its type
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
          const sectionId = section.replace("custom-", "");
          return renderCustomSection(sectionId);
        }
        return null;
    }
  };

  // Render custom section
  const renderCustomSection = (sectionId: string) => {
    const customSection = data.customSections?.[sectionId];
    if (
      !customSection ||
      !customSection.items ||
      customSection.items.length === 0
    ) {
      return null;
    }

    return (
      <div className="mb-8">
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: accentColor }}
        >
          {getSectionTitle(`custom-${sectionId}`)}
        </h2>
        <div className="space-y-4">
          {customSection.items.map((item: CustomSectionItem, index: number) => (
            <div key={index} className="mb-4">
              <div className="font-semibold">{item.title}</div>
              {item.description && (
                <div className="text-sm mt-1">{item.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render profile section
  const renderProfile = () => {
    return data.profile || placeholderData.profile ? (
      <div className="py-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
          {getSectionTitle("profile")}
        </h3>
        <p className="text-gray-700">
          {data.profile || placeholderData.profile}
        </p>
      </div>
    ) : null;
  };

  // Render education section
  const renderEducation = () => {
    return data.education?.length || placeholderData.education?.length ? (
      <div className="pb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
          {getSectionTitle("education")}
        </h3>
        <div className="space-y-4">
          {(data.education?.length
            ? data.education
            : placeholderData.education
          ).map((edu: Education, index: number) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <div>
                  <p className="font-bold text-gray-800">{edu.degree}</p>
                  <p style={{ color: accentColor }}>{edu.school}</p>
                </div>
                <div className="text-gray-600">
                  {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                </div>
              </div>
              {edu.description && (
                <p className="text-gray-700 mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  // Render experience section
  const renderExperience = () => {
    return data.experience?.length || placeholderData.experience?.length ? (
      <div className="pb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
          {getSectionTitle("experience")}
        </h3>
        <div className="space-y-4">
          {(data.experience?.length
            ? data.experience
            : placeholderData.experience
          ).map((exp: ExperienceItem, index: number) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <div>
                  <p className="font-bold text-gray-800">{exp.position}</p>
                  <p style={{ color: accentColor }}>
                    {exp.company}, {exp.location}
                  </p>
                </div>
                <div className="text-gray-600">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </div>
              </div>
              {exp.description && (
                <div className="mt-2 text-gray-700">
                  <div className="whitespace-pre-line">
                    {exp.description.split("\n").map((item, i) => (
                      <div key={i} className="flex items-start">
                        <span className="mr-2">•</span>
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
    ) : null;
  };

  // Render skills section
  const renderSkills = () => {
    return data.skills?.length || placeholderData.skills?.length ? (
      <div className="pb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
          {getSectionTitle("skills")}
        </h3>
        <div className="space-y-3">
          {(data.skills?.length ? data.skills : placeholderData.skills).map(
            (skill: SkillItem, index: number) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{skill.name}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${skill.level * 20}%`,
                      backgroundColor: accentColor,
                    }}
                  ></div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    ) : null;
  };

  // Render languages section
  const renderLanguages = () => {
    return data.languages?.length || placeholderData.languages?.length ? (
      <div className="pb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
          {getSectionTitle("languages")}
        </h3>
        <div className="space-y-2">
          {(data.languages?.length
            ? data.languages
            : placeholderData.languages
          ).map((lang: LanguageItem, index: number) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-700">{lang.name}</span>
              <span className="text-gray-600">{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  // Render interests section
  const renderInterests = () => {
    return data.interests?.length || placeholderData.interests?.length ? (
      <div className="pb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
          {getSectionTitle("interests")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(data.interests?.length
            ? data.interests
            : placeholderData.interests
          ).map((interest: InterestItem, index: number) => (
            <span
              key={index}
              className="px-3 py-1 text-center rounded-full text-white"
              style={{ backgroundColor: accentColor }}
            >
              {interest.name}
            </span>
          ))}
        </div>
      </div>
    ) : null;
  };

  // Render header with personal info
  const renderHeader = () => {
    const firstName =
      personalInfo?.firstName || placeholderData.personalInfo.firstName;
    const lastName =
      personalInfo?.lastName || placeholderData.personalInfo.lastName;
    const email = personalInfo?.email || placeholderData.personalInfo.email;
    const phone = personalInfo?.phone || placeholderData.personalInfo.phone;
    const address =
      personalInfo?.address || placeholderData.personalInfo.address;
    const city = personalInfo?.city || placeholderData.personalInfo.city;
    const postalCode =
      personalInfo?.postalCode || placeholderData.personalInfo.postalCode;
    const photo = personalInfo?.photo || placeholderData.personalInfo.photo;
    const title = personalInfo?.title || placeholderData.personalInfo.title;

    return (
      <div className="bg-gray-100 p-4">
        {/* Header with name and photo */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-medium" style={{ color: accentColor }}>
              {firstName} {lastName}
            </h1>
            <div className="text-xl text-gray-600 mt-1">{title}</div>
          </div>
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-2"
            style={{ borderColor: accentColor }}
          >
            <Image
              src={photo || "/placeholder-user.jpg"}
              alt={`${firstName} ${lastName}`}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Contact information */}
        <div className="flex flex-wrap gap-y-2 mb-6">
          {email && (
            <div className="flex items-center mr-6">
              <span className="mr-2" style={{ color: accentColor }}>
                ✉
              </span>
              <span>{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center mr-6">
              <span className="mr-2" style={{ color: accentColor }}>
                ☏
              </span>
              <span>{phone}</span>
            </div>
          )}
          {address && (
            <div className="flex items-center">
              <span className="mr-2" style={{ color: accentColor }}>
                ⌂
              </span>
              <span>
                {address}
                {city && `, ${city}`}
                {postalCode && `, ${postalCode}`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`cv-preview-teal font-${fontFamily}`}>
      {/* Page 1 */}
      <div className="cv-page bg-white">
        <div className="cv-page-content mx-auto">
          {renderHeader()}
          <div className="p-4">
            {page1Sections.map((section) => (
              <div key={section}>{renderSection(section)}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div className="cv-page bg-white mt-8">
          <div className="cv-page-content mx-auto">
            {renderHeader()}
            <div className="p-4">
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
