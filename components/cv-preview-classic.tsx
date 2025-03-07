import React from "react";
import type { CVData } from "@/types";
import Image from "next/image";

interface CVPreviewClassicProps {
  data: CVData;
  sectionOrder: string[];
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
}

export default function CVPreviewClassic({
  data,
  sectionOrder,
  pageBreakSettings,
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

  // Default page break settings if not provided
  const breakSettings = pageBreakSettings || {
    keepHeadingsWithContent: true,
    avoidOrphanedHeadings: true,
    minLinesBeforeBreak: 3,
  };

  return (
    <div className="cv-page">
      <div className="cv-page-content">
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
              <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                Contact
              </h2>
              <div className="space-y-2 section-content">
                <div>
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm">{personalInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Téléphone:</p>
                  <p className="text-sm">{personalInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Adresse:</p>
                  <p className="text-sm">
                    {personalInfo.address}, {personalInfo.postalCode}{" "}
                    {personalInfo.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div
                className={`mb-6 ${
                  breakSettings.keepHeadingsWithContent ? "keep-together" : ""
                }`}
              >
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  Compétences
                </h2>
                <div className="space-y-2 section-content">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <p className="text-sm font-medium">{skill.name}</p>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="h-2 rounded-full cv-accent-bg"
                          style={{
                            width: `${(parseInt(skill.level) / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div
                className={`mb-6 ${
                  breakSettings.keepHeadingsWithContent ? "keep-together" : ""
                }`}
              >
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  Langues
                </h2>
                <div className="space-y-2 section-content">
                  {languages.map((language, index) => (
                    <div key={index}>
                      <p className="text-sm font-medium">{language.name}</p>
                      <p className="text-sm cv-accent-color">
                        {language.level}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div
                className={`mb-6 ${
                  breakSettings.keepHeadingsWithContent ? "keep-together" : ""
                }`}
              >
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  Centres d'intérêt
                </h2>
                <ul className="list-disc list-inside text-sm space-y-1 section-content">
                  {interests.map((interest, index) => (
                    <li key={index}>
                      <span className="cv-bullet">•</span> {interest}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="w-2/3">
            {/* Profile */}
            {profile && (
              <div
                className={`mb-6 ${
                  breakSettings.keepHeadingsWithContent ? "keep-together" : ""
                }`}
              >
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  Profil
                </h2>
                <p className="text-sm section-content">{profile}</p>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  Expérience professionnelle
                </h2>
                <div className="space-y-4 section-content">
                  {experience.map((exp, index) => (
                    <div
                      key={index}
                      className={`${
                        index > 0 && index < experience.length - 1
                          ? "keep-together"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">{exp.position}</h3>
                        <p className="text-sm cv-accent-color">
                          {exp.startDate} - {exp.endDate}
                        </p>
                      </div>
                      <p className="text-sm italic">{exp.company}</p>
                      <p className="text-sm mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  Formation
                </h2>
                <div className="space-y-4 section-content">
                  {education.map((edu, index) => (
                    <div
                      key={index}
                      className={`${
                        index > 0 && index < education.length - 1
                          ? "keep-together"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">{edu.degree}</h3>
                        <p className="text-sm cv-accent-color">
                          {edu.startDate} - {edu.endDate}
                        </p>
                      </div>
                      <p className="text-sm italic">{edu.school}</p>
                      <p className="text-sm mt-1">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
