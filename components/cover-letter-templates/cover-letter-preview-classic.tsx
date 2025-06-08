import React from "react";
import type { CoverLetterData } from "@/types";
import Image from "next/image";
import { placeholderData, getPlaceholderOrValue } from "@/lib/utils";

interface CoverLetterPreviewClassicProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
}

export default function CoverLetterPreviewClassic({
  data,
  sectionOrder,
  accentColor = "#3498db",
  fontFamily = "Arial, sans-serif",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
}: CoverLetterPreviewClassicProps) {
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
        case "destinataire":
          return (
            <div className="mt-6">
              <div className="space-y-4">
                <div className="text-gray-700">
                  <p className="font-medium">
                    {recipient?.company || "Entreprise XYZ"}
                  </p>
                  <p>{recipient?.name || "Responsable Recrutement"}</p>
                  <p>{recipient?.address || "456 Avenue Business"}</p>
                  <p>
                    {recipient?.postalCode || "75001"}{" "}
                    {recipient?.city || "Paris"}
                  </p>
                </div>
              </div>
            </div>
          );
        case "date-et-objet":
          return (
            <div key={section} className="mt-8 mb-8">
              <div className="text-right mb-4">
                <p>
                  {dateAndSubject?.location || "Paris"}, le{" "}
                  {dateAndSubject?.date ||
                    new Date().toLocaleDateString("fr-FR")}
                </p>
              </div>
              <p className="font-medium">
                Objet :{" "}
                {dateAndSubject?.subject ||
                  "Candidature pour le poste de [Poste]"}
              </p>
            </div>
          );
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

  const renderPage = (sections: string[]) => (
    <div className="cv-page">
      <div className="cv-page-content p-8">
        {/* Header with name */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: accentColor }}>
            {personalInfo?.firstName || "John"}{" "}
            {personalInfo?.lastName || "Doe"}
          </h1>
          <p className="text-gray-600">
            {personalInfo?.title || "Professional Title"}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-8">
          {/* Left column - Contact info */}
          <div className="w-1/3">
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                Contact
              </h2>
              <div className="space-y-2 section-content">
                <div>
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm">
                    {personalInfo?.email || "email@example.com"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Téléphone:</p>
                  <p className="text-sm">
                    {personalInfo?.phone || "+33 6 12 34 56 78"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Adresse:</p>
                  <p className="text-sm">
                    {personalInfo?.address || "123 Rue Example"},{" "}
                    {personalInfo?.postalCode || "75000"}{" "}
                    {personalInfo?.city || "Paris"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Letter content */}
          <div className="w-2/3">{renderSections(sections)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cv-container">
      {/* Page 1 */}
      {renderPage(page1Sections)}

      {/* Page 2 (if needed) */}
      {hasPage2 && (
        <div className="mt-8 print:mt-0">{renderPage(page2Sections)}</div>
      )}

      <style jsx>{`
        .cv-page {
          width: 210mm;
          min-height: 297mm;
          position: relative;
          margin: 0 auto;
          background: white;
          padding: 20mm;
        }
        .cv-page-content {
          min-height: 257mm;
        }
        @media print {
          .cv-page + .cv-page {
            page-break-before: always;
          }
        }
        .cv-accent-border {
          border-color: ${accentColor};
        }
        .cv-accent-bg {
          background-color: ${accentColor};
        }
        .cv-accent-color {
          color: ${accentColor};
        }
        .keep-together {
          page-break-inside: avoid;
        }
      `}</style>
    </div>
  );
}
