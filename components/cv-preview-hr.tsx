import type { CVData } from "@/types";
import Image from "next/image";

interface CVPreviewHRProps {
  data: CVData;
  sectionOrder: string[];
}

export default function CVPreviewHR({ data, sectionOrder }: CVPreviewHRProps) {
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
    <div className="w-[210mm] h-[297mm] bg-white shadow-lg overflow-hidden">
      {/* Header with curved background */}
      <div className="relative bg-gray-800 text-white pt-6 pb-20">
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gray-800"
          style={{
            borderBottomLeftRadius: "50% 30%",
            borderBottomRightRadius: "50% 30%",
          }}
        ></div>

        <div className="px-8 flex justify-between">
          {/* Name and title */}
          <div className="z-10">
            <h1 className="text-3xl font-bold mb-1">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-gray-300">{personalInfo.title}</p>
          </div>

          {/* Contact info */}
          <div className="flex flex-col items-end text-sm space-y-1 z-10">
            <div className="flex items-center">
              <span className="mr-2">{personalInfo.email}</span>
              <div className="w-5 h-5 bg-amber-500 rounded-sm flex items-center justify-center">
                <span className="text-xs">✉</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-2">{personalInfo.phone}</span>
              <div className="w-5 h-5 bg-amber-500 rounded-sm flex items-center justify-center">
                <span className="text-xs">📞</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-2">{personalInfo.city}</span>
              <div className="w-5 h-5 bg-amber-500 rounded-sm flex items-center justify-center">
                <span className="text-xs">📍</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-2">
                linkedin.com/in/{personalInfo.firstName.toLowerCase()}
                {personalInfo.lastName.toLowerCase()}
              </span>
              <div className="w-5 h-5 bg-amber-500 rounded-sm flex items-center justify-center">
                <span className="text-xs">in</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-2">
                @{personalInfo.firstName.toLowerCase()}
                {personalInfo.lastName.toLowerCase()}
              </span>
              <div className="w-5 h-5 bg-amber-500 rounded-sm flex items-center justify-center">
                <span className="text-xs">@</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile photo */}
      <div className="relative mx-auto -mt-16 w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg z-10">
        <Image
          src={personalInfo.photo || "/placeholder-user.jpg"}
          alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
          width={112}
          height={112}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Profile summary */}
      <div className="px-8 pt-4 pb-6 text-sm text-gray-700 max-w-3xl mx-auto">
        <p>{profile}</p>
      </div>

      {/* Main content */}
      <div className="px-8 grid grid-cols-2 gap-8">
        {/* Left column */}
        <div>
          {/* Work Experience */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-7 h-7 bg-gray-800 rounded-md flex items-center justify-center mr-3">
                <span className="text-white text-xs">💼</span>
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wide">
                Work Experience
              </h2>
            </div>

            {experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <h3 className="font-bold">{exp.position}</h3>
                  <span className="text-xs text-amber-600">{exp.location}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm">{exp.company}</p>
                  <p className="text-xs text-gray-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                <ul className="text-xs text-gray-700 list-disc pl-4 space-y-1.5">
                  {exp.description.split("\n").map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Certificates */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-7 h-7 bg-gray-800 rounded-md flex items-center justify-center mr-3">
                <span className="text-white text-xs">🏆</span>
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wide">
                Certificates
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-bold">
                  Certified Professional Human Resources (2014)
                </p>
                <p className="text-xs text-gray-500">
                  HR Certification Institute
                </p>
              </div>
              <div>
                <p className="font-bold">
                  Behavioral Interviewing Certification (03/2013)
                </p>
                <p className="text-xs text-gray-500">
                  American Society of Training & Development Certification
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Skills & Competencies */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-7 h-7 bg-gray-800 rounded-md flex items-center justify-center mr-3">
                <span className="text-white text-xs">🛠️</span>
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wide">
                Skills & Competencies
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600"
                >
                  {skill.name}
                </div>
              ))}
              <div className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600">
                HRIS
              </div>
              <div className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600">
                Data Analysis
              </div>
              <div className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600">
                Onboarding
              </div>
              <div className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600">
                Recruiting
              </div>
              <div className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600">
                Employee Relations
              </div>
              <div className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600">
                Conflict Resolution
              </div>
              <div className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600">
                SAP
              </div>
              <div className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600">
                Agile Mindset
              </div>
              <div className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600">
                Labor Laws & Regulatory Compliance
              </div>
              <div className="bg-gray-200 rounded px-2 py-1 text-xs text-center text-gray-600">
                Training & Professional Development
              </div>
            </div>
          </div>

          {/* Conferences & Courses */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-7 h-7 bg-gray-800 rounded-md flex items-center justify-center mr-3">
                <span className="text-white text-xs">🎓</span>
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wide">
                Conferences & Courses
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-bold">Data Handling Training (02/2013)</p>
                <p className="text-xs text-gray-500">
                  American Society of Training & Development Consulting
                </p>
              </div>
              <div>
                <p className="font-bold">
                  General Industry Safety & Health Training (10/2012)
                </p>
                <p className="text-xs text-gray-500">
                  OSHA Safety & Health Training Center
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-7 h-7 bg-gray-800 rounded-md flex items-center justify-center mr-3">
                <span className="text-white text-xs">🎓</span>
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wide">
                Education
              </h2>
            </div>

            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <p className="font-bold">{edu.degree}</p>
                  <p className="text-sm">{edu.school}</p>
                  <p className="text-xs text-gray-500">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </p>
                </div>
              ))}
              <div>
                <p className="font-bold">MBA in Human Resources Management</p>
                <p className="text-sm">University of Indianapolis</p>
                <p className="text-xs text-gray-500">2011 - 2013</p>
              </div>
              <div>
                <p className="font-bold">
                  Bachelor of Arts in Applied Psychology
                </p>
                <p className="text-sm">Purdue University Indianapolis</p>
                <p className="text-xs text-gray-500">2006 - 2011</p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-7 h-7 bg-gray-800 rounded-md flex items-center justify-center mr-3">
                <span className="text-white text-xs">🌐</span>
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wide">
                Languages
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold">English</p>
                <p className="text-xs text-gray-500">
                  Native or Bilingual Proficiency
                </p>
              </div>
              <div>
                <p className="font-bold">Spanish</p>
                <p className="text-xs text-gray-500">
                  Native or Bilingual Proficiency
                </p>
              </div>
              <div>
                <p className="font-bold">Italian</p>
                <p className="text-xs text-gray-500">
                  Full Professional Proficiency
                </p>
              </div>
              <div>
                <p className="font-bold">German</p>
                <p className="text-xs text-gray-500">
                  Limited Working Proficiency
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
