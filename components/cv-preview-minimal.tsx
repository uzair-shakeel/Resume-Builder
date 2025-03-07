import type { CVData } from "@/types";
import Image from "next/image";

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

interface CVPreviewMinimalProps {
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

export default function CVPreviewMinimal({
  data,
  sectionOrder,
  pageBreakSettings,
  template = "modern",
  accentColor = "#2a6496",
  fontFamily = "inter",
}: CVPreviewMinimalProps) {
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

  // Helper function to get placeholder or actual value
  const getPlaceholderOrValue = (
    section: string,
    field: string,
    value?: string
  ) => {
    if (value) return value;
    return `[Your ${field}]`;
  };

  // Placeholder data for preview
  const placeholderData = {
    education: [
      {
        school: "EFAP, Montpellier",
        degree: "Responsable de la communication",
        startDate: "Sep 2006",
        endDate: "Jan 2009",
        current: false,
        description:
          "Obtention du diplôme de responsable de la communication Images et médias en juin 2009.",
      },
      {
        school: "CPEA, Montpellier",
        degree: "BTS Management des Unités Commerciales",
        startDate: "Sep 2004",
        endDate: "Jun 2006",
        current: false,
        description:
          "Obtention du diplôme de management des unités commerciales en juin 2006.",
      },
    ],
    experience: [
      {
        position: "Chargée de clientèle",
        company: "Nanelle",
        location: "Marseille",
        startDate: "Feb 2013",
        endDate: "May 2020",
        current: false,
        description:
          "• Gestion du portefeuille clients B2B France et international\n• Développement de la notoriété de la marque : réseaux sociaux, partenariat, concours\n• Mise en place et développement de partenariats institutionnels et co-brandings\n• Mise à jour des outils analytiques afin de mesurer la performance du service client",
      },
      {
        position: "Assistante commerciale",
        company: "Nanelle",
        location: "Marseille",
        startDate: "Apr 2011",
        endDate: "Jun 2013",
        current: false,
        description:
          "• Gestion du portefeuille clients B2B France\n• Suivi et participation aux salons professionnels comme Maison et Objet\n• Prospection et création d'un portefeuille clients B2B à l'international",
      },
      {
        position: "Attachée de presse",
        company: "Agence Hopscotch",
        location: "Montpellier",
        startDate: "Sep 2009",
        endDate: "Mar 2011",
        current: false,
        description:
          "• Elaboration des stratégies de communication des marques\n• Communication de crise\n• Relations avec les médias",
      },
    ],
    skills: [
      { name: "Communication", level: 90 },
      { name: "Gestion de clientèle", level: 85 },
      { name: "Marketing", level: 80 },
    ],
    languages: [
      { name: "Français", level: "Langue maternelle" },
      { name: "Anglais", level: "Courant" },
      { name: "Espagnol", level: "Intermédiaire" },
    ],
    interests: [
      { name: "Voyages" },
      { name: "Photographie" },
      { name: "Cuisine" },
    ],
  };

  const renderPersonalDetails = () => {
    return (
      <div className="personal-details">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2">
          Personal details
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Name</h4>
            <p>
              {personalInfo?.firstName || "Josephine"}{" "}
              {personalInfo?.lastName || "Fournier"}
            </p>
          </div>

          <div>
            <h4 className="font-medium">Email address</h4>
            <p>{personalInfo?.email || "j.fournier@mail.com"}</p>
          </div>

          <div>
            <h4 className="font-medium">Phone number</h4>
            <p>{personalInfo?.phone || "0610012035"}</p>
          </div>

          <div>
            <h4 className="font-medium">Address</h4>
            <p>{personalInfo?.address || "78, Rue de Bois Sacré"}</p>
            <p>
              {personalInfo?.postalCode || "13007"}{" "}
              {personalInfo?.city || "Marseille"}
            </p>
          </div>

          {personalInfo?.linkedin && (
            <div>
              <h4 className="font-medium">LinkedIn</h4>
              <p>{personalInfo.linkedin}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-3"
          style={{ color: accentColor }}
        >
          Profile
        </h3>
        <div className="border-t border-gray-200 pt-3">
          <p className="text-gray-700">
            {profile || placeholderData.experience[0].description}
          </p>
        </div>
      </div>
    );
  };

  const renderExperience = () => {
    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-3"
          style={{ color: accentColor }}
        >
          Employment
        </h3>
        <div className="border-t border-gray-200 pt-3 space-y-6">
          {(experience?.length ? experience : placeholderData.experience).map(
            (exp, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {exp.position}
                    </h4>
                    <p className="text-gray-600">
                      {exp.company}, {exp.location}
                    </p>
                  </div>
                  <div className="text-right" style={{ color: accentColor }}>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </div>
                </div>
                {exp.description && (
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {exp.description.split("\n").map((item, i) => (
                      <li key={i} className="text-gray-700">
                        {item.startsWith("•") ? item.substring(1).trim() : item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-3"
          style={{ color: accentColor }}
        >
          Education
        </h3>
        <div className="border-t border-gray-200 pt-3 space-y-6">
          {(education?.length ? education : placeholderData.education).map(
            (edu, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {edu.degree}
                    </h4>
                    <p className="text-gray-600">{edu.school}</p>
                  </div>
                  <div className="text-right" style={{ color: accentColor }}>
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </div>
                </div>
                {edu.description && (
                  <p className="mt-2 text-gray-700">{edu.description}</p>
                )}
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-3"
          style={{ color: accentColor }}
        >
          Skills
        </h3>
        <div className="border-t border-gray-200 pt-3">
          <div className="space-y-2">
            {(skills?.length ? skills : placeholderData.skills).map(
              (skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5">
                    <div
                      className="h-1.5"
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
      </div>
    );
  };

  const renderLanguages = () => {
    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-3"
          style={{ color: accentColor }}
        >
          Languages
        </h3>
        <div className="border-t border-gray-200 pt-3">
          <div className="space-y-2">
            {(languages?.length ? languages : placeholderData.languages).map(
              (lang, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-700">{lang.name}</span>
                  <span className="text-gray-500">{lang.level}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderInterests = () => {
    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-3"
          style={{ color: accentColor }}
        >
          Interests
        </h3>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex flex-wrap gap-2">
            {(interests?.length ? interests : placeholderData.interests).map(
              (interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm rounded-full text-gray-700 bg-gray-100"
                >
                  {interest.name}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`cv-page font-${fontFamily} bg-white`}>
      {/* Header bar */}
      <div
        className="w-full h-12"
        style={{ backgroundColor: accentColor }}
      ></div>

      {/* Main name header */}
      <div className="px-12 py-8">
        <h1 className="text-3xl font-bold" style={{ color: accentColor }}>
          {personalInfo?.firstName || "Josephine"}{" "}
          {personalInfo?.lastName || "Fournier"}
        </h1>
      </div>

      {/* Main content */}
      <div className="px-12 pb-12 flex">
        {/* Left column - Personal details */}
        <div className="w-1/3 pr-8">
          {personalInfo?.photo && (
            <div className="mb-6">
              <Image
                src={personalInfo.photo || "/placeholder.svg"}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                width={240}
                height={240}
                className="object-cover w-full h-auto"
              />
            </div>
          )}
          {renderPersonalDetails()}
        </div>

        {/* Right column - Main content */}
        <div className="w-2/3">
          {renderProfile()}
          {renderExperience()}
          {renderEducation()}
          {sectionOrder.includes("skills") && renderSkills()}
          {sectionOrder.includes("languages") && renderLanguages()}
          {sectionOrder.includes("interests") && renderInterests()}
        </div>
      </div>

      {/* Footer bar */}
      <div
        className="w-full h-12"
        style={{ backgroundColor: accentColor }}
      ></div>
    </div>
  );
}
