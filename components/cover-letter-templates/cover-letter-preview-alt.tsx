import React from "react";
import type { CoverLetterData } from "@/types";
import Image from "next/image";
import { Mail, Phone, MapPin, Home } from "lucide-react";
import { placeholderData, getPlaceholderOrValue } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CoverLetterPreviewAltProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
}

export default function CoverLetterPreviewAlt({
  data,
  sectionOrder,
  accentColor,
  fontFamily,
  sectionPages,
  customSectionNames,
  customSections = {},
}: CoverLetterPreviewAltProps) {
  const {
    personalInfo,
    recipient,
    dateAndSubject,
    introduction,
    currentSituation,
    motivation,
    conclusion,
  } = data;

  // Filter sections for page 1 and page 2
  const page1Sections = sectionOrder.filter(
    (section) => !sectionPages[section] || sectionPages[section] === 1
  );
  const page2Sections = sectionOrder.filter(
    (section) => sectionPages[section] === 2
  );
  const hasPage2 = page2Sections.length > 0;

  // Get section title
  const getSectionTitle = (section: string): string => {
    if (customSectionNames[section]) {
      return customSectionNames[section];
    }

    switch (section) {
      case "introduction":
        return "Introduction";
      case "situation-actuelle":
        return "Situation Actuelle";
      case "motivation":
        return "Motivation";
      case "conclusion":
        return "Conclusion";
      default:
        return section;
    }
  };

  // Render content sections
  const renderSections = (sections: string[]) => {
    return sections.map((section) => {
      if (section === "personal-info") {
        return null;
      }

      if (section.startsWith("custom-")) {
        return (
          <div key={section} className="mb-6 keep-together">
            <div
              dangerouslySetInnerHTML={{
                __html: customSections[section] || "",
              }}
              className="text-sm section-content"
            />
          </div>
        );
      }

      switch (section) {
        case "introduction":
          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    introduction ||
                    "Je me permets de vous écrire concernant le poste de [Poste] que vous proposez. Ayant découvert votre annonce sur [Site], je souhaite vous faire part de ma candidature.",
                }}
                className="text-sm section-content"
              />
            </div>
          );
        case "situation-actuelle":
          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    currentSituation ||
                    "Actuellement [Poste actuel] chez [Entreprise] à [Ville], je suis en charge de [Responsabilités]. Cette expérience m'a permis de développer de solides compétences en [Compétences clés].",
                }}
                className="text-sm section-content"
              />
            </div>
          );
        case "motivation":
          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    motivation ||
                    "Votre entreprise m'intéresse particulièrement pour [Aspect spécifique]. Mes compétences en [Compétences clés] et mon expertise en [Domaine d'expertise] seraient des atouts pour contribuer aux [Projets/Objectifs de l'entreprise].",
                }}
                className="text-sm section-content"
              />
            </div>
          );
        case "conclusion":
          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    conclusion ||
                    "Je me tiens à votre disposition pour échanger plus en détail sur ma candidature lors d'un entretien. Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
                }}
                className="text-sm section-content"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="cv-page w-[210mm] h-[297mm] relative bg-white shadow-lg mx-auto overflow-hidden">
      {/* Left Sidebar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[70mm]"
        style={{ backgroundColor: accentColor }}
      >
        <div className="p-6 text-white">
          {/* Personal Info */}
          <div className="space-y-4">
            {personalInfo.photo && (
              <div className="w-32 h-32 mx-auto mb-6">
                <img
                  src={personalInfo.photo}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            )}
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                {personalInfo.firstName || "John"}{" "}
                {personalInfo.lastName || "Doe"}
              </h2>
              <p className="text-lg opacity-90">
                {personalInfo.title || "Professional Title"}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p>{personalInfo.email || "email@example.com"}</p>
              <p>{personalInfo.phone || "+33 6 12 34 56 78"}</p>
              <p>{personalInfo.address || "123 Rue Example"}</p>
              <p>
                {personalInfo.postalCode || "75000"}{" "}
                {personalInfo.city || "Paris"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[70mm] p-8">
        {/* Recipient Info */}
        <div className="mb-8">
          <p>{recipient.company || "Entreprise XYZ"}</p>
          <p>{recipient.name || "Responsable Recrutement"}</p>
          <p>{recipient.address || "456 Avenue Business"}</p>
          <p>
            {recipient.postalCode || "75001"} {recipient.city || "Paris"}
          </p>
        </div>

        {/* Date and Location */}
        <div className="mb-8 text-right">
          <p>
            {dateAndSubject.location || "Paris"}, le{" "}
            {dateAndSubject.date || new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        {/* Subject */}
        <div className="mb-8">
          <p>
            {dateAndSubject.subject || "Candidature pour le poste de [Poste]"}
          </p>
        </div>

        {/* Letter Content */}
        <div className="space-y-4 text-justify">
          {renderSections(page1Sections)}
        </div>
      </div>

      {/* Page 2 if needed */}
      {hasPage2 && (
        <div className="cv-page w-[210mm] h-[297mm] relative bg-white shadow-lg mx-auto overflow-hidden page-break-before">
          {/* Left Sidebar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[70mm]"
            style={{ backgroundColor: accentColor }}
          >
            <div className="p-6 text-white">
              {/* Personal Info */}
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">
                    {personalInfo.firstName || "John"}{" "}
                    {personalInfo.lastName || "Doe"}
                  </h2>
                  <p className="text-lg opacity-90">
                    {personalInfo.title || "Professional Title"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="ml-[70mm] p-8">
            {/* Page 2 Content */}
            <div className="space-y-4 text-justify">
              {renderSections(page2Sections)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
