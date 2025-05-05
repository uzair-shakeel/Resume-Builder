"use client";

import { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const resumeTemplates = [
  {
    id: 1,
    name: "Modern",
    value: "modern",
    type: "modern",
    image: "/assets/modern-cv.svg",
    defaultColor: "#953b2c",
  },
  {
    id: 2,
    name: "Classic",
    value: "classic",
    type: "classic",

    image: "/assets/classic.jpg",
    defaultColor: "#2c3e50",
  },
  {
    id: 3,
    name: "Pro",
    value: "pro",
    type: "pro",

    image: "/assets/professional.png",
    defaultColor: "#3498db",
  },
  {
    id: 4,
    name: "Sherlock",
    value: "sherlock",
    type: "sherlock",

    image: "/assets/resume3.png",
    defaultColor: "#34495e",
  },
  {
    id: 5,
    name: "HR",
    value: "hr",
    type: "hr",
    image: "/assets/hr.jpg",
    defaultColor: "#9b59b6",
  },
  {
    id: 6,
    name: "Circulaire",
    value: "circulaire",
    type: "circulaire",
    image: "/assets/circulaire.jpg",
    defaultColor: "#2BCBBA",
  },
  {
    id: 7,
    name: "Minimal",
    value: "minimal",
    type: "minimal",
    image: "/assets/minimal-resume.jpg",
    defaultColor: "#fd79a8",
  },
  {
    id: 8,
    name: "Teal",
    value: "teal",
    type: "teal",
    image: "/assets/teal.jpg",
    defaultColor: "#2BCBBA",
  },
  {
    id: 9,

    name: "Student",
    value: "student",
    type: "student",

    image: "/assets/student-resume.jpg",
    defaultColor: "#4dabf7",
  },
];

export default function ResumeSlider() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState<number | null>(null);

  // Current CV ID if editing an existing CV
  const cvId = searchParams.get("id");

  // Current template if one is selected
  const currentTemplate = searchParams.get("template");

  // Initialize the slider position based on URL template
  useEffect(() => {
    if (emblaApi && currentTemplate) {
      const templateIndex = resumeTemplates.findIndex(
        (t) => t.value === currentTemplate
      );
      if (templateIndex !== -1) {
        emblaApi.scrollTo(templateIndex);
      }
    }
  }, [emblaApi, currentTemplate]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleTemplateSelect = (template: (typeof resumeTemplates)[0]) => {
    if (isLoading) return; // Prevent multiple clicks

    setIsLoading(true);
    setLoadingTemplate(template.id);
    console.log(`Selected template from slider: ${template.value}`);

    // Force a hard navigation to ensure the template is loaded correctly
    // Include the CV ID if present to maintain editing state
    const url = cvId
      ? `/builder?id=${cvId}&template=${template.value}`
      : `/builder?template=${template.value}`;

    // Log the navigation for debugging
    console.log(`Navigating to: ${url}`);

    // Force a hard navigation
    window.location.href = url;
  };

  return (
    <section className="w-full mt-20 flex flex-col items-center text-center">
      <div className="w-full relative">
        {/* Navigation Buttons */}
        <button
          className="flex justify-center items-center shadow-md rounded-full opacity-90 p-1.5 md:p-3 bg-gray-800 hover:bg-gray-900 active:bg-gray-700 absolute top-1/2 -translate-y-1/2  left-1 md:left-8 z-10"
          onClick={scrollPrev}
          aria-label="Previous slide"
          disabled={isLoading}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          className="flex justify-center items-center shadow-md rounded-full opacity-90 p-1.5 md:p-3 bg-gray-800 hover:bg-gray-900 active:bg-gray-700 absolute top-1/2 -translate-y-1/2 right-1 md:right-8 z-10"
          onClick={scrollNext}
          aria-label="Next slide"
          disabled={isLoading}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex items-stretch py-2">
            {resumeTemplates.map((template) => (
              <div
                key={template.id}
                className={`relative flex-none w-[289.8px] h-[408.61px] md:w-[464px] md:h-[654.23px] rounded-md box-border group mr-5 ${
                  currentTemplate === template.value
                    ? "ring-4 ring-brand-500"
                    : ""
                }`}
              >
                <Image
                  src={template.image || "/placeholder.svg"}
                  alt={`CV template - ${template.name}`}
                  fill
                  className="w-full h-full object-cover rounded shadow-outlineDark overflow-hidden group-hover:shadow-outlineDark-lg"
                  sizes="(min-width: 768px) 768px, 1px"
                  loading="eager"
                  priority
                />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 py-10 hidden group-hover:block">
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="inline-flex border justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center bg-brand-500 active:bg-brand-300 active:bg-brand-300 text-white border-transparent hover:bg-brand-400 font-medium py-1 ps-3 pe-3 text-base"
                    disabled={isLoading}
                  >
                    {isLoading && loadingTemplate === template.id ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Chargement...
                      </span>
                    ) : (
                      t("site.home.hero.cta.secondary")
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
