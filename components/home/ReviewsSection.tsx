"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Tulin Cosgun",
    text: "Grace a cette application j'ai pu faire mon cv sans faute d'orthographe et bien structuré. Ce qui m'a permis de postuler dans plusieurs postes.",
    rating: 5,
  },
  {
    name: "Moumen",
    text: "CV.fr m'a aidé à rédiger un curriculum vitae qui a de l'allure. En plus, il dispose de nombreuses fonctionnalités qui m'ont facilité la rédaction de ce dernier. Il m'a permis aussi de mettre en avant les points essentiels. Il dispose également de nombreux model a choisir ce qui convient a ton gout. Il offre aussi un model de lettre de motivation, des offres d'emploi et le suivi de ta candidature. En bref, cet outil est complet et je le recommande vivement.",
    rating: 5,
  },
  {
    name: "Jean-Philippe Becking",
    text: "Facile d'utilisation, choix des CV très bien et au résultat j'ai pu valider une formation.",
    rating: 5,
  },
  {
    name: "Marie Laurent",
    text: "Une excellente plateforme pour créer son CV professionnel. Interface intuitive et résultats impressionnants.",
    rating: 4,
  },
  {
    name: "Thomas Dubois",
    text: "Très satisfait du service. Les modèles sont modernes et faciles à personnaliser.",
    rating: 5,
  },
];

const autoplayOptions = {
  delay: 4000,
  rootNode: (emblaRoot: HTMLElement) => emblaRoot.parentElement,
};

// Create plugin instance outside component
const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false });

export default function ReviewsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
      watchDrag: false,
    },
    [autoplay]
  );

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <section className="bg-gray-900 py-10 md:py-24 text-white flex flex-col items-center overflow-hidden">
      <h2 className="text-4xl font-bold text-white text-center mb-4">
        Évaluations
      </h2>

      {/* Overall rating */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl font-bold text-white">4,3</span>
          <span className="text-xl text-gray-400">/ 5</span>
          <div className="flex gap-1 ml-2">
            {[1, 2, 3, 4].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-blue-500 text-blue-500" />
            ))}
            <Star className="w-6 h-6 fill-blue-500/50 text-blue-500" />
          </div>
        </div>
        <p className="text-gray-400">Basé sur 20 184 avis</p>
      </div>

      {/* Reviews carousel */}
      <div className="relative w-full mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex items-stretch">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex flex-none flex-col rounded shadow-lg bg-gray-800 w-96 md:w-[28rem] justify-start py-8 px-14 md:p-8 text-gray-300 hover:text-gray-100 mr-5"
              >
                <h3 className="text-white font-medium mb-2">{review.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-4">{review.text}</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < review.rating
                          ? "fill-blue-500 text-blue-500"
                          : "fill-gray-500/20 text-gray-500/20"
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-10 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Previous review"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-10 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Next review"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </section>
  );
}
