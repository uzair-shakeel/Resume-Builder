import type { CVData } from "@/types"
import Image from "next/image"
import { Mail, Phone, MapPin, Home } from "lucide-react"

interface CVPreviewProps {
  data: CVData
  sectionOrder: string[]
}

export default function CVPreviewAlt({ data, sectionOrder }: CVPreviewProps) {
  const { personalInfo, profile, education, experience, skills, languages, interests } = data

  const renderSection = (section: string) => {
    switch (section) {
      case "personal-info":
        return null // Personal info is always in sidebar
      case "profile":
        return renderProfile()
      case "education":
        return renderEducation()
      case "experience":
        return renderExperience()
      case "skills":
        return null // Skills are always in sidebar
      case "languages":
        return null // Languages are always in sidebar
      case "interests":
        return null // Interests are always in sidebar
      default:
        return null
    }
  }

  const renderProfile = () =>
    profile && (
      <section className="mb-8">
        <h2 className="text-xl text-purple-800 font-medium mb-3">Profil</h2>
        <p className="text-gray-600 leading-relaxed">{profile}</p>
      </section>
    )

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
    )

  const renderExperience = () =>
    experience.length > 0 && (
      <section className="mb-8">
        <h2 className="text-xl text-purple-800 font-medium mb-4">Expérience professionnelle</h2>
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
            {exp.description && <p className="mt-2 text-gray-600 leading-relaxed">{exp.description}</p>}
          </div>
        ))}
      </section>
    )

  return (
    <div className="bg-white shadow-lg" style={{ width: "210mm", minHeight: "297mm", margin: "0 auto" }}>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-[240px] bg-purple-50 p-6 min-h-[297mm]">
          <div className="mb-6">
            <div className="w-40 h-40 mx-auto overflow-hidden">
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
            <h1 className="text-2xl font-bold text-purple-900 mb-1">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-purple-700">{personalInfo.title}</p>
          </div>

          <div className="space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="text-lg font-medium text-purple-900 mb-3">Informations personnelles</h2>
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
                <h2 className="text-lg font-medium text-purple-900 mb-3">Compétences</h2>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="text-sm text-purple-900 mb-1">{skill.name}</div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < skill.level ? "bg-purple-700" : "bg-purple-200"}`}
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
                <h2 className="text-lg font-medium text-purple-900 mb-3">Langues</h2>
                <div className="space-y-2">
                  {languages.map((language, index) => (
                    <div key={index}>
                      <div className="text-sm text-purple-900">{language.name}</div>
                      <div className="text-sm text-purple-700">{language.level}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-purple-900 mb-3">Centres d'intérêt</h2>
                <div className="space-y-1">
                  {interests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-700 rounded-full" />
                      <span className="text-sm text-purple-900">{interest.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">{sectionOrder.map((section) => renderSection(section))}</div>
      </div>
    </div>
  )
}

