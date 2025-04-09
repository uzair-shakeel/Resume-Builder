"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

// Define review interface
interface Review {
  name: string;
  text: string;
  rating: number;
}

// Create plugin instance outside component
const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false });

export default function ReviewsSection() {
  const { t, language } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
      watchDrag: false,
    },
    [autoplay]
  );

  // Fetch reviews dynamically from translation file
  const reviewsRaw = t("site.home.reviews.items", { returnObjects: true });
  const reviews: Review[] = Array.isArray(reviewsRaw)
    ? reviewsRaw.map((item: any) => ({
        name: item.name,
        text: item.text,
        rating: item.rating,
      }))
    : [];

  // Log for debugging (remove in production)
  console.log("Language:", language);
  console.log("Reviews raw data:", reviewsRaw);
  console.log("Processed reviews:", reviews);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  // Calculate average rating (with fallback if reviews is empty)
  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (acc: number, review: Review) => acc + review.rating,
          0
        ) / reviews.length
      : 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const totalStars = 5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Image
          key={`full-${i}`}
          src="/assets/star-light.svg"
          alt={language === "fr" ? "étoile pleine" : "full star"}
          width={32}
          height={32}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Image
          key="half"
          src="/assets/halfstar-light.svg"
          alt={language === "fr" ? "demi-étoile" : "half star"}
          width={32}
          height={32}
        />
      );
    }

    const emptyStarsCount = totalStars - (fullStars + (hasHalfStar ? 1 : 0));
    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(
        <Image
          key={`empty-${i}`}
          src="/assets/star-dark.svg"
          alt={language === "fr" ? "étoile vide" : "empty star"}
          width={32}
          height={32}
        />
      );
    }

    return stars;
  };

  return (
    <section className="flex flex-col bg-[#1D1D20] py-10 md:py-24 text-white items-center overflow-hidden">
      <h2 className="text-3xl leading-normal md:text-5xl font-medium mb-10 sm:mb-6 text-center">
        {t("site.home.reviews.title")}
      </h2>

      {/* Overall rating */}
      <div className="flex items-center mb-12 flex-col">
        <div className="flex items-center gap-7 sm:text-3xl leading-normal mb-6">
          <span className="space-x-1 flex items-center gap-2">
            {t("site.home.reviews.metadata.average_rating")}{" "}
            {averageRating.toFixed(1)}{" "}
            {t("site.home.reviews.metadata.out_of_five")}
          </span>
          <div className="flex gap-1">{renderStars(averageRating)}</div>
        </div>
        <p className="mb-6 text-gray-400 text-base sm:text-lg">
          {t("site.home.reviews.metadata.based_on")} {reviews.length}{" "}
          {t("site.home.reviews.metadata.reviews_count")}
        </p>
      </div>

      {/* Reviews carousel */}
      <div className="relative w-full mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex items-stretch">
            {reviews.length > 0 ? (
              reviews.map((review: Review, index: number) => (
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
              ))
            ) : (
              <div className="text-center text-gray-400">
                {language === "fr"
                  ? "Aucun avis disponible pour le moment."
                  : "No reviews available at the moment."}
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons (hidden if no reviews) */}
        {reviews.length > 0 && (
          <>
            <button
              onClick={scrollPrev}
              className="flex justify-center items-center shadow-md rounded-full opacity-90 p-1.5 md:p-3 bg-gray-50 hover:bg-gray-100 active:bg-brand-50 absolute top-1/2 -translate-y-1/2 -scale-x-100 left-1 md:left-8"
              aria-label={
                language === "fr" ? "Avis précédent" : "Previous review"
              }
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={scrollNext}
              className="flex justify-center items-center shadow-md rounded-full opacity-90 p-1.5 md:p-3 bg-gray-50 hover:bg-gray-100 active:bg-brand-50 absolute top-1/2 -translate-y-1/2 right-1 md:right-8"
              aria-label={language === "fr" ? "Avis suivant" : "Next review"}
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}
      </div>

      <div className="text-center mt-10">
        <a
          href="#"
          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
        >
          {t("site.home.reviews.metadata.view_all")}
        </a>
      </div>
    </section>
  );
}
