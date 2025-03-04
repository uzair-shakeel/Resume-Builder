import type { CVData } from "@/types"
import Image from "next/image"
import { Mail, Phone, MapPin, Home } from "lucide-react"

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
    <div className="text-white space-y-6">
      <h2 className="text-xl font-medium mb-4">Informations personnelles</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5" />
          <span className="text-sm">{personalInfo.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5" />
          <span className="text-sm">{personalInfo.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5" />
          <span className="text-sm">{personalInfo.address}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5" />
          <span className="text-sm">
            {personalInfo.postalCode} {personalInfo.city}
          </span>
        </div>
      </div>
    </div>
  )

  const renderProfile = () =>
    profile && (
      <section className="mb-8">
        <h2 className="text-xl text-teal-600 font-medium mb-3">Profil</h2>
        <p className="text-gray-600 leading-relaxed">{profile}</p>
      </section>
    )

  const renderEducation = () =>
    education.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-teal-600 font-medium mb-4">Formation</h2>
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
    )

  const renderExperience = () =>
    experience.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-teal-600 font-medium mb-4">Expérience professionnelle</h2>
        {experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{exp.position || "Web Developer"}</p>
                <p className="text-gray-600">{exp.company || "Agilo, Sindh"}</p>
              </div>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            {exp.description && <p className="mt-2 text-gray-600 leading-relaxed">{exp.description}</p>}
          </div>
        ))}
      </section>
    )

  const renderSkills = () =>
    skills.length > 0 && (
      <div className="text-white">
        <h2 className="text-xl font-medium mb-4">Compétences</h2>
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="text-sm mb-1">{skill.name}</div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < skill.level ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )

  const renderLanguages = () =>
    languages.length > 0 && (
      <div className="text-white">
        <h2 className="text-xl font-medium mb-4">Langues</h2>
        <div className="space-y-3">
          {languages.map((language, index) => (
            <div key={index}>
              <div className="text-sm mb-1">{language.name}</div>
              <div className="text-sm text-white/80">{language.level}</div>
            </div>
          ))}
        </div>
      </div>
    )

  const renderInterests = () =>
    interests.length > 0 && (
      <div className="text-white">
        <h2 className="text-xl font-medium mb-4">Centres d'intérêt</h2>
        <div className="space-y-2">
          {interests.map((interest, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-sm">{interest.name}</span>
            </div>
          ))}
        </div>
      </div>
    )

  return (
    <div className="bg-white shadow-lg" style={{ width: "210mm", minHeight: "297mm", margin: "0 auto" }}>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-[240px] relative bg-gradient-to-b from-teal-500 to-teal-600 p-6 min-h-[297mm]">
          <div className="relative w-40 h-40 mx-auto mb-6">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white">
              <Image
                src={personalInfo.photo || "/placeholder.svg?height=200&width=200"}
                alt="Profile"
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-white/90">{personalInfo.title}</p>
          </div>

          <div className="space-y-8">
            {renderPersonalInfo()}
            {renderSkills()}
            {renderLanguages()}
            {renderInterests()}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {profile && (
            <section className="mb-8">
              <h2 className="text-xl text-teal-600 font-medium mb-3">Profil</h2>
              <p className="text-gray-600 leading-relaxed">{profile}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl text-teal-600 font-medium mb-4">Expérience professionnelle</h2>
              {experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{exp.position || "Web Developer"}</p>
                      <p className="text-gray-600">{exp.company || "Agilo, Sindh"}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.endDate}
                    </p>
                  </div>
                  {exp.description && <p className="mt-2 text-gray-600 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl text-teal-600 font-medium mb-4">Formation</h2>
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
          )}
        </div>
      </div>
    </div>
  )
}

