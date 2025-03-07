import type { CVData } from "@/types";
import Image from "next/image";
import { Mail, Phone, MapPin, Home } from "lucide-react";

interface CVPreviewProps {
  data: CVData;
  sectionOrder: string[];
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
}

export default function CVPreview({
  data,
  sectionOrder,
  pageBreakSettings,
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

  // Default page break settings if not provided
  const breakSettings = pageBreakSettings || {
    keepHeadingsWithContent: true,
    avoidOrphanedHeadings: true,
    minLinesBeforeBreak: 3,
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

  const renderPersonalInfo = () => (
    <div className="text-white space-y-6">
      <h2 className="text-xl font-medium mb-4 section-heading">
        Informations personnelles
      </h2>
      <div className="space-y-3 section-content">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 cv-accent-stroke" />
          <span className="text-sm">{personalInfo.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 cv-accent-stroke" />
          <span className="text-sm">{personalInfo.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5 cv-accent-stroke" />
          <span className="text-sm">{personalInfo.address}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 cv-accent-stroke" />
          <span className="text-sm">
            {personalInfo.postalCode} {personalInfo.city}
          </span>
        </div>
      </div>
    </div>
  );

  const renderProfile = () =>
    profile && (
      <div
        className={`mb-6 ${
          breakSettings.keepHeadingsWithContent ? "keep-together" : ""
        }`}
      >
        <h2 className="text-xl font-medium mb-4 cv-accent-color section-heading">
          Profil
        </h2>
        <p className="text-sm text-gray-700 section-content">{profile}</p>
      </div>
    );

  const renderEducation = () =>
    education.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4 cv-accent-color section-heading">
          Formation
        </h2>
        <div className="space-y-4 section-content">
          {education.map((edu, index) => (
            <div
              key={index}
              className={`text-sm ${
                index > 0 && index < education.length - 1 ? "keep-together" : ""
              }`}
            >
              <div className="flex justify-between">
                <div className="font-medium">{edu.degree}</div>
                <div className="cv-accent-color">
                  {edu.startDate} - {edu.endDate}
                </div>
              </div>
              <div className="text-gray-600">{edu.school}</div>
              <div className="text-gray-700 mt-1">{edu.description}</div>
            </div>
          ))}
        </div>
      </div>
    );

  const renderExperience = () =>
    experience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-4 cv-accent-color section-heading">
          Expérience professionnelle
        </h2>
        <div className="space-y-4 section-content">
          {experience.map((exp, index) => (
            <div
              key={index}
              className={`text-sm ${
                index > 0 && index < experience.length - 1
                  ? "keep-together"
                  : ""
              }`}
            >
              <div className="flex justify-between">
                <div className="font-medium">{exp.position}</div>
                <div className="cv-accent-color">
                  {exp.startDate} - {exp.endDate}
                </div>
              </div>
              <div className="text-gray-600">{exp.company}</div>
              <div className="text-gray-700 mt-1">{exp.description}</div>
            </div>
          ))}
        </div>
      </div>
    );

  const renderSkills = () =>
    skills.length > 0 && (
      <div
        className={`mb-6 ${
          breakSettings.keepHeadingsWithContent ? "keep-together" : ""
        }`}
      >
        <h2 className="text-xl font-medium mb-4 cv-accent-color section-heading">
          Compétences
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 section-content">
          {skills.map((skill, index) => (
            <div key={index} className="text-sm">
              <div className="flex justify-between mb-1">
                <span>{skill.name}</span>
                <span>{skill.level}/5</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 rounded-full cv-accent-bg"
                  style={{ width: `${(parseInt(skill.level) / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  const renderLanguages = () =>
    languages.length > 0 && (
      <div
        className={`mb-6 ${
          breakSettings.keepHeadingsWithContent ? "keep-together" : ""
        }`}
      >
        <h2 className="text-xl font-medium mb-4 cv-accent-color section-heading">
          Langues
        </h2>
        <div className="space-y-2 section-content">
          {languages.map((language, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{language.name}</span>
              <span className="cv-accent-color">{language.level}</span>
            </div>
          ))}
        </div>
      </div>
    );

  const renderInterests = () =>
    interests.length > 0 && (
      <div
        className={`mb-6 ${
          breakSettings.keepHeadingsWithContent ? "keep-together" : ""
        }`}
      >
        <h2 className="text-xl font-medium mb-4 cv-accent-color section-heading">
          Centres d'intérêt
        </h2>
        <ul className="list-disc list-inside text-sm space-y-1 section-content">
          {interests.map((interest, index) => (
            <li key={index} className="text-gray-700">
              <span className="cv-bullet">•</span>
              {interest}
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className="cv-page">
      <div className="cv-page-content flex">
        {/* Left sidebar */}
        <div className="w-1/3 cv-sidebar flex flex-col">
          <div className="mb-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white">
              <Image
                src={personalInfo.photo || "/placeholder-user.jpg"}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-xl font-bold text-white text-center">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-white text-opacity-90 text-center mt-1">
              {personalInfo.title}
            </p>
          </div>
          {renderPersonalInfo()}
        </div>

        {/* Main content */}
        <div className="w-2/3 cv-main-content">
          <div className="space-y-6">
            {sectionOrder
              .filter((section) => section !== "personal-info")
              .map((section) => (
                <div key={section}>{renderSection(section)}</div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
