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
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
  template?: string;
  accentColor?: string;
  fontFamily?: string;
}

export default function CVPreviewStudent({
  data,
  sectionOrder,
  pageBreakSettings,
  template = "modern",
  accentColor = "#a5d8ff",
  fontFamily = "inter",
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
        return null;
    }
  };

  const renderHeader = () => {
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

    return (
      <div className="header mb-8">
        <h1 className="text-5xl font-bold tracking-[0.2em] text-center mb-4">
          {firstName.toUpperCase()} {lastName.toUpperCase()}
        </h1>
        <div className="relative py-4">
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute top-0 left-0 right-0 h-[1px] "
          ></div>
          <h2 className="text-2xl text-center uppercase tracking-widest">
            {title}
          </h2>
          <div
            style={{ backgroundColor: accentColor }}
            className="absolute bottom-0 left-0 right-0 h-[1px] "
          ></div>
        </div>
      </div>
    );
  };

  const renderPersonalInfo = () => {
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
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">Contact</h3>
        <div className="space-y-3 text-base">
          <div className="flex items-center gap-3">
            <span className="inline-block">
              <Phone size={18} />
            </span>
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block">
              <Mail size={18} />
            </span>
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block">
              <HomeIcon size={18} />
            </span>
            <div>
              <p>{address},</p>
              <p>
                {city}, {postalCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return data.profile ? (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">Summary</h3>
        <p className="text-base">
          {getPlaceholderOrValue("profile", "profile", data.profile)}
        </p>
      </div>
    ) : null;
  };

  const renderEducation = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">Education</h3>
        <div className="space-y-2">
          {(data.education?.length
            ? data.education
            : placeholderData.education
          ).map((edu: Education, index: number) => (
            <div key={index} className="text-base">
              <p className="font-bold uppercase">
                {edu.school}, {edu.location || ""}
              </p>
              <p>
                {edu.startDate} - {edu.current ? "Present" : edu.endDate} | GPA:
                3.75
              </p>
            </div>
          ))}
        </div>
        <div
          style={{ backgroundColor: accentColor }}
          className="mt-6 h-[1px] "
        ></div>
      </div>
    );
  };

  const renderExperience = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">Experience</h3>
        <div className="space-y-6">
          {(data.experience?.length
            ? data.experience
            : placeholderData.experience
          ).map((exp: Experience, index: number) => (
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
          style={{ backgroundColor: accentColor }}
          className="mt-6 h-[1px] "
        ></div>
      </div>
    );
  };

  const renderSkills = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">Skills</h3>
        <div className="space-y-2">
          {(data.skills?.length ? data.skills : placeholderData.skills).map(
            (skill: Skill, index: number) => (
              <div key={index} className="text-base">
                <div className="flex justify-between mb-1">
                  <span>{skill.name}</span>
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
        <h3 className="text-xl font-bold mb-4 uppercase">Languages</h3>
        <div className="space-y-2">
          {(data.languages?.length
            ? data.languages
            : placeholderData.languages
          ).map((lang: Language, index: number) => (
            <div key={index} className="flex justify-between text-base">
              <span>{lang.name}</span>
              <span>{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null;
  };

  const renderInterests = () => {
    return data.interests?.length || placeholderData.interests ? (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">Interests</h3>
        <div className="space-y-1">
          {(data.interests?.length
            ? data.interests
            : placeholderData.interests
          ).map((interest: Interest, index: number) => (
            <p key={index} className="flex items-start text-base">
              <span className="mr-2">•</span>
              <span>{interest.name}</span>
            </p>
          ))}
        </div>
      </div>
    ) : null;
  };

  const renderAchievements = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 uppercase">Achievements</h3>
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
        <h3 className="text-xl font-bold mb-4 uppercase">Technical Skills</h3>
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
        <h3 className="text-xl font-bold mb-4 uppercase">Activities</h3>
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
        <h3 className="text-xl font-bold mb-4 uppercase">Key Skills</h3>
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
        <h3 className="text-xl font-bold mb-4 uppercase">Volunteer Work</h3>
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

  return (
    <div className="cv-page max-w-[1000px] mx-auto font-sans bg-white">
      <div className="p-8 pb-0">{renderHeader()}</div>
      <div className="cv-page-content flex relative">
        {/* Left sidebar with curved bottom */}
        <div className="w-1/3 p-8 pt-0 relative">
          {renderPersonalInfo()}
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
          <div className="relative z-10 mt-[100px]">
            {renderAchievements()}
            {renderTechnicalSkills()}
            {renderActivities()}
            {renderKeySkills()}
          </div>
        </div>

        {/* Main content */}
        <div className="w-2/3 p-8 pt-0">
          {renderProfile()}
          {renderEducation()}
          {renderExperience()}
          {renderVolunteerWork()}
        </div>
      </div>
    </div>
  );
}
