import type { CVData } from "@/types"
import Image from "next/image"

interface CVPreviewProps {
  data: CVData
  sectionOrder: string[]
}

export default function CVPreview({ data, sectionOrder }: CVPreviewProps) {
  const { personalInfo, profile, education, experience, skills, languages, interests } = data

  const renderSection = (section: string) => {
    switch (section) {
      case "personal-info":
        return renderPersonalInfo()
      case "profile":
        return renderProfile()
      case "education":
        return renderEducation()
      case "experience":
        return renderExperience()
      case "skills":
        return renderSkills()
      case "languages":
        return renderLanguages()
      case "interests":
        return renderInterests()
      default:
        return null
    }
  }

  const renderPersonalInfo = () => (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-xl text-blue-800 font-medium mb-4">Informations personnelles</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span className="text-sm">
            {personalInfo.firstName} {personalInfo.lastName}
          </span>
        </div>

        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-sm">{personalInfo.email}</span>
        </div>

        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <span className="text-sm">{personalInfo.phone}</span>
        </div>

        <div className="flex items-start">
          <div className="w-6 h-6 mr-2 text-blue-800 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-sm">
            {personalInfo.address}
            <br />
            {personalInfo.postalCode} {personalInfo.city}
          </span>
        </div>
      </div>
    </div>
  )

  const renderProfile = () =>
    profile && (
      <section className="mb-8">
        <h2 className="text-xl text-blue-800 font-medium mb-2">Profil</h2>
        <p className="text-sm">{profile}</p>
      </section>
    )

  const renderEducation = () =>
    education.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-blue-800 font-medium mb-2">Formation</h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <p className="font-medium">
                {edu.school || "Remplissez le champ en surbrillance pour obtenir des suggestions de l'IA."}
              </p>
              <p className="text-sm text-gray-600">
                de {edu.startDate} à {edu.endDate}
              </p>
            </div>
            <p className="text-sm text-gray-500">{edu.school}</p>
            <ul className="list-disc ml-5 mt-1">
              <li className="text-sm">
                {edu.degree ||
                  "Compétences en communication écrite et verbale adaptées aux environnements professionnels."}
              </li>
            </ul>
          </div>
        ))}
      </section>
    )

  const renderExperience = () =>
    experience.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-blue-800 font-medium mb-2">Expérience professionnelle</h2>
        {experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{exp.position || "Web Developer"}</p>
                <p className="text-sm text-gray-600">{exp.company || "Agilo, Sindh"}</p>
              </div>
              <p className="text-sm text-gray-600">
                de {exp.startDate} à {exp.endDate}
              </p>
            </div>
            {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
          </div>
        ))}
      </section>
    )

  const renderSkills = () =>
    skills.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-blue-800 font-medium mb-2">Compétences</h2>
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center">
              <span className="w-48 text-sm">{skill.name}</span>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i < skill.level ? "bg-blue-800" : "bg-gray-300"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )

  const renderLanguages = () =>
    languages.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-blue-800 font-medium mb-2">Langues</h2>
        <div className="space-y-3">
          {languages.map((language, index) => (
            <div key={index} className="flex items-center">
              <span className="w-48 text-sm">{language.name}</span>
              <span className="text-sm text-gray-600">{language.level}</span>
            </div>
          ))}
        </div>
      </section>
    )

  const renderInterests = () =>
    interests.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-blue-800 font-medium mb-2">Centres d'intérêt</h2>
        <div className="space-y-2">
          {interests.map((interest, index) => (
            <div key={index} className="flex items-center">
              <div className="w-4 h-4 bg-blue-800 mr-2" />
              <span className="text-sm">{interest.name}</span>
            </div>
          ))}
        </div>
      </section>
    )

  return (
    <div className="bg-white shadow-sm" style={{ width: "210mm", minHeight: "297mm", margin: "0 auto" }}>
      <div className="p-6">
        {/* Header with blue background */}
        <div className="bg-blue-800 text-white p-6 rounded-t-lg mb-6 relative">
          <h1 className="text-2xl font-semibold">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p>{personalInfo.title}</p>

          {/* Profile image */}
          <div className="absolute bottom-0 translate-y-1/2 right-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-yellow-100">
              <Image
                src={personalInfo.photo || "/placeholder.svg?height=200&width=200"}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-16">{sectionOrder.map((section) => renderSection(section))}</div>
      </div>
    </div>
  )
}

