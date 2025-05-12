import type { CVData } from "@/types";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { placeholderData, getPlaceholderOrValue } from "@/lib/utils";

interface CVPreviewProps {
  data: CVData;
  sectionOrder: string[];
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
  accentColor: string;
}

export default function CVPreviewPro({
  data,
  sectionOrder,
  accentColor,
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
    <div
      style={{ backgroundColor: accentColor }}
      className=" text-white p-6 flex items-center gap-6"
    >
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
                  className="h-full rounded-full"
                  style={{
                    width: `${(skill.level / 5) * 100}%`,
                    backgroundColor: accentColor,
                  }}
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
              <div
                style={{ backgroundColor: accentColor }}
                className="w-1.5 h-1.5  rounded-full"
              />
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
        <h2
          style={{ color: accentColor }}
          className="text-xl font-medium mb-4 uppercase tracking-wider"
        >
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
        <h2
          style={{ color: accentColor }}
          className="text-xl  font-medium mb-4 uppercase tracking-wider"
        >
          {getSectionTitle("education")}
        </h2>
        {educationItems.map((edu, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{edu.school}</p>
                <p className="text-gray-600">{edu.degree}</p>
              </div>
              <p style={{ color: accentColor }} className="text-sm font-medium">
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
        <h2
          style={{ color: accentColor }}
          className="text-xl  font-medium mb-4 uppercase tracking-wider"
        >
          {getSectionTitle("experience")}
        </h2>
        {experienceItems.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{exp.position}</p>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <p style={{ color: accentColor }} className="text-sm font-medium">
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
        if (section.startsWith("custom-") && data[section]) {
          return (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">
                {getSectionTitle(section)}
              </h2>
              <div className="space-y-4">
                {(data[section] as any[]).map((item, index) => (
                  <div key={index}>
                    {item.title && (
                      <p className="font-medium text-sm">{item.title}</p>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">
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

  const renderPage = (sections: string[]) => (
    <div
      className="cv-page bg-white"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm",
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      {renderHeader()}
      <div className="flex" style={{ marginTop: "2rem" }}>
        <div
          style={{
            width: "240px",
            backgroundColor: "#111827",
            padding: "1.5rem",
          }}
          className="text-white"
        >
          {sections.includes("skills") && renderSkills()}
          {sections.includes("languages") && renderLanguages()}
          {sections.includes("interests") && renderInterests()}
        </div>
        <div className="pt-[2rem] pl-[2rem]">
          {sections.map((section) => {
            // Don't render sidebar sections in main content
            if (!["skills", "languages", "interests"].includes(section)) {
              return renderSection(section);
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="cv-container">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      {renderPage(page1Sections)}

      {hasPage2 && (
        <div className="mt-8 print:mt-0">{renderPage(page2Sections)}</div>
      )}
    </div>
  );
}
