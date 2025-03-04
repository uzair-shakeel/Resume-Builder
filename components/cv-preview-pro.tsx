import type { CVData } from "@/types"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

interface CVPreviewProps {
  data: CVData
  sectionOrder: string[]
}

export default function CVPreviewPro({ data, sectionOrder }: CVPreviewProps) {
  const { personalInfo, profile, education, experience, skills, languages, interests } = data

  const renderProfile = () => {
    if (!profile) return null
    return (
      <section className="mb-8">
        <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">Profil</h2>
        <p className="text-gray-600 leading-relaxed">{profile}</p>
      </section>
    )
  }

  const renderEducation = () => {
    if (!education || education.length === 0) return null
    return (
      <section className="mb-8">
        <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">Formation</h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{edu.school}</p>
                <p className="text-gray-600">{edu.degree}</p>
              </div>
              <p className="text-sm text-teal-600 font-medium">
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
          </div>
        ))}
      </section>
    )
  }

  const renderExperience = () => {
    if (!experience || experience.length === 0) return null
    return (
      <section className="mb-8">
        <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">Expérience professionnelle</h2>
        {experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{exp.position}</p>
                <p className="text-gray-600">{exp.company}</p>
              </div>
              <p className="text-sm text-teal-600 font-medium">
                {exp.startDate} - {exp.endDate}
              </p>
            </div>
            {exp.description && <p className="mt-2 text-gray-600 leading-relaxed">{exp.description}</p>}
          </div>
        ))}
      </section>
    )
  }

  const renderSection = (section: string) => {
    switch (section) {
      case "personal-info":
        return null // Personal info is in header
      case "profile":
        return renderProfile()
      case "education":
        return renderEducation()
      case "experience":
        return renderExperience()
      case "skills":
        return null // Skills are in sidebar
      case "languages":
        return null // Languages are in sidebar
      case "interests":
        return null // Interests are in sidebar
      default:
        return null
    }
  }

  return (
    <div className="bg-white shadow-lg" style={{ width: "210mm", minHeight: "297mm", margin: "0 auto" }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-teal-600 text-white p-6 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
            <Image
              src={personalInfo.photo || "/placeholder.svg?height=200&width=200"}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-teal-100">{personalInfo.title}</p>
            <div className="flex gap-4 mt-2 text-sm text-teal-50">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {personalInfo.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {personalInfo.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {personalInfo.city}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div className="w-[240px] bg-gray-900 text-white p-6">
            {/* Competences */}
            {skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">Compétences</h2>
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="text-sm mb-1">{skill.name}</div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">Langues</h2>
                <div className="space-y-3">
                  {languages.map((language, index) => (
                    <div key={index}>
                      <div className="text-sm mb-1">{language.name}</div>
                      <div className="text-sm text-gray-400">{language.level}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-4 uppercase tracking-wider">Centres d'intérêt</h2>
                <div className="space-y-2">
                  {interests.map((interest, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                      <span className="text-sm">{interest.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {profile && (
              <section className="mb-8">
                <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">Profil</h2>
                <p className="text-gray-600 leading-relaxed">{profile}</p>
              </section>
            )}

            {experience.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">
                  Expérience professionnelle
                </h2>
                {experience.map((exp, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{exp.position}</p>
                        <p className="text-gray-600">{exp.company}</p>
                      </div>
                      <p className="text-sm text-teal-600 font-medium">
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
                <h2 className="text-xl text-teal-600 font-medium mb-4 uppercase tracking-wider">Formation</h2>
                {education.map((edu, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{edu.school}</p>
                        <p className="text-gray-600">{edu.degree}</p>
                      </div>
                      <p className="text-sm text-teal-600 font-medium">
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
    </div>
  )
}

