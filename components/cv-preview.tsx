import type { CVData } from "@/types";
import Image from "next/image";
import { Mail, Phone, MapPin, Home } from "lucide-react";
import {
  getPlaceholderOrValue,
  getArrayPlaceholderOrValue,
  placeholderData,
} from "@/lib/utils";

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

interface CVPreviewProps {
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
}

export default function CVPreview({
  data,
  sectionOrder,
  pageBreakSettings,
  template = "modern",
  accentColor = "#2563eb",
  fontFamily = "inter",
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

  const renderPersonalInfo = () => {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
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
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          {getPlaceholderOrValue("personalInfo", "title", personalInfo?.title)}
        </p>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            {getPlaceholderOrValue(
              "personalInfo",
              "email",
              personalInfo?.email
            )}
          </p>
          <p>
            {getPlaceholderOrValue(
              "personalInfo",
              "phone",
              personalInfo?.phone
            )}
          </p>
          <p>
            {getPlaceholderOrValue(
              "personalInfo",
              "address",
              personalInfo?.address
            )}
          </p>
          <p>
            {getPlaceholderOrValue(
              "personalInfo",
              "postalCode",
              personalInfo?.postalCode
            )}{" "}
            {getPlaceholderOrValue("personalInfo", "city", personalInfo?.city)}
          </p>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return data.profile ? (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Profil</h3>
        <p className="text-sm text-gray-600">
          {getPlaceholderOrValue("profile", "profile", data.profile)}
              </p>
            </div>
    ) : null;
  };

  const renderEducation = () => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Formation</h3>
        <div className="space-y-4">
          {(data.education?.length
            ? data.education
            : placeholderData.education
          ).map((edu: Education, index: number) => (
            <div key={index} className="text-sm">
              <div className="flex justify-between mb-1">
              <div>
                  <p className="font-medium text-gray-900">{edu.school}</p>
                  <p className="text-gray-600">{edu.degree}</p>
              </div>
                <div className="text-gray-500">
                  {edu.startDate} - {edu.current ? "Présent" : edu.endDate}
          </div>
              </div>
              {edu.description && (
                <p className="text-gray-600 mt-1">{edu.description}</p>
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
        <h3 className="text-lg font-semibold mb-3 text-gray-900">
          Expérience professionnelle
        </h3>
        <div className="space-y-4">
          {(data.experience?.length
            ? data.experience
            : placeholderData.experience
          ).map((exp: Experience, index: number) => (
            <div key={index} className="text-sm">
              <div className="flex justify-between mb-1">
                <div>
                  <p className="font-medium text-gray-900">{exp.position}</p>
                  <p className="text-gray-600">
                    {exp.company}, {exp.location}
                  </p>
                </div>
                <div className="text-gray-500">
                  {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                </div>
              </div>
              {exp.description && (
                <p className="text-gray-600 mt-1 whitespace-pre-line">
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
        <h3 className="text-lg font-semibold mb-3 text-gray-900">
          Compétences
        </h3>
        <div className="space-y-2">
          {(data.skills?.length ? data.skills : placeholderData.skills).map(
            (skill: Skill, index: number) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{skill.name}</span>
                  <span className="text-gray-500">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: accentColor,
                    }}
                  />
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
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Langues</h3>
        <div className="space-y-2">
          {(data.languages?.length
            ? data.languages
            : placeholderData.languages
          ).map((lang: Language, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">{lang.name}</span>
              <span className="text-gray-500">{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  const renderInterests = () => {
    return data.interests?.length || placeholderData.interests ? (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">
          Centres d'intérêt
        </h3>
        <div className="flex flex-wrap gap-2">
          {(data.interests?.length
            ? data.interests
            : placeholderData.interests
          ).map((interest: Interest, index: number) => (
            <span
              key={index}
              className="px-3 py-1 text-sm rounded-full text-gray-700 bg-gray-100"
            >
              {interest.name}
            </span>
          ))}
        </div>
      </div>
    ) : null;
  };

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
