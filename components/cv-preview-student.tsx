import type { CVData } from "@/types";
import Image from "next/image";
import { Phone, Mail, Home } from "lucide-react";
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

interface CVPreviewStudentProps {
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

export default function CVPreviewStudent({
  data,
  sectionOrder,
  accentColor = "#4dabf7",
  fontFamily = "Arial, sans-serif",
  pageBreakSettings,
}: CVPreviewStudentProps) {
  const breakSettings = pageBreakSettings || {
    keepHeadingsWithContent: true,
    avoidOrphanedHeadings: true,
    minLinesBeforeBreak: 3,
  };

  const renderHeader = () => {
    const { personalInfo } = data;
    return (
      <div className="mb-6">
        {/* Blue curved line at the top */}
        <div className="relative w-full h-4 mb-4">
          <div
            className="absolute top-0 left-0 w-full h-full rounded-b-full"
            style={{ backgroundColor: accentColor }}
          ></div>
        </div>

        <h1 className="text-3xl font-bold tracking-widest text-center mb-2">
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
        <p className="text-center text-lg uppercase tracking-wider mb-4">
          {getPlaceholderOrValue("personalInfo", "title", personalInfo?.title)}
        </p>
        <div className="w-full border-t border-b border-gray-200 my-2"></div>
      </div>
    );
  };

  const renderContact = () => {
    const { personalInfo } = data;
    return (
      <div className="mb-6">
        <h2 className="font-bold text-lg uppercase mb-3">CONTACT</h2>
        <div className="space-y-2">
          <div className="flex items-start">
            <Phone size={16} className="mr-2 mt-1" />
            <p>
              {getPlaceholderOrValue(
                "personalInfo",
                "phone",
                personalInfo?.phone
              )}
            </p>
          </div>
          <div className="flex items-start">
            <Mail size={16} className="mr-2 mt-1" />
            <p>
              {getPlaceholderOrValue(
                "personalInfo",
                "email",
                personalInfo?.email
              )}
            </p>
          </div>
          <div className="flex items-start">
            <Home size={16} className="mr-2 mt-1" />
            <p>
              {getPlaceholderOrValue(
                "personalInfo",
                "address",
                personalInfo?.address
              )}
              ,<br />
              {getPlaceholderOrValue(
                "personalInfo",
                "city",
                personalInfo?.city
              )}
              ,<br />
              {getPlaceholderOrValue(
                "personalInfo",
                "postalCode",
                personalInfo?.postalCode
              )}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    return (
      <div className="mb-6">
        <h2 className="font-bold text-lg uppercase mb-3">SUMMARY</h2>
        <p className="text-sm">
          {getPlaceholderOrValue("profile", "profile", data.profile)}
        </p>
      </div>
    );
  };

  const renderEducation = () => {
    return (
      <div className="mb-6">
        <h2 className="font-bold text-lg uppercase mb-3">EDUCATION</h2>
        <div className="space-y-3">
          {(data.education?.length
            ? data.education
            : placeholderData.education
          ).map((edu: Education, index: number) => (
            <div key={index} className="text-sm">
              <div className="font-bold uppercase">{edu.school}</div>
              <div>{edu.degree}</div>
              <div className="text-sm">
                {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                {edu.description && <span> | GPA: {edu.description}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    return (
      <div className="mb-6">
        <h2 className="font-bold text-lg uppercase mb-3">EXPERIENCE</h2>
        <div className="space-y-4">
          {(data.experience?.length
            ? data.experience
            : placeholderData.experience
          ).map((exp: Experience, index: number) => (
            <div key={index} className="text-sm">
              <div className="font-bold uppercase">{exp.position}</div>
              <div>
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </div>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                {exp.description?.split("\n").map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    return (
      <div className="mb-6">
        <h2 className="font-bold text-lg uppercase mb-3">TECHNICAL SKILLS</h2>
        <ul className="list-disc ml-5 space-y-1">
          {(data.skills?.length ? data.skills : placeholderData.skills).map(
            (skill: Skill, index: number) => (
              <li key={index} className="text-sm">
                {skill.name}
              </li>
            )
          )}
        </ul>
      </div>
    );
  };

  const renderActivities = () => {
    return (
      <div className="mb-6">
        <h2 className="font-bold text-lg uppercase mb-3">ACTIVITIES</h2>
        <div className="space-y-2">
          {(data.interests?.length
            ? data.interests
            : placeholderData.interests
          ).map((interest: Interest, index: number) => (
            <div key={index} className="text-sm uppercase font-bold">
              {interest.name}
              <div className="font-normal text-sm">2021 - Present</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderKeySkills = () => {
    return (
      <div className="mb-6">
        <h2 className="font-bold text-lg uppercase mb-3">KEY SKILLS</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li className="text-sm">Friendly</li>
          <li className="text-sm">Good listener</li>
          <li className="text-sm">Courteous</li>
          <li className="text-sm">Helpful</li>
          <li className="text-sm">Guest services</li>
          <li className="text-sm">Interpersonal</li>
          <li className="text-sm">Positive attitude</li>
          <li className="text-sm">Customer service</li>
        </ul>
      </div>
    );
  };

  const renderLanguages = () => {
    return (
      <div className="mb-6">
        <h2 className="font-bold text-lg uppercase mb-3">LANGUAGES</h2>
        <ul className="space-y-1">
          {(data.languages?.length
            ? data.languages
            : placeholderData.languages
          ).map((lang: Language, index: number) => (
            <li key={index} className="text-sm">
              {lang.name} - {lang.level}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderVolunteerWork = () => {
    return (
      <div className="mb-6">
        <h2 className="font-bold text-lg uppercase mb-3">VOLUNTEER WORK</h2>
        <div className="space-y-3">
          <div>
            <div className="text-sm uppercase font-bold">
              SUSPENDISSE UT JUSTO COACH
            </div>
            <div className="text-sm">2021 - Present</div>
          </div>
          <div>
            <div className="text-sm uppercase font-bold">
              IN PHARETRA ARCU PROGRAM
            </div>
            <div className="text-sm">2022 - Present</div>
          </div>
        </div>
      </div>
    );
  };

  const renderChildCare = () => {
    return (
      <div className="mb-6">
        <h2 className="font-bold text-lg uppercase mb-3">CHILD CARE</h2>
        <div className="text-sm uppercase font-bold">CHILD CARE</div>
        <div className="text-sm">2021 - Present</div>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li className="text-sm">
            Morbi placerat odio vitae varius ornare. Donec non tempor lacus.
          </li>
          <li className="text-sm">
            Maecenas vestibulum, elit non interdum tempor, felis orci efficitur
            ante, ut laoreet eros diam at libero.
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div
      className="cv-page bg-white p-8 shadow-lg mx-auto"
      style={{ fontFamily }}
    >
      {renderHeader()}

      <div className="grid grid-cols-3 gap-6">
        {/* Left column - 1/3 width */}
        <div className="col-span-1">
          {renderContact()}
          {renderSkills()}
          {renderActivities()}
          {renderKeySkills()}
        </div>

        {/* Right column - 2/3 width */}
        <div className="col-span-2">
          {renderSummary()}
          {renderEducation()}
          {renderExperience()}
          {renderChildCare()}
          {renderVolunteerWork()}
        </div>
      </div>
    </div>
  );
}
