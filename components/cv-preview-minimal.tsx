import React from "react";
import type { CVData } from "@/types";
import Image from "next/image";

interface CVPreviewMinimalProps {
  data: CVData;
  sectionOrder: string[];
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
}

export default function CVPreviewMinimal({
  data,
  sectionOrder,
  pageBreakSettings,
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

  const accentColor = "#D91B81"; // Pink accent color

  return (
    <div className="cv-page">
      <div className="cv-page-content">
        {/* Header with name and title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-gray-600">{personalInfo.title}</p>
          <div className="flex justify-center items-center gap-4 mt-2 text-sm text-gray-600">
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
            <span>•</span>
            <span>
              {personalInfo.city}, {personalInfo.postalCode}
            </span>
          </div>
        </div>

        {/* Left sidebar with accent color */}
        <div className="w-[60px] bg-[#D91B81] flex flex-col items-center pt-8">
          <div className="text-white font-bold text-xl rotate-90 tracking-widest mt-8">
            CV
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {/* Personal information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              Informations personnelles
            </h2>
            <div className="space-y-2">
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-[#D91B81] font-medium">
                  Adresse e-mail
                </span>
                <span>{personalInfo.email}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-[#D91B81] font-medium">
                  Numéro de téléphone
                </span>
                <span>{personalInfo.phone}</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-[#D91B81] font-medium">Adresse</span>
                <span>
                  {personalInfo.address}, {personalInfo.postalCode}{" "}
                  {personalInfo.city}
                </span>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="w-[100px] h-[120px] overflow-hidden">
            <Image
              src={personalInfo.photo || "/placeholder-user.jpg"}
              alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
              width={100}
              height={120}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Education */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Formation</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="grid grid-cols-[140px_1fr]">
                  <div className="text-[#D91B81]">
                    <p className="text-sm">
                      De {edu.startDate} à{" "}
                      {edu.current ? "ce jour" : edu.endDate}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm">{edu.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              Expérience professionnelle
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="grid grid-cols-[140px_1fr]">
                  <div className="text-[#D91B81]">
                    <p className="text-sm">
                      De {exp.startDate} à{" "}
                      {exp.current ? "ce jour" : exp.endDate}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{exp.position}</p>
                    <p className="text-sm">
                      {exp.company}, {exp.location}
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                      {exp.description
                        .split("\n")
                        .map(
                          (item, i) => item.trim() && <li key={i}>{item}</li>
                        )}
                      <li>Gestion du salon et encadrement des clients</li>
                      <li>Réalisation de coupes féminines et masculines</li>
                      <li>Techniques de colorations</li>
                      <li>Prise de rendez-vous</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Compétences</h2>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="grid grid-cols-[140px_1fr]">
                  <span className="text-[#D91B81] font-medium">
                    {skill.name}
                  </span>
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
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-[#D91B81] font-medium">
                  Sens commercial
                </span>
                <span>Excellent</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-[#D91B81] font-medium">
                  Techniques de coloration
                </span>
                <span>Excellent</span>
              </div>
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-[#D91B81] font-medium">
                  Coiffure de cérémonie
                </span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Qualities */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Qualités</h2>
            <ul className="list-none space-y-1">
              <li className="flex items-center">
                <div className="w-3 h-3 bg-[#D91B81] mr-2"></div>
                <span>Bon relationnel</span>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 bg-[#D91B81] mr-2"></div>
                <span>Patiente</span>
              </li>
            </ul>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Centres d'intérêt</h2>
            <ul className="list-none space-y-1">
              {interests.map((interest, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-3 h-3 bg-[#D91B81] mr-2"></div>
                  <span>{interest.name}</span>
                </li>
              ))}
              <li className="flex items-center">
                <div className="w-3 h-3 bg-[#D91B81] mr-2"></div>
                <span>Gymnastique rythmique et sportive</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-xs mt-12">© CV+</div>
        </div>
      </div>
    </div>
  );
}
