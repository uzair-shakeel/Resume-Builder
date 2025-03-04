"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const resumeTemplates = [
  {
    id: 1,
    name: "Template Blue",
    image: "/assets/resume1.png",
  },
  {
    id: 2,
    name: "Template Navy",
    image: "/assets/resume2.jpg",
  },
  {
    id: 3,
    name: "Template Teal",
    image: "/assets/resume3.png",
  },
  {
    id: 4,
    name: "Template Modern",
    image: "/assets/resume4.png",
  },
  {
    id: 5,
    name: "Template Creative",
    image: "/assets/resume5.svg",
  },
];

export default function ResumeSlider() {
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

  return (
    <section className="w-full py-12 md:py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
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
                        <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          Utiliser ce modèle
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
