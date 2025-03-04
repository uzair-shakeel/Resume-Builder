"use client"

import type React from "react"

import { useState, useRef } from "react"
import PersonalInfo from "@/components/sections/personal-info"
import Profile from "@/components/sections/profile"
import Education from "@/components/sections/education"
import Experience from "@/components/sections/experience"
import Skills from "@/components/sections/skills"
import Languages from "@/components/sections/languages"
import Interests from "@/components/sections/interests"
import CVPreview from "@/components/cv-preview"
import type { CVData } from "@/types"
import { ChevronDown, ChevronUp, MoreVertical, Download, GripVertical } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import CVPreviewAlt from "@/components/cv-preview-alt"
import { TemplateSelector } from "@/components/template-selector"
import CVPreviewPro from "@/components/cv-preview-pro"

export default function Home() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "personal-info": true,
    profile: false,
    education: false,
    experience: false,
    skills: false,
    languages: false,
    interests: false,
  })

  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      firstName: "Uzair",
      lastName: "Shakeel",
      title: "Software Developer",
      email: "uzairshakeel97531@gmail.com",
      phone: "+923482129578",
      address: "Address @ addres Block 13, Khi",
      postalCode: "75298",
      city: "Sindh",
      photo: "/placeholder.svg?height=200&width=200",
    },
    profile:
      "Professionnel dynamique avec une solide expérience dans le secteur technologique, je suis passionné par l'innovation et la recherche de solutions efficaces. Mes compétences en communication et travail d'équipe m'ont permis de réussir dans des environnements variés, tout en garantissant des résultats de qualité.",
    education: [
      {
        school: "don't know, sindh",
        degree: "Compétences en communication écrite et verbale adaptées aux environnements professionnels.",
        startDate: "sept. 2016",
        endDate: "ce jour",
        current: true,
      },
    ],
    experience: [
      {
        position: "Web Developer",
        company: "Agilo, Sindh",
        location: "",
        startDate: "sept. 2017",
        endDate: "ce jour",
        current: true,
        description: "",
      },
    ],
    skills: [
      { name: "Hello", level: 1 },
      { name: "Développement web", level: 5 },
      { name: "Programmes de gestion de projet", level: 5 },
      { name: "Langages de programmation", level: 5 },
    ],
    languages: [],
    interests: [{ name: "Voyages" }, { name: "Photographie" }, { name: "Randonnée" }],
  })

  const [sectionOrder, setSectionOrder] = useState([
    "personal-info",
    "profile",
    "education",
    "experience",
    "skills",
    "languages",
    "interests",
  ])

  const [saveFormat, setSaveFormat] = useState<string>("pdf")
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const [showTemplateSelector, setShowTemplateSelector] = useState(true)
  const [template, setTemplate] = useState<"modern" | "classic" | "pro">("modern")

  const updateCVData = (section: string, data: any) => {
    setCvData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSave = () => {
    // This is a placeholder function. In a real application, this would trigger the actual save process.
    console.log(`Saving CV in ${saveFormat} format`)
  }

  const handleSaveToAccount = () => {
    // This is a placeholder function. In a real application, this would save to the user's account.
    console.log("Saving CV to user account")
  }

  const handleDownload = async (format: "pdf" | "jpeg" | "png") => {
    if (!previewRef.current) return

    try {
      const scale = 2 // Increase scale for better quality
      const canvas = await html2canvas(previewRef.current, {
        scale: scale,
        useCORS: true,
        logging: false,
      })

      if (format === "pdf") {
        const pdf = new jsPDF("p", "mm", "a4")
        const imgWidth = 210 // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        const pageHeight = 297 // A4 height in mm
        let heightLeft = imgHeight
        let position = 0

        pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, position, imgWidth, imgHeight, "", "FAST")
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, position, imgWidth, imgHeight, "", "FAST")
          heightLeft -= pageHeight
        }

        pdf.save("cv.pdf")
      } else {
        const link = document.createElement("a")
        link.download = `cv.${format}`
        link.href = canvas.toDataURL(`image/${format}`, 1.0)
        link.click()
      }
    } catch (error) {
      console.error("Error generating download:", error)
    }

    setShowDownloadOptions(false)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const sourceIndex = Number.parseInt(e.dataTransfer.getData("text/plain"), 10)
    const newOrder = [...sectionOrder]
    const [removed] = newOrder.splice(sourceIndex, 1)
    newOrder.splice(targetIndex, 0, removed)
    setSectionOrder(newOrder)
  }

  const handleTemplateSelect = (templateId: string) => {
    setTemplate(templateId as "modern" | "classic" | "pro")
    setShowTemplateSelector(false)
  }

  return (
    <main className="flex min-h-screen bg-gray-50">
      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        selectedTemplate={template}
        onSelectTemplate={handleTemplateSelect}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">CV Builder</h1>
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Change Template
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              {showDownloadOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => handleDownload("pdf")}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Download as PDF
                    </button>
                    <button
                      onClick={() => handleDownload("jpeg")}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Download as JPEG
                    </button>
                    <button
                      onClick={() => handleDownload("png")}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Download as PNG
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 space-y-4">
            {sectionOrder.map((section, index) => (
              <div
                key={section}
                className="border rounded-md overflow-hidden"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div
                  className="flex items-center justify-between p-4 bg-white cursor-pointer"
                  onClick={() => toggleSection(section)}
                >
                  <div className="flex items-center">
                    <GripVertical className="w-5 h-5 text-gray-400 mr-2 cursor-move" />
                    <span className="text-gray-400 mr-2">:</span>
                    <h2 className="text-lg font-medium">{getSectionTitle(section)}</h2>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-md hover:bg-gray-100">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-md hover:bg-gray-100">
                      {expandedSections[section] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                {expandedSections[section] && renderSectionContent(section, cvData, updateCVData)}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 overflow-y-auto bg-gray-50 flex justify-center">
          <div ref={previewRef} className="my-8">
            {template === "modern" ? (
              <CVPreview data={cvData} sectionOrder={sectionOrder} />
            ) : template === "classic" ? (
              <CVPreviewAlt data={cvData} sectionOrder={sectionOrder} />
            ) : (
              <CVPreviewPro data={cvData} sectionOrder={sectionOrder} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function getSectionTitle(section: string): string {
  switch (section) {
    case "personal-info":
      return "Informations personnelles"
    case "profile":
      return "Profil"
    case "education":
      return "Formation"
    case "experience":
      return "Expérience professionnelle"
    case "skills":
      return "Compétences"
    case "languages":
      return "Langues"
    case "interests":
      return "Centres d'intérêt"
    default:
      return ""
  }
}

function renderSectionContent(section: string, cvData: CVData, updateCVData: (section: string, data: any) => void) {
  switch (section) {
    case "personal-info":
      return <PersonalInfo data={cvData.personalInfo} updateData={(data) => updateCVData("personalInfo", data)} />
    case "profile":
      return <Profile data={cvData.profile} updateData={(data) => updateCVData("profile", data)} />
    case "education":
      return <Education data={cvData.education} updateData={(data) => updateCVData("education", data)} />
    case "experience":
      return <Experience data={cvData.experience} updateData={(data) => updateCVData("experience", data)} />
    case "skills":
      return <Skills data={cvData.skills} updateData={(data) => updateCVData("skills", data)} />
    case "languages":
      return <Languages data={cvData.languages} updateData={(data) => updateCVData("languages", data)} />
    case "interests":
      return <Interests data={cvData.interests} updateData={(data) => updateCVData("interests", data)} />
    default:
      return null
  }
}

