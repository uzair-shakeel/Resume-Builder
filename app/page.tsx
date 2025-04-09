import Header from "@/components/shared/Header";
import Hero from "@/components/home/Hero";
import ResumeSlider from "@/components/home/ResumeSlider";
import StepSlider from "@/components/home/HowDoesItWork/StepSlider";
import FeaturesSlider from "@/components/home/Features/FeaturesSlider";
import ReviewsSection from "@/components/home/ReviewsSection";
import FAQ from "@/components/shared/FAQ";
import MakeCVOnline from "@/components/home/MakeCVOnline";
import Footer from "@/components/shared/Footer";
import Link from "next/link";

export default function Home() {
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
