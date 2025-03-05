import React from "react";
import type { CVData } from "@/types";
import Image from "next/image";

interface CVPreviewClassicProps {
  data: CVData;
  sectionOrder: string[];
}

export default function CVPreviewClassic({
  data,
  sectionOrder,
}: CVPreviewClassicProps) {
  const {
    personalInfo,
    profile,
    education,
    experience,
    skills,
    languages,
    interests,
  } = data;

  return (
    <div className="w-[210mm] h-[297mm] bg-white shadow-lg p-8">
      {/* Header with name */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-6">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="flex">
        {/* Left column */}
        <div className="w-1/3 pr-6">
          {/* Photo */}
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 overflow-hidden">
              <Image
                src={personalInfo.photo || "/placeholder-user.jpg"}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Personal information */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1">
              Informations personnelles
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-semibold">Adresse e-mail</p>
                <p>{personalInfo.email || "angelunel@gmail.com"}</p>
              </div>
              <div>
                <p className="font-semibold">Numéro de téléphone</p>
                <p>{personalInfo.phone || "0123233953"}</p>
              </div>
              <div>
                <p className="font-semibold">Adresse</p>
                <p>
                  {personalInfo.address || "41 passage des arts"},{" "}
                  {personalInfo.postalCode || "75002"}{" "}
                  {personalInfo.city || "Paris"}
                </p>
              </div>
              <div>
                <p className="font-semibold">Permis de conduire</p>
                <p>B, véhicule personnel</p>
              </div>
            </div>
          </div>

          {/* Formation */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1">
              Formation
            </h2>
            <div className="space-y-4 text-sm">
              {education.map((edu, index) => (
                <div key={index}>
                  <p className="font-semibold">{edu.startDate}</p>
                  <p>{edu.degree}</p>
                  <p>{edu.school}</p>
                </div>
              ))}
              {education.length === 0 && (
                <div>
                  <p className="font-semibold">2016</p>
                  <p>CAP Opérateur logistique</p>
                  <p>Lycée Mermoz, Paris</p>
                </div>
              )}
            </div>
          </div>

          {/* Compétences */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1">
              Compétences
            </h2>
            <div className="space-y-2 text-sm">
              {skills.map((skill, index) => (
                <div key={index} className="flex justify-between">
                  <span>{skill.name}</span>
                  <span>
                    {skill.level === 5
                      ? "Excellent"
                      : skill.level === 4
                      ? "Très bon"
                      : skill.level === 3
                      ? "Bon"
                      : skill.level === 2
                      ? "Intermédiaire"
                      : "Débutant"}
                  </span>
                </div>
              ))}
              {skills.length === 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Microsoft Word</span>
                    <span>Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Étiquetage</span>
                    <span>Excellent</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Qualités */}
          <div>
            <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1">
              Qualités
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-900 mr-2"></div>
                <span>Organisée</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-900 mr-2"></div>
                <span>Rigoureuse</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-2/3 pl-6 border-l border-gray-300">
          {/* Expérience professionnelle */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1">
              Expérience professionnelle
            </h2>
            <div className="space-y-6 text-sm">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="mb-1">
                    <p className="font-semibold">
                      de {exp.startDate} à{" "}
                      {exp.current ? "ce jour" : exp.endDate}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">{exp.position}</p>
                    <p>
                      {exp.company}, {exp.location}
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {exp.description
                        .split("\n")
                        .map(
                          (item, i) => item.trim() && <li key={i}>{item}</li>
                        )}
                    </ul>
                  </div>
                </div>
              ))}
              {experience.length === 0 && (
                <>
                  <div>
                    <div className="mb-1">
                      <p className="font-semibold">de sept. 2017 à ce jour</p>
                    </div>
                    <div>
                      <p className="font-semibold">Préparatrice de commandes</p>
                      <p>Oridis, Paris</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Réception de la marchandise</li>
                        <li>Vérification des arrivées</li>
                        <li>
                          Mise en place informatique et physique de la
                          marchandise
                        </li>
                        <li>Préparation des commandes clients</li>
                        <li>Édition du bon de livraison</li>
                        <li>Stockage et manutention</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1">
                      <p className="font-semibold">de juil. 2014 à août 2017</p>
                    </div>
                    <div>
                      <p className="font-semibold">Préparatrice de commandes</p>
                      <p>Inter Dépôt, Paris</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Prélèvement des commandes (commande vocale)</li>
                        <li>
                          Positionnement des colis sur les supports adaptés
                        </li>
                        <li>
                          Vérification de la stabilité du support avant
                          expédition
                        </li>
                        <li>
                          Participation au rangement et à la propreté du site
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1">
                      <p className="font-semibold">de juin 2010 à juin 2014</p>
                    </div>
                    <div>
                      <p className="font-semibold">Préparatrice de commandes</p>
                      <p>Rapid' Colis, Paris</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Conditionnement des produits frais</li>
                        <li>Contrôle de la marchandise</li>
                        <li>Étiquetage des colis et des palettes</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-xs mt-12">© CV+</div>
    </div>
  );
}
