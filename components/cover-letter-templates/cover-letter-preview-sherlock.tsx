import React, { useEffect, useRef, useState } from "react";
import type { CoverLetterData } from "@/types";
import {
  Mail,
  Phone,
  MapPin,
  Home,
  Briefcase,
  Calendar,
  FileText,
} from "lucide-react";

interface CoverLetterPreviewSherlockProps {
  data: CoverLetterData;
  sectionOrder: string[];
  accentColor: string;
  fontFamily: string;
  sectionPages: Record<string, number>;
  customSectionNames: Record<string, string>;
  customSections?: Record<string, string>;
  language?: string;
}

// Create a global variable to store the last valid data outside of component lifecycle
let globalSherlockData: CoverLetterData | null = null;

export default function CoverLetterPreviewSherlock({
  data,
  sectionOrder,
  accentColor = "#3498db",
  fontFamily = "'DejaVu Sans', sans-serif",
  sectionPages = {},
  customSectionNames = {},
  customSections = {},
  language = "fr",
}: CoverLetterPreviewSherlockProps) {
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
          console.log("Sherlock template: Loaded data from localStorage");
          lastValidDataRef.current = parsedData;
          globalSherlockData = parsedData;
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
      console.log("Sherlock template: Valid data updated");
      lastValidDataRef.current = data;
      globalSherlockData = data;

      // Store in localStorage for persistence across page refreshes
      try {
        localStorage.setItem("cover-letter-data", JSON.stringify(data));
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
      }
    } else {
      console.log(
        "Sherlock template: Received invalid data, using cached data"
      );
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
      console.log("Sherlock template: Using ref data");
      return lastValidDataRef.current;
    }

    // Then try the global data
    if (isValidData(globalSherlockData) && globalSherlockData !== null) {
      console.log("Sherlock template: Using global data");
      return globalSherlockData;
    }

    // Finally, return empty data or the original data as last resort
    console.log(
      "Sherlock template: No valid data found, using empty or original data"
    );
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
          <div key={section} className="mb-8">
            <h2 className="text-lg font-semibold uppercase mb-4 border-b border-gray-300 pb-1">
              {getSectionTitle(section)}
            </h2>
            <div
              dangerouslySetInnerHTML={{
                __html: customSections[section],
              }}
              className="text-sm"
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
            <div key={section} className="mb-6">
              <div className="space-y-4">
                <div className="text-gray-700">
                  {(dateAndSubject?.location || dateAndSubject?.date) && (
                    <p className="flex items-end justify-end">
                      {dateAndSubject?.location &&
                        `${dateAndSubject.location}, `}
                      {dateAndSubject?.date
                        ? `le ${dateAndSubject.date}`
                        : `le ${new Date().toLocaleDateString(
                            language === "fr" ? "fr-FR" : "en-US"
                          )}`}
                    </p>
                  )}
                  {dateAndSubject?.subject && (
                    <p className="font-bold mt-2">{dateAndSubject.subject}</p>
                  )}
                </div>
              </div>
            </div>
          );
        case "introduction":
          // Only render if introduction has content
          if (!introduction) {
            return null;
          }

          return (
            <div key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: introduction,
                }}
                className="text-sm"
              />
            </div>
          );
        case "situation-actuelle":
          // Only render if currentSituation has content
          if (!currentSituation) {
            return null;
          }

          return (
            <div key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: currentSituation,
                }}
                className="text-sm"
              />
            </div>
          );
        case "motivation":
          // Only render if motivation has content
          if (!motivation) {
            return null;
          }

          return (
            <div key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: motivation,
                }}
                className="text-sm"
              />
            </div>
          );
        case "conclusion":
          // Only render if conclusion has content
          if (!conclusion) {
            return null;
          }

          return (
            <div key={section} className="mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: conclusion,
                }}
                className="text-sm"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  // Log when template is rendering with data
  useEffect(() => {
    if (!isInitialRender) {
      console.log("Sherlock template rendering", {
        hasPersonalInfo: !!personalInfo,
        hasIntroduction: !!introduction,
        hasMotivation: !!motivation,
        dataSource: isValidData(data) ? "props" : "cached",
      });
    }
  }, [personalInfo, introduction, motivation, data, isInitialRender]);

  return (
    <div className="cv-page w-[210mm] h-[297mm] relative bg-white shadow-lg mx-auto overflow-hidden">
      <div className="flex h-full">
        {/* Left sidebar */}
        <div
          className="w-1/3 h-full p-6 text-white"
          style={{ backgroundColor: accentColor }}
        >
          {/* Personal Info */}
          <div className="mb-8">
            {personalInfo?.photo && (
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30">
                <img
                  src={personalInfo.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {(personalInfo?.firstName || personalInfo?.lastName) && (
              <h2 className="text-xl font-bold uppercase tracking-wider mb-2 text-center">
                {personalInfo?.firstName} {personalInfo?.lastName}
              </h2>
            )}
            {personalInfo?.title && (
              <p className="text-center text-sm uppercase tracking-wider mb-4 opacity-90">
                {personalInfo.title}
              </p>
            )}
            {(personalInfo?.email ||
              personalInfo?.phone ||
              personalInfo?.address ||
              personalInfo?.postalCode ||
              personalInfo?.city) && (
              <div className="border-t border-white/20 pt-4 mt-4">
                {personalInfo?.email && (
                  <div className="flex items-center mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    <p className="text-sm">{personalInfo.email}</p>
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    <p className="text-sm">{personalInfo.phone}</p>
                  </div>
                )}
                {(personalInfo?.address ||
                  personalInfo?.postalCode ||
                  personalInfo?.city) && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <p className="text-sm">
                      {personalInfo?.address && `${personalInfo.address}, `}
                      {personalInfo?.postalCode} {personalInfo?.city}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="w-2/3 p-6">
          <div className="flex justify-between">
            {/* Name and title */}
            {(personalInfo?.firstName ||
              personalInfo?.lastName ||
              personalInfo?.title) && (
              <div className="w-1/3 mb-8">
                {(personalInfo?.firstName || personalInfo?.lastName) && (
                  <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">
                    {personalInfo?.firstName} {personalInfo?.lastName}
                  </h1>
                )}
                {personalInfo?.title && (
                  <p className="text-sm uppercase tracking-wider text-gray-800">
                    {personalInfo.title}
                  </p>
                )}
              </div>
            )}

            {/* Contact info */}
            {(personalInfo?.address ||
              personalInfo?.city ||
              personalInfo?.postalCode ||
              personalInfo?.phone ||
              personalInfo?.email) && (
              <div className="mb-8">
                {(personalInfo?.address ||
                  personalInfo?.city ||
                  personalInfo?.postalCode) && (
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <p className="text-sm text-gray-700">
                      {personalInfo?.address && `${personalInfo.address}, `}
                      {personalInfo?.city && personalInfo.city}
                      {personalInfo?.postalCode &&
                        `, ${personalInfo.postalCode}`}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                {personalInfo?.phone && (
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <p className="text-sm text-gray-700">
                      {personalInfo.phone}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                      <Phone className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                {personalInfo?.email && (
                  <div className="flex items-center justify-end gap-3">
                    <p className="text-sm text-gray-700">
                      {personalInfo.email}
                    </p>
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                      <Mail className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Letter Content */}
          {renderSections(page1Sections)}
        </div>
      </div>

      {/* Page 2 if needed */}
      {hasPage2 && (
        <div className="cv-page w-[210mm] h-[297mm] relative bg-white shadow-lg mx-auto overflow-hidden page-break-before">
          <div className="flex h-full">
            {/* Left sidebar */}
            <div
              className="w-1/3 h-full p-6 text-white"
              style={{ backgroundColor: accentColor }}
            >
              {/* Personal Info - simplified for page 2 */}
              {(personalInfo?.firstName ||
                personalInfo?.lastName ||
                personalInfo?.title) && (
                <div className="mb-8">
                  {(personalInfo?.firstName || personalInfo?.lastName) && (
                    <h2 className="text-xl font-bold uppercase tracking-wider mb-2 text-center">
                      {personalInfo?.firstName} {personalInfo?.lastName}
                    </h2>
                  )}
                  {personalInfo?.title && (
                    <p className="text-center text-sm uppercase tracking-wider mb-4 opacity-90">
                      {personalInfo.title}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Main content */}
            <div className="w-2/3 p-6">
              {(personalInfo?.firstName ||
                personalInfo?.lastName ||
                personalInfo?.title) && (
                <div className="flex justify-between mb-6">
                  {/* Name and title */}
                  <div className="w-1/3">
                    {(personalInfo?.firstName || personalInfo?.lastName) && (
                      <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">
                        {personalInfo?.firstName} {personalInfo?.lastName}
                      </h1>
                    )}
                    {personalInfo?.title && (
                      <p className="text-sm uppercase tracking-wider text-gray-800">
                        {personalInfo.title}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Page 2 Content */}
              {renderSections(page2Sections)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
