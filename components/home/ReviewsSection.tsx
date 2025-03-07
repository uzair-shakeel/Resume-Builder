"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    name: "Tulin Cosgun",
    text: "Grace a cette application j'ai pu faire mon cv sans faute d'orthographe et bien structuré. Ce qui m'a permis de postuler dans plusieurs postes.",
    rating: 5,
  },
  {
    name: "Moumen",
    text: "CV.fr m'a aidé a rédiger un curriculum vitae qui a de l'allure. En plus, il dispose de nombreuses fonctionnalités qui m'ont facilité la rédaction de ce dernier. Il m'a permis aussi de mettre en avant les points essentiels. Il dispose également de nombreux model a choisir ce qui convient a ton gout. Il offre aussi un model de lettre de motivation, des offres d'emploi et le suivi de ta candidature. En bref, cet outil est complet et je le recommande vivement.",
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

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const totalStars = 5;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Image
        key={`full-${i}`}
        src="/assets/star-light.svg"
        alt="full star"
        width={32}
        height={32}
      />
    );
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <Image
        key="half"
        src="/assets/halfstar-light.svg"
        alt="half star"
        width={32}
        height={32}
      />
    );
  }

  // Add empty stars
  const emptyStarsCount = totalStars - (fullStars + (hasHalfStar ? 1 : 0));
  for (let i = 0; i < emptyStarsCount; i++) {
    stars.push(
      <Image
        key={`empty-${i}`}
        src="/assets/star-dark.svg"
        alt="empty star"
        width={32}
        height={32}
      />
    );
  }

  return stars;
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
    <section className="flex flex-col bg-[#1D1D20] py-10 md:py-24 text-white items-center overflow-hidden">
      <h2 className="text-3xl leading-normal md:text-5xl font-medium mb-10 sm:mb-6 text-center">
        Évaluations
      </h2>

      {/* Overall rating */}
      <div className="flex items-center mb-12 flex-col">
        <div className="flex items-center gap-7 sm:text-3xl leading-normal mb-6">
          <span className="space-x-1 flex items-center gap-2">
            4,3
            <span className="text-gray-400">/ 5</span>
          </span>
          <div className="flex gap-1">{renderStars(4.3)}</div>
        </div>
        <p className="mb-6 text-gray-400 text-base sm:text-lg">
          Basé sur 20 184 avis
        </p>
      </div>

      {/* Reviews carousel */}
      <div className="relative w-full mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex items-stretch">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex flex-none flex-col rounded shadow-lg bg-[#2E2E33] w-96 md:w-[32rem] justify-start py-8 px-14 md:p-8 text-gray-300 hover:text-gray-100 mr-5"
              >
                <h3 className="text-xl font-medium mb-3">{review.name}</h3>
                <p className="text-lg mb-3">{review.text}</p>
                <div className="flex py-1 gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={scrollPrev}
          className="flex justify-center items-center shadow-md rounded-full opacity-90 p-1.5 md:p-3 bg-gray-50 hover:bg-gray-100 active:bg-brand-50 absolute top-1/2 -translate-y-1/2 -scale-x-100 left-1 md:left-8"
          aria-label="Previous review"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
        <button
          onClick={scrollNext}
          className="flex justify-center items-center shadow-md rounded-full opacity-90 p-1.5 md:p-3 bg-gray-50 hover:bg-gray-100 active:bg-brand-50 absolute top-1/2 -translate-y-1/2 right-1 md:right-8"
          aria-label="Next review"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </section>
  );
}
