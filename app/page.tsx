"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/shared/Header";
import Hero from "@/components/home/Hero";
import ResumeSlider from "@/components/home/ResumeSlider";
import StepSlider from "@/components/home/HowDoesItWork/StepSlider";
import FeaturesSlider from "@/components/home/Features/FeaturesSlider";
import ReviewsSection from "@/components/home/ReviewsSection";
import FAQ from "@/components/shared/FAQ";
import MakeCVOnline from "@/components/home/MakeCVOnline";
import Footer from "@/components/shared/Footer";

function HomeContent() {
  const searchParams = useSearchParams();
  // ... rest of your component logic

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-background w-full pt-32 pb-16">
        <Hero />
        <ResumeSlider />
      </div>
      <StepSlider />
      <FeaturesSlider />
      <ReviewsSection />
      <FAQ useTrans={true} />
      <MakeCVOnline />
      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
