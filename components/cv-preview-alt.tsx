import React from "react";
import type { CVData } from "@/types";
import Image from "next/image";
import { Mail, Phone, MapPin, Home } from "lucide-react";

interface CVPreviewAltProps {
  data: CVData;
  sectionOrder: string[];
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
}

export default function CVPreviewAlt({
  data,
  sectionOrder,
  pageBreakSettings,
}: CVPreviewAltProps) {
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
        return null; // Personal info is always in sidebar
      case "profile":
        return renderProfile();
      case "education":
        return renderEducation();
      case "experience":
        return renderExperience();
      case "skills":
        return null; // Skills are always in sidebar
      case "languages":
        return null; // Languages are always in sidebar
      case "interests":
        return null; // Interests are always in sidebar
      default:
        return null;
    }
  };

  const renderProfile = () =>
    profile && (
      <section className="mb-8">
        <h2 className="text-xl text-purple-800 font-medium mb-3">Profil</h2>
        <p className="text-gray-600 leading-relaxed">{profile}</p>
      </section>
    );

  const renderEducation = () =>
    education.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-purple-800 font-medium mb-4">Formation</h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{edu.school}</p>
                <p className="text-gray-600">{edu.degree}</p>
              </div>
              <p className="text-sm text-gray-500">
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
          </div>
        ))}
      </section>
    );

  const renderExperience = () =>
    experience.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-purple-800 font-medium mb-4">
          Expérience professionnelle
        </h2>
        {experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{exp.position}</p>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            {exp.description && (
              <p className="mt-2 text-gray-600 leading-relaxed">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </section>
    );

  return (
    <div className="cv-page">
      <div className="cv-page-content flex">
        {/* Left sidebar */}
        <div className="w-1/3 cv-sidebar bg-blue-600 text-white">
          <div className="flex flex-col items-center py-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4">
              <Image
                src={personalInfo.photo || "/placeholder-user.jpg"}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-2xl font-bold">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-blue-200 mt-1">{personalInfo.title}</p>
          </div>

          <div className="space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="text-lg font-medium text-purple-900 mb-3">
                Informations personnelles
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-900">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-900">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-900">
                  <Home className="w-4 h-4" />
                  <span className="text-sm">{personalInfo.address}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-900">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {personalInfo.postalCode} {personalInfo.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-purple-900 mb-3">
                  Compétences
                </h2>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="text-sm text-purple-900 mb-1">
                        {skill.name}
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < skill.level
                                ? "bg-purple-700"
                                : "bg-purple-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-purple-900 mb-3">
                  Langues
                </h2>
                <div className="space-y-2">
                  {languages.map((language, index) => (
                    <div key={index}>
                      <div className="text-sm text-purple-900">
                        {language.name}
                      </div>
                      <div className="text-sm text-purple-700">
                        {language.level}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-purple-900 mb-3">
                  Centres d'intérêt
                </h2>
                <div className="space-y-1">
                  {interests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-700 rounded-full" />
                      <span className="text-sm text-purple-900">
                        {interest.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {sectionOrder.map((section) => renderSection(section))}
        </div>
      </div>
    </div>
  );
}
