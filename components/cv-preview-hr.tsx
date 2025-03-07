import React from "react";
import type { CVData } from "@/types";
import Image from "next/image";
import { placeholderData, getPlaceholderOrValue } from "@/lib/utils";

// Define the Education type locally if needed
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

interface CVPreviewHRProps {
  data: CVData;
  sectionOrder: string[];
  accentColor?: string;
  fontFamily?: string;
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
}

export default function CVPreviewHR({
  data,
  sectionOrder,
  accentColor = "#9b59b6",
  fontFamily = "Arial, sans-serif",
  pageBreakSettings,
}: CVPreviewHRProps) {
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

  const renderPersonalInfo = () => {
    return (
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">
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
        <p className="text-xl mb-3">
          {getPlaceholderOrValue("personalInfo", "title", personalInfo?.title)}
        </p>
        <div className="flex justify-center space-x-4 text-sm">
          <span>
            {getPlaceholderOrValue(
              "personalInfo",
              "email",
              personalInfo?.email
            )}
          </span>
          <span>|</span>
          <span>
            {getPlaceholderOrValue(
              "personalInfo",
              "phone",
              personalInfo?.phone
            )}
          </span>
          <span>|</span>
          <span>
            {getPlaceholderOrValue(
              "personalInfo",
              "address",
              personalInfo?.address
            )}
            ,{" "}
            {getPlaceholderOrValue(
              "personalInfo",
              "postalCode",
              personalInfo?.postalCode
            )}{" "}
            {getPlaceholderOrValue("personalInfo", "city", personalInfo?.city)}
          </span>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div
        className={`mb-6 ${
          breakSettings.keepHeadingsWithContent ? "keep-together" : ""
        }`}
      >
        <h2
          className="text-xl font-semibold mb-2 pb-1 border-b-2"
          style={{ borderColor: accentColor }}
        >
          PROFIL
        </h2>
        <p className="text-sm">
          {getPlaceholderOrValue("profile", "profile", data.profile)}
        </p>
      </div>
    );
  };

  const renderEducation = () => {
    return (
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-3 pb-1 border-b-2"
          style={{ borderColor: accentColor }}
        >
          FORMATION
        </h2>
        <div className="space-y-4">
          {(data.education?.length
            ? data.education
            : placeholderData.education
          ).map((edu: Education, index: number) => (
            <div
              key={index}
              className={`${
                index > 0 && breakSettings.minLinesBeforeBreak > 0 ? "mt-4" : ""
              }`}
            >
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{edu.degree}</h3>
                <span className="text-sm">
                  {edu.startDate} - {edu.current ? "Présent" : edu.endDate}
                </span>
              </div>
              <p className="text-sm mb-1">{edu.school}</p>
              {edu.description && (
                <p className="text-sm text-gray-600">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    return (
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-3 pb-1 border-b-2"
          style={{ borderColor: accentColor }}
        >
          EXPÉRIENCE PROFESSIONNELLE
        </h2>
        <div className="space-y-4">
          {(data.experience?.length
            ? data.experience
            : placeholderData.experience
          ).map((exp: Experience, index: number) => (
            <div
              key={index}
              className={`${
                index > 0 && breakSettings.minLinesBeforeBreak > 0 ? "mt-4" : ""
              }`}
            >
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{exp.position}</h3>
                <span className="text-sm">
                  {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                </span>
              </div>
              <p className="text-sm mb-1">
                {exp.company}, {exp.location}
              </p>
              {exp.description && (
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    return (
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-3 pb-1 border-b-2"
          style={{ borderColor: accentColor }}
        >
          COMPÉTENCES
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {(data.skills?.length ? data.skills : placeholderData.skills).map(
            (skill: Skill, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{skill.name}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className="w-3 h-3 rounded-full mx-0.5"
                      style={{
                        backgroundColor:
                          level <= skill.level ? accentColor : "#e2e8f0",
                      }}
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
    return (
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-3 pb-1 border-b-2"
          style={{ borderColor: accentColor }}
        >
          LANGUES
        </h2>
        <div className="space-y-2">
          {(data.languages?.length
            ? data.languages
            : placeholderData.languages
          ).map((lang: Language, index: number) => (
            <div key={index} className="flex justify-between">
              <span className="text-sm">{lang.name}</span>
              <span className="text-sm">{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInterests = () => {
    return (
      <div className="mb-6">
        <h2
          className="text-xl font-semibold mb-3 pb-1 border-b-2"
          style={{ borderColor: accentColor }}
        >
          CENTRES D'INTÉRÊT
        </h2>
        <div className="flex flex-wrap gap-2">
          {(data.interests?.length
            ? data.interests
            : placeholderData.interests
          ).map((interest: Interest, index: number) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full"
              style={{ backgroundColor: "#f3f4f6" }}
            >
              {interest.name}
            </span>
          ))}
        </div>
      </div>
    );
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
      default:
        return null;
    }
  };

  return (
    <div
      className="cv-page bg-white p-8 shadow-lg mx-auto"
      style={{ fontFamily }}
    >
      <div className="cv-content">
        {sectionOrder.map((section) => (
          <div key={section}>{renderSection(section)}</div>
        ))}
      </div>
    </div>
  );
}
