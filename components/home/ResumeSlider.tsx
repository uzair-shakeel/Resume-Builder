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
    image: "/assets/resume3.png",
    type: "sherlock",
  },
  {
    id: 5,
    name: "HR Professional",
    image: "/assets/hr-resume.jpg",
    type: "hr",
  },
  {
    id: 6,
    name: "Minimal Pink",
    image: "/assets/resume 5.png",
    type: "minimal",
  },
  {
    id: 7,
    name: "Medical Teal",
    image: "/assets/resume6.png",
    type: "teal",
  },
  {
    id: 8,
    name: "Simple Classic",
    image: "/assets/classic-resume.jpg",
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
    loop: false,
    align: "start",
    slidesToScroll: 1,
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
    <section className="w-full py-12 md:py-16 bg-gray-50">
      <div className="w-full px-4 md:px-8 relative">
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 focus:outline-none"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 focus:outline-none"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden mx-4" ref={emblaRef}>
            <div className="flex -ml-4">
              {resumeTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex-[0_0_33.33%] min-w-0 pl-4 pr-4 md:pl-6 md:pr-6"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden group relative">
                    <div className="relative aspect-[0.7]">
                      <Image
                        src={template.image || "/placeholder.svg"}
                        alt={`CV template - ${template.name}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => handleTemplateSelect(template)}
                          className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Use this template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
