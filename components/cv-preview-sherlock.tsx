import React from "react";
import type { CVData } from "@/types";
import Image from "next/image";

interface CVPreviewSherlockProps {
  data: CVData;
  sectionOrder: string[];
  pageBreakSettings?: {
    keepHeadingsWithContent: boolean;
    avoidOrphanedHeadings: boolean;
    minLinesBeforeBreak: number;
  };
}

export default function CVPreviewSherlock({
  data,
  sectionOrder,
  pageBreakSettings,
}: CVPreviewSherlockProps) {
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
      <div className="cv-page-content flex">
        {/* Left sidebar */}
        <div className="w-1/3 cv-sidebar bg-gray-700 text-white flex flex-col">
          {/* Photo */}
          <div className="mx-auto mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-500 bg-gray-500">
              <Image
                src={personalInfo.photo || "/placeholder-user.jpg"}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* About me */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
              About me
            </h2>
            <p className="text-sm text-gray-300">{profile}</p>
          </div>

          {/* Links */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
              Links
            </h2>
            <div className="text-sm">
              <p className="mb-1">LinkedIn:</p>
              <p className="text-gray-300 mb-2 text-xs break-words">
                www.linkedin.com/in/{personalInfo.firstName.toLowerCase()}
                {personalInfo.lastName.toLowerCase()}
              </p>

              <p className="mb-1">Twitter:</p>
              <p className="text-gray-300 mb-2 text-xs break-words">
                www.twitter.com/{personalInfo.firstName.toLowerCase()}
                {personalInfo.lastName.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Reference */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
              Reference
            </h2>
            <div className="text-sm">
              <p className="font-semibold mb-1">DR. JOHN WATSON</p>
              <p className="text-gray-300 mb-1">Self-Employed</p>
              <p className="text-gray-300 mb-1">+44 20 7946 0488</p>
              <p className="text-gray-300 text-xs break-words">
                j.watson@bakerstreet.com
              </p>
            </div>
          </div>

          {/* Hobbies/Interests */}
          <div>
            <h2 className="text-lg font-semibold uppercase mb-2 border-b border-gray-500 pb-1">
              Hobbies
            </h2>
            <ul className="text-sm text-gray-300">
              {interests.map((interest, index) => (
                <li key={index} className="mb-1">
                  • {interest.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className="w-2/3 p-6">
          <div className="flex justify-between ">
            {/* Name and title */}
            <div className="w-1/3 mb-8">
              <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              <p className="text-sm uppercase tracking-wider text-gray-800">
                {personalInfo.title}
              </p>
            </div>

            {/* Contact info */}
            <div className="mb-8">
              <div className="flex items-center justify-end gap-3 mb-2">
                <p className="text-sm text-gray-700">
                  {personalInfo.address}, {personalInfo.city},{" "}
                  {personalInfo.postalCode}
                </p>
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                  <span className="text-white text-xs">📍</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mb-2">
                <p className="text-sm text-gray-700">{personalInfo.phone}</p>
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                  <span className="text-white text-xs">📞</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <p className="text-sm text-gray-700">{personalInfo.email}</p>
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                  <span className="text-white text-xs">✉️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              Work Experience
            </h2>
            <div className="relative">
              {/* Continuous vertical line that spans the entire timeline */}
              <div className="absolute left-[calc(33.333%+5.2px)] top-2 bottom-10 w-0.5 bg-gray-700"></div>

              {experience.map((exp, index) => (
                <div key={index} className="mb-8 relative">
                  <div className="flex">
                    <div className="w-1/3">
                      <p className="font-semibold text-sm uppercase">
                        {exp.company}
                      </p>
                      {exp.location && (
                        <p className="text-xs text-gray-500">{exp.location}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                    <div className="w-2/3">
                      <div className="flex relative pl-6 items-start">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gray-700 z-10"></div>

                        <p className="font-semibold text-sm">{exp.position}</p>
                      </div>
                      <div className="pl-6 mt-1">
                        <p
                          className="text-xs text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: exp.description
                              .replace(/\n/g, "<br/>")
                              .replace(/\./g, ".<br/>"),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              Education
            </h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-6 relative">
                <div className="grid grid-cols-3 gap-4">
                  {/* Left column - School and dates */}
                  <div className="col-span-1">
                    <p className="font-semibold text-sm uppercase">
                      {edu.school}
                    </p>
                    <p className="text-xs text-gray-500">
                      {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                    </p>
                  </div>

                  {/* Right column - Degree and description */}
                  <div className="col-span-2 relative pl-6">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gray-700"></div>

                    {/* Vertical line connecting dots (except for last item) */}
                    {index < education.length - 1 && (
                      <div
                        className="absolute left-[5.2px] top-3 w-0.5 bg-gray-700"
                        style={{ height: "calc(100% + 1.5rem)" }}
                      ></div>
                    )}

                    <p className="font-semibold text-sm">{edu.degree}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {skills.slice(0, 6).map((skill, index) => (
                <div key={index} className="mb-2">
                  <p className="text-xs uppercase mb-1 text-gray-600">
                    {skill.name}
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-sm">
                    <div
                      className="bg-gray-700 h-2 rounded-sm"
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((language, index) => (
                <div key={index} className="mb-2">
                  <p className="text-xs uppercase mb-1 text-gray-600">
                    {language.name}
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-sm">
                    <div
                      className="bg-gray-700 h-2 rounded-sm"
                      style={{
                        width:
                          language.level === "Natif"
                            ? "100%"
                            : language.level === "Courant"
                            ? "80%"
                            : language.level === "Avancé"
                            ? "60%"
                            : language.level === "Intermédiaire"
                            ? "40%"
                            : "20%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
