import React from "react";
import type { CVData } from "@/types";
import Image from "next/image";

interface CVPreviewTealProps {
  data: CVData;
  sectionOrder: string[];
}

export default function CVPreviewTeal({
  data,
  sectionOrder,
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

  const accentColor = "#2BCBBA"; // Teal accent color

  return (
    <div className="w-[210mm] h-[297mm] bg-white shadow-lg">
      {/* Header with name and photo */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-medium text-[#2BCBBA]">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#2BCBBA]">
            <Image
              src={personalInfo.photo || "/placeholder-user.jpg"}
              alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Contact information */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center">
            <span className="text-[#2BCBBA] mr-2">✉</span>
            <span>{personalInfo.email}</span>
          </div>
          <div className="flex items-center">
            <span className="text-[#2BCBBA] mr-2">📱</span>
            <span>{personalInfo.phone}</span>
          </div>
          <div className="flex items-center">
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
        <div className="mb-6 text-sm text-gray-700">
          <p>
            {profile ||
              "Infirmière expérimentée travaillant depuis 15 ans en gériatrie. J'apprécie autant le contact avec les patients qu'avec les collègues constituant une équipe soudée au sein d'établissements de santé. Disponibilité pour une prise de poste : 1 mois."}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6">
        {/* Professional Experience */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-[#2BCBBA] border-b border-[#2BCBBA] pb-1 mb-4">
            Expérience professionnelle
          </h2>

          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="flex">
                <div className="w-32 text-sm text-gray-600 pr-4">
                  <p>
                    de {exp.startDate} à {exp.current ? "ce jour" : exp.endDate}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">{exp.position}</p>
                      <p className="text-[#2BCBBA] text-sm">
                        {exp.company}, {exp.location}
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                        {exp.description
                          .split("\n")
                          .map(
                            (item, i) => item.trim() && <li key={i}>{item}</li>
                          )}
                        <li>
                          Planification et exécution des soins sur prescription
                          médicales
                        </li>
                        <li>
                          Contribution à la continuité des soins infirmiers
                        </li>
                        <li>Surveillance des patients chroniques</li>
                        <li>Accompagnement et aide à la mobilité</li>
                        <li>Prévention des escarres</li>
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
                  <div className="w-32 text-sm text-gray-600 pr-4">
                    <p>de nov. 2015 à ce jour</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Infirmière</p>
                        <p className="text-[#2BCBBA] text-sm">
                          Maison de retraite des Bleuets, Caen
                        </p>
                        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                          <li>
                            Planification et exécution des soins sur
                            prescription médicales
                          </li>
                          <li>
                            Contribution à la continuité des soins infirmiers
                          </li>
                          <li>Surveillance des patients chroniques</li>
                          <li>Accompagnement et aide à la mobilité</li>
                          <li>Prévention des escarres</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-32 text-sm text-gray-600 pr-4">
                    <p>de oct. 2010 à nov. 2015</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Infirmière</p>
                        <p className="text-[#2BCBBA] text-sm">
                          EHPAD Saint Michel, Caen
                        </p>
                        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                          <li>
                            Gestion du bien-être, du confort et du l'hygiène de
                            chaque résident en tenant compte de son niveau de
                            dépendance
                          </li>
                          <li>
                            Préparation et application des prescriptions
                            médicales établies par les médecins traitants ou le
                            médecin coordonnateur
                          </li>
                          <li>
                            Évaluation des besoins fondamentaux des résidents et
                            mise en place d'une réponse adaptée à l'état de la
                            personne
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-32 text-sm text-gray-600 pr-4">
                    <p>de sept. 2005 à sept. 2010</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Infirmière</p>
                        <p className="text-[#2BCBBA] text-sm">
                          Soins à dom', Caen
                        </p>
                        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                          <li>
                            Réalisation de missions régulières au domicile des
                            patients, pour des soins ponctuels ou réguliers
                          </li>
                          <li>
                            Évaluation des changements de l'état de santé des
                            patients ainsi que de leur médication
                          </li>
                          <li>
                            Prises de sang et administration de traitement pour
                            envoi des prélèvements
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
        <div className="mb-6">
          <h2 className="text-lg font-medium text-[#2BCBBA] border-b border-[#2BCBBA] pb-1 mb-4">
            Formation
          </h2>

          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex">
                <div className="w-32 text-sm text-gray-600 pr-4">
                  <p>
                    de {edu.startDate} à {edu.current ? "ce jour" : edu.endDate}
                  </p>
                </div>
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-[#2BCBBA] text-sm">{edu.school}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Example entry if no education data */}
            {education.length === 0 && (
              <div className="flex">
                <div className="w-32 text-sm text-gray-600 pr-4">
                  <p>de sept. 2002 à août 2005</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-[#2BCBBA] mt-1.5 mr-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Diplôme d'état d'infirmier</p>
                      <p className="text-[#2BCBBA] text-sm">
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
        <div className="mb-6">
          <h2 className="text-lg font-medium text-[#2BCBBA] border-b border-[#2BCBBA] pb-1 mb-4">
            Langues
          </h2>

          <div className="space-y-2">
            {languages.map((language, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 bg-[#2BCBBA] mr-2 flex-shrink-0"></div>
                <span className="font-medium mr-2">{language.name}:</span>
                <span>{language.level}</span>
              </div>
            ))}

            {/* Example entry if no languages data */}
            {languages.length === 0 && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#2BCBBA] mr-2 flex-shrink-0"></div>
                <span className="font-medium mr-2">Anglais</span>
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
        <div className="mb-6">
          <h2 className="text-lg font-medium text-[#2BCBBA] border-b border-[#2BCBBA] pb-1 mb-4">
            Qualités
          </h2>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#2BCBBA] mr-2 flex-shrink-0"></div>
              <span>Rigueur</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#2BCBBA] mr-2 flex-shrink-0"></div>
              <span>Sens de l'écoute</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#2BCBBA] mr-2 flex-shrink-0"></div>
              <span>Bon relationnel</span>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-[#2BCBBA] border-b border-[#2BCBBA] pb-1 mb-4">
            Centres d'intérêt
          </h2>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {interests.map((interest, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 bg-[#2BCBBA] mr-2 flex-shrink-0"></div>
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

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs mt-12">© CV+</div>
      </div>
    </div>
  );
}
