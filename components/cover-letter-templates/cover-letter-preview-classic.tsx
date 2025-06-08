import React, { useEffect, useRef, useState } from "react";
import type { CoverLetterData } from "@/types";
import Image from "next/image";

interface CoverLetterPreviewClassicProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
}

// Create a global variable to store the last valid data outside of component lifecycle
let globalClassicData: CoverLetterData | null = null;

export default function CoverLetterPreviewClassic({
  data,
  sectionOrder,
  accentColor = "#3498db",
  fontFamily = "Arial, sans-serif",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
}: CoverLetterPreviewClassicProps) {
  // State to track if this is the initial render
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // Keep a reference to the last valid data to prevent data loss during template transitions
  const lastValidDataRef = useRef<CoverLetterData>(data);
  
  // Function to check if data is valid (has at least some content)
  const isValidData = (
    checkData: CoverLetterData | null | undefined
  ): boolean => {
    if (!checkData) return false;
    
    // Check if any section has content
    return !!(
      (checkData.personalInfo &&
        Object.values(checkData.personalInfo).some((val) => val)) ||
      (checkData.recipient &&
        Object.values(checkData.recipient).some((val) => val)) ||
      (checkData.dateAndSubject &&
        Object.values(checkData.dateAndSubject).some((val) => val)) ||
      checkData.introduction ||
      checkData.currentSituation ||
      checkData.motivation ||
      checkData.conclusion
    );
  };
  
  // On mount, try to load data from localStorage if available
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("cover-letter-data");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (isValidData(parsedData)) {
          console.log("Classic template: Loaded data from localStorage");
          lastValidDataRef.current = parsedData;
          globalClassicData = parsedData;
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
    
    setIsInitialRender(false);
  }, []);
  
  // Update the ref and localStorage when data changes and is valid
  useEffect(() => {
    if (isValidData(data)) {
      console.log("Classic template: Valid data updated");
      lastValidDataRef.current = data;
      globalClassicData = data;
      
      // Store in localStorage for persistence across page refreshes
      try {
        localStorage.setItem("cover-letter-data", JSON.stringify(data));
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
      }
    } else {
      console.log("Classic template: Received invalid data, using cached data");
    }
  }, [data]);
  
  // Determine which data to use - with multiple fallbacks
  const determineDataToUse = (): CoverLetterData => {
    // First try the props data
    if (isValidData(data)) {
      return data;
    }
    
    // Then try the ref data
    if (isValidData(lastValidDataRef.current)) {
      console.log("Classic template: Using ref data");
      return lastValidDataRef.current;
    }
    
    // Then try the global data
    if (isValidData(globalClassicData) && globalClassicData !== null) {
      console.log("Classic template: Using global data");
      return globalClassicData;
    }
    
    // Finally, return empty data or the original data as last resort
    console.log("Classic template: No valid data found, using empty or original data");
    return data || ({} as CoverLetterData);
  };
  
  // Use determined data
  const safeData = determineDataToUse();

  const {
    personalInfo,
    recipient,
    dateAndSubject,
    introduction,
    currentSituation,
    motivation,
    conclusion,
  } = safeData || {};

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
        // Only render if custom section has content
        if (!customSections?.[section]) {
          return null;
        }

        return (
          <div key={section} className="mb-6 keep-together">
            <div
              dangerouslySetInnerHTML={{
                __html: customSections[section],
              }}
              className="text-sm section-content"
            />
          </div>
        );
      }

      switch (section) {
        case "destinataire":
          // Only render if recipient has data
          if (!recipient || Object.values(recipient).every((val) => !val)) {
            return null;
          }

          return (
            <div key={section} className="mt-6">
              <div className="space-y-4">
                <div className="text-gray-700">
                  {recipient?.company && (
                    <p className="font-medium">{recipient.company}</p>
                  )}
                  {recipient?.name && <p>{recipient.name}</p>}
                  {recipient?.address && <p>{recipient.address}</p>}
                  {(recipient?.postalCode || recipient?.city) && (
                    <p>
                      {recipient?.postalCode} {recipient?.city}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        case "date-et-objet":
          // Only render if dateAndSubject has data
          if (
            !dateAndSubject ||
            Object.values(dateAndSubject).every((val) => !val)
          ) {
            return null;
          }

          return (
            <div key={section} className="mt-8 mb-8">
              {dateAndSubject?.location || dateAndSubject?.date ? (
                <div className="text-right mb-4">
                  <p>
                    {dateAndSubject?.location && `${dateAndSubject.location}, `}
                    {dateAndSubject?.date
                      ? `le ${dateAndSubject.date}`
                      : `le ${new Date().toLocaleDateString("fr-FR")}`}
                  </p>
                </div>
              ) : null}

              {dateAndSubject?.subject && (
                <p className="font-medium">Objet : {dateAndSubject.subject}</p>
              )}
            </div>
          );
        case "introduction":
          // Only render if introduction has content
          if (!introduction) {
            return null;
          }

          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html: introduction,
                }}
                className="text-sm section-content"
              />
            </div>
          );
        case "situation-actuelle":
          // Only render if currentSituation has content
          if (!currentSituation) {
            return null;
          }

          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html: currentSituation,
                }}
                className="text-sm section-content"
              />
            </div>
          );
        case "motivation":
          // Only render if motivation has content
          if (!motivation) {
            return null;
          }

          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html: motivation,
                }}
                className="text-sm section-content"
              />
            </div>
          );
        case "conclusion":
          // Only render if conclusion has content
          if (!conclusion) {
            return null;
          }

          return (
            <div key={section} className="mb-6 keep-together">
              <div
                dangerouslySetInnerHTML={{
                  __html: conclusion,
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
        {/* Header with name - only show if name exists */}
        {(personalInfo?.firstName ||
          personalInfo?.lastName ||
          personalInfo?.title) && (
          <div className="mb-8">
            {(personalInfo?.firstName || personalInfo?.lastName) && (
              <h1 className="text-2xl font-bold" style={{ color: accentColor }}>
                {personalInfo?.firstName} {personalInfo?.lastName}
              </h1>
            )}
            {personalInfo?.title && (
              <p className="text-gray-600">{personalInfo.title}</p>
            )}
          </div>
        )}

        {/* Two-column layout */}
        <div className="flex gap-8">
          {/* Left column - Contact info - only show if contact info exists */}
          <div className="w-1/3">
            {(personalInfo?.email ||
              personalInfo?.phone ||
              personalInfo?.address ||
              personalInfo?.postalCode ||
              personalInfo?.city) && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b-2 cv-accent-border pb-2 mb-3 section-heading">
                  Contact
                </h2>
                <div className="space-y-2 section-content">
                  {personalInfo?.email && (
                    <div>
                      <p className="text-sm font-medium">Email:</p>
                      <p className="text-sm">{personalInfo.email}</p>
                    </div>
                  )}
                  {personalInfo?.phone && (
                    <div>
                      <p className="text-sm font-medium">Téléphone:</p>
                      <p className="text-sm">{personalInfo.phone}</p>
                    </div>
                  )}
                  {(personalInfo?.address ||
                    personalInfo?.postalCode ||
                    personalInfo?.city) && (
                    <div>
                      <p className="text-sm font-medium">Adresse:</p>
                      <p className="text-sm">
                        {personalInfo?.address && `${personalInfo.address}, `}
                        {personalInfo?.postalCode} {personalInfo?.city}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Letter content */}
          <div className="w-2/3">{renderSections(sections)}</div>
        </div>
      </div>
    </div>
  );

  // Log when template is rendering with data
  useEffect(() => {
    if (!isInitialRender) {
      console.log("Classic template rendering", {
        hasPersonalInfo: !!personalInfo,
        hasIntroduction: !!introduction,
        hasMotivation: !!motivation,
        dataSource: isValidData(data) ? "props" : "cached",
      });
    }
  }, [personalInfo, introduction, motivation, data, isInitialRender]);

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
