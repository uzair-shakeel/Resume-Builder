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
                {personalInfo.firstName} {personalInfo.lastName}
              </h2>
              <p className="text-lg opacity-90">{personalInfo.title}</p>
            </div>
            <div className="space-y-2 text-sm">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.address}</p>
              <p>
                {personalInfo.postalCode} {personalInfo.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[70mm] p-8">
        {/* Recipient Info */}
        <div className="mb-8">
          <p>{recipient.company}</p>
          <p>{recipient.name}</p>
          <p>{recipient.address}</p>
          <p>
            {recipient.postalCode} {recipient.city}
          </p>
        </div>

        {/* Date and Location */}
        <div className="mb-8 text-right">
          <p>
            {dateAndSubject.location}, le {dateAndSubject.date}
          </p>
        </div>

        {/* Subject */}
        <div className="mb-8">
          <p>
            <strong>Objet :</strong> {dateAndSubject.subject}
          </p>
        </div>

        {/* Letter Content */}
        <div className="space-y-4 text-justify">
          {page1Sections.map((section) => {
            if (section.startsWith("custom-")) {
              return (
                <div
                  key={section}
                  dangerouslySetInnerHTML={{
                    __html: customSections[section] || "",
                  }}
                />
              );
            }
            switch (section) {
              case "introduction":
                return (
                  <div
                    key={section}
                    dangerouslySetInnerHTML={{ __html: introduction }}
                  />
                );
              case "situation-actuelle":
                return (
                  <div
                    key={section}
                    dangerouslySetInnerHTML={{ __html: currentSituation }}
                  />
                );
              case "motivation":
                return (
                  <div
                    key={section}
                    dangerouslySetInnerHTML={{ __html: motivation }}
                  />
                );
              case "conclusion":
                return (
                  <div
                    key={section}
                    dangerouslySetInnerHTML={{ __html: conclusion }}
                  />
                );
              default:
                return null;
            }
          })}
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
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h2>
                  <p className="text-lg opacity-90">{personalInfo.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="ml-[70mm] p-8">
            {/* Page 2 Content */}
            <div className="space-y-4 text-justify">
              {page2Sections.map((section) => {
                if (section.startsWith("custom-")) {
                  return (
                    <div
                      key={section}
                      dangerouslySetInnerHTML={{
                        __html: customSections[section] || "",
                      }}
                    />
                  );
                }
                switch (section) {
                  case "introduction":
                    return (
                      <div
                        key={section}
                        dangerouslySetInnerHTML={{ __html: introduction }}
                      />
                    );
                  case "situation-actuelle":
                    return (
                      <div
                        key={section}
                        dangerouslySetInnerHTML={{ __html: currentSituation }}
                      />
                    );
                  case "motivation":
                    return (
                      <div
                        key={section}
                        dangerouslySetInnerHTML={{ __html: motivation }}
                      />
                    );
                  case "conclusion":
                    return (
                      <div
                        key={section}
                        dangerouslySetInnerHTML={{ __html: conclusion }}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
