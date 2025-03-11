import type { CVData } from "@/types";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { placeholderData, getPlaceholderOrValue } from "@/lib/utils";

interface CVPreviewProps {
  data: CVData;
  sectionOrder: string[];
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
}

export default function CVPreviewPro({
  data,
  sectionOrder,
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
      default:
        return "";
    }
  };

  const renderHeader = () => (
    <div className="bg-teal-600 text-white p-6 flex items-center gap-6">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
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
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold">
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
        <p className="text-teal-100">
          {getPlaceholderOrValue("personalInfo", "title", personalInfo?.title)}
        </p>
        <div className="flex gap-4 mt-2 text-sm text-teal-50">
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {getPlaceholderOrValue(
              "personalInfo",
              "email",
              personalInfo?.email
            )}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {getPlaceholderOrValue(
              "personalInfo",
              "phone",
              personalInfo?.phone
            )}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {getPlaceholderOrValue("personalInfo", "city", personalInfo?.city)}
          </span>
        </div>
      </div>
    </div>
  );

  const renderSkills = () => {
    const skillItems = skills?.length ? skills : placeholderData.skills;
    return (
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">
          {getSectionTitle("skills")}
        </h2>
        <div className="space-y-3">
          {skillItems.map((skill, index) => (
            <div key={index}>
              <div className="text-sm mb-1">{skill.name}</div>
              <div className="h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{ width: `${(skill.level / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    const languageItems = languages?.length
      ? languages
      : placeholderData.languages;
    return (
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">
          {getSectionTitle("languages")}
        </h2>
        <div className="space-y-3">
          {languageItems.map((language, index) => (
            <div key={index}>
              <div className="text-sm mb-1">{language.name}</div>
              <div className="text-sm text-gray-400">{language.level}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInterests = () => {
    const interestItems = interests?.length
      ? interests
      : placeholderData.interests;
    return (
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">
          {getSectionTitle("interests")}
        </h2>
        <div className="space-y-2">
          {interestItems.map((interest, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              <span className="text-sm">{interest.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const profileText = profile || placeholderData.profile;
    if (!profileText) return null;
    return (
      <section className="mb-8">
        <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">
          {getSectionTitle("profile")}
        </h2>
        <p className="text-gray-600 leading-relaxed">{profileText}</p>
      </section>
    );
  };

  const renderEducation = () => {
    const educationItems = education?.length
      ? education
      : placeholderData.education;
    return (
      <section className="mb-8">
        <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">
          {getSectionTitle("education")}
        </h2>
        {educationItems.map((edu, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{edu.school}</p>
                <p className="text-gray-600">{edu.degree}</p>
              </div>
              <p className="text-sm text-teal-600 font-medium">
                {edu.startDate} - {edu.current ? "Present" : edu.endDate}
              </p>
            </div>
          </div>
        ))}
      </section>
    );
  };

  const renderExperience = () => {
    const experienceItems = experience?.length
      ? experience
      : placeholderData.experience;
    return (
      <section className="mb-8">
        <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">
          {getSectionTitle("experience")}
        </h2>
        {experienceItems.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{exp.position}</p>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <p className="text-sm text-teal-600 font-medium">
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </p>
            </div>
            {exp.description && (
              <p className="mt-2 text-gray-600 leading-relaxed">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </section>
    );
  };

  const renderSection = (section: string) => {
    switch (section) {
      case "personal-info":
        return null; // Personal info is in header
      case "profile":
        return renderProfile();
      case "education":
        return renderEducation();
      case "experience":
        return renderExperience();
      case "skills":
        return null; // Skills are in sidebar
      case "languages":
        return null; // Languages are in sidebar
      case "interests":
        return null; // Interests are in sidebar
      default:
        return null;
    }
  };

  const renderSidebar = (sections: string[]) => (
    <div className="w-[240px] bg-gray-900 text-white p-6 h-[800px]">
      {sections.includes("skills") && renderSkills()}
      {sections.includes("languages") && renderLanguages()}
      {sections.includes("interests") && renderInterests()}
    </div>
  );

  const renderMainContent = (sections: string[]) => (
    <div className="flex-1 p-8">
      {sections.map(
        (section) =>
          ["profile", "education", "experience"].includes(section) &&
          renderSection(section)
      )}
    </div>
  );

  const renderPage = (sections: string[]) => (
    <div className="cv-page">
      <div className="cv-page-content flex flex-col h-full">
        {renderHeader()}
        <div className="flex flex-1">
          {renderSidebar(sections)}
          {renderMainContent(sections)}
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
        .cv-sidebar {
          position: absolute;
          top: 0;
          left: 0;
          width: 240px;
          height: 100%;
          background-color: #111827; /* Tailwind's gray-900 */
          color: white;
          padding: 1.5rem;
          overflow-y: auto;
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
