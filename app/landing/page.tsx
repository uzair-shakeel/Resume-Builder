import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import HowDoesItWork from "@/components/home/HowDoesItWork";
import ResumeSlider from "@/components/home/ResumeSlider";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <ResumeSlider />
      <HowDoesItWork />
    </main>
  );
}
