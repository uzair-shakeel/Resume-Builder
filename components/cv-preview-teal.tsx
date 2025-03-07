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
}

export default function CVPreviewTeal({
  data,
  sectionOrder,
  accentColor = "#2BCBBA",
  fontFamily = "Arial, sans-serif",
  pageBreakSettings,
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

  return (
    <div className="cv-page bg-white">
      <div className="cv-page-content  mx-auto ">
        <div className="bg-gray-100 p-4">
          {/* Header with name and photo */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-medium text-[#2BCBBA]">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2BCBBA]">
              <Image
                src={personalInfo.photo || "/placeholder-user.jpg"}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Contact information */}
          <div className="flex flex-wrap gap-y-2 mb-6">
            <div className="flex items-center mr-6">
              <span className="text-[#2BCBBA] mr-2">✉</span>
              <span>{personalInfo.email}</span>
            </div>
            <div className="flex items-center mr-6">
              <span className="text-[#2BCBBA] mr-2">📱</span>
              <span>{personalInfo.phone}</span>
            </div>
            <div className="flex items-center mr-6">
              <span className="text-[#2BCBBA] mr-2">📍</span>
              <span>
                {personalInfo.address}, {personalInfo.postalCode}{" "}
                {personalInfo.city}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-[#2BCBBA] mr-2">🚗</span>
              <span>Véhicule personnel</span>
            </div>
          </div>

          {/* Profile summary */}
          <div className="mb-8 text-sm">
            <p>
              {profile ||
                "Infirmière expérimentée travaillant depuis 15 ans en gériatrie. J'apprécie autant le contact avec les patients qu'avec les collègues constituant une équipe pluridisciplinaire dans les établissements de santé. Disponibilité pour une prise de poste : 1 mois."}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="p-8">
          {/* Professional Experience */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[#2BCBBA] border-b border-[#2BCBBA] pb-1 mb-6">
              Expérience professionnelle
            </h2>

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="flex">
                  <div className="w-40 text-sm pr-4 flex-shrink-0">
                    <p>
                      de {exp.startDate} à{" "}
                      {exp.current ? "ce jour" : exp.endDate}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-3 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">{exp.position}</p>
                        <p className="text-[#2BCBBA]">
                          {exp.company}, {exp.location}
                        </p>
                        <ul className="list-disc pl-5 mt-3 text-sm space-y-2">
                          {exp.description
                            ?.split("\n")
                            .map(
                              (item, i) =>
                                item.trim() && <li key={i}>{item}</li>
                            )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Example entries if no experience data */}
              {experience.length === 0 && (
                <>
                  <div className="flex">
                    <div className="w-36 text-sm pr-4">
                      <p>de nov. 2015 à ce jour</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium">Infirmière</p>
                          <p className="text-[#2BCBBA]">
                            Maison de retraite des Bleuets, Caen
                          </p>
                          <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                            <li>
                              Planification et exécution des soins sur
                              prescription médicales
                            </li>
                            <li>
                              Participation à la continuité des soins infirmiers
                            </li>
                            <li>Surveillance des paramètres cliniques</li>
                            <li>Accompagnement et aide à la mobilité</li>
                            <li>Réfection des pansements</li>
                            <li>Prévention des escarres</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-36 text-sm pr-4">
                      <p>de oct. 2010 à nov. 2015</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium">Infirmière</p>
                          <p className="text-[#2BCBBA]">
                            EHPAD Saint Michel, Caen
                          </p>
                          <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                            <li>
                              Gestion du bien-être, du confort et de l'hygiène
                              de chaque résident en tenant compte de son niveau
                              de dépendance
                            </li>
                            <li>
                              Préparation et application des prescriptions
                              médicales établies par les médecins traitants ou
                              le médecin coordonnateur
                            </li>
                            <li>
                              Évaluation des besoins fondamentaux des résidents
                              et mise en place d'une réponse adaptée à l'état de
                              la personne
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-36 text-sm pr-4">
                      <p>de sept. 2005 à sept. 2010</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium">Infirmière</p>
                          <p className="text-[#2BCBBA]">Soins à dom', Caen</p>
                          <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                            <li>
                              Dans le cadre de missions réalisées au domicile
                              des patients, pour des soins ponctuels ou
                              réguliers :
                            </li>
                            <li>
                              Évaluation des changements de l'état de santé des
                              patients ainsi que de leur médication
                            </li>
                            <li>
                              Mesure des paramètres vitaux et de leur
                              température corporelle
                            </li>
                            <li>
                              Prises de sang et administration du traitement
                              puis envoi des prélèvements
                            </li>
                            <li>
                              Documentation des informations et soins relatifs à
                              la visite selon le protocole
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[#2BCBBA] border-b border-[#2BCBBA] pb-1 mb-6">
              Formation
            </h2>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="flex">
                  <div className="w-40 text-sm pr-4 flex-shrink-0">
                    <p>
                      de {edu.startDate} à{" "}
                      {edu.current ? "ce jour" : edu.endDate}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-3 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-[#2BCBBA]">{edu.school}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Example entry if no education data */}
              {education.length === 0 && (
                <div className="flex">
                  <div className="w-36 text-sm pr-4">
                    <p>de sept. 2002 à août 2005</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">
                          Diplôme d'état d'infirmier
                        </p>
                        <p className="text-[#2BCBBA]">
                          Institut de formation en soins infirmiers, Caen
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[#2BCBBA] border-b border-[#2BCBBA] pb-1 mb-6">
              Langues
            </h2>

            <div className="space-y-4">
              {languages.map((language, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 bg-[#2BCBBA] mr-3 flex-shrink-0"></div>
                  <span className="font-medium w-28">{language.name}</span>
                  <div className="w-72 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-[#2BCBBA] rounded-full"
                      style={{
                        width:
                          language.level === "Courant"
                            ? "80%"
                            : language.level === "Intermédiaire"
                            ? "60%"
                            : language.level === "Débutant"
                            ? "30%"
                            : "60%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}

              {/* Example entry if no languages data */}
              {languages.length === 0 && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#2BCBBA] mr-2 flex-shrink-0"></div>
                  <span className="font-medium w-24">Anglais</span>
                  <div className="w-64 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-[#2BCBBA] rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Qualities */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[#2BCBBA] border-b border-[#2BCBBA] pb-1 mb-6">
              Qualités
            </h2>

            <div className="flex flex-wrap gap-x-12 gap-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#2BCBBA] mr-3 flex-shrink-0"></div>
                <span>Rigueur</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#2BCBBA] mr-3 flex-shrink-0"></div>
                <span>Sens de l'écoute</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#2BCBBA] mr-3 flex-shrink-0"></div>
                <span>Bon relationnel</span>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-[#2BCBBA] border-b border-[#2BCBBA] pb-1 mb-6">
              Centres d'intérêt
            </h2>

            <div className="flex flex-wrap gap-x-12 gap-y-4">
              {interests.map((interest, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 bg-[#2BCBBA] mr-3 flex-shrink-0"></div>
                  <span>{interest.name}</span>
                </div>
              ))}

              {/* Example entries if no interests data */}
              {interests.length === 0 && (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#2BCBBA] mr-2 flex-shrink-0"></div>
                    <span>Yoga</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#2BCBBA] mr-2 flex-shrink-0"></div>
                    <span>Natation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#2BCBBA] mr-2 flex-shrink-0"></div>
                    <span>Romans d'aventure</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
