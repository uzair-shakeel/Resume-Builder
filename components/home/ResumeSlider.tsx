"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const resumeTemplates = [
  {
    id: 1,
    name: "Template Blue",
    image: "/assets/resume1.png",
    type: "modern",
  },
  {
    id: 2,
    name: "Template Navy",
    image: "/assets/resume2.jpg",
    type: "classic",
  },
  {
    id: 3,
    name: "Template Teal",
    image: "/assets/resume3.png",
    type: "pro",
  },
  {
    id: 4,
    name: "Sherlock Holmes",
    image: "/assets/resume4.png",
    type: "sherlock",
  },
  {
    id: 5,
    name: "HR Professional",
    image: "/assets/resume5.svg",
    type: "hr",
  },
  {
    id: 6,
    name: "Minimal Pink",
    image: "/assets/resume1.png",
    type: "minimal",
  },
  {
    id: 7,
    name: "Medical Teal",
    image: "/assets/resume2.jpg",
    type: "teal",
  },
  {
    id: 8,
    name: "Simple Classic",
    image: "/assets/resume3.png",
    type: "simple-classic",
  },
  {
    id: 9,
    name: "Template Modern",
    image: "/assets/resume4.png",
    type: "modern",
  },
  {
    id: 10,
    name: "Template Creative",
    image: "/assets/resume5.svg",
    type: "classic",
  },
];

export default function ResumeSlider() {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleTemplateSelect = (template: (typeof resumeTemplates)[0]) => {
    router.push(`/builder?template=${template.type}`);
  };

  return (
    <section className="w-full mt-20 flex flex-col items-center text-center">
      <div className="w-full relative">
        {/* Navigation Buttons */}
        <button
          className="flex justify-center items-center shadow-md rounded-full opacity-90 p-1.5 md:p-3 bg-gray-800 hover:bg-gray-900 active:bg-gray-700 absolute top-1/2 -translate-y-1/2  left-1 md:left-8 z-10"
          onClick={scrollPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          className="flex justify-center items-center shadow-md rounded-full opacity-90 p-1.5 md:p-3 bg-gray-800 hover:bg-gray-900 active:bg-gray-700 absolute top-1/2 -translate-y-1/2 right-1 md:right-8 z-10"
          onClick={scrollNext}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex items-stretch py-2">
            {resumeTemplates.map((template) => (
              <div
                key={template.id}
                className="relative flex-none w-[289.8px] h-[408.61px] md:w-[464px] md:h-[654.23px] rounded-md box-border group mr-5"
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
                  >
                    Utiliser ce modèle
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
