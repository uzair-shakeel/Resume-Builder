import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import ResumeSlider from "@/components/home/ResumeSlider";
import StepSlider from "@/components/home/HowDoesItWork/StepSlider";
import FeaturesSlider from "@/components/home/Features/FeaturesSlider";
import ReviewsSection from "@/components/home/ReviewsSection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <ResumeSlider />
      <StepSlider />
      <FeaturesSlider />
      <ReviewsSection />
    </main>
  );
}
