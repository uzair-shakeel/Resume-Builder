import ResumeShowcase from "./ResumeShowcase";
import { Button } from "@/components/ui/button";

export default function MakeCVOnline() {
  return (
    <section className="bg-background relative py-16 lg:py-32">
      <div className="max-w-[1150px] w-full mx-auto px-5 flex justify-between gap-[40px]">
        {/* Left side content */}
        <div className="w-full flex flex-col items-center lg:items-start justify-center text-center lg:text-start lg:max-w-md">
          <h1 className="font-medium text-xl md:text-5xl leading-tight md:leading-tight text-gray-900 mb-3">
            Faire un CV en ligne
          </h1>
          <p className="text-lg text-gray-500 mb-10">
            Télécharger simple et facile un CV professionnel en quelques
            minutes.
          </p>
          <Button
            size="lg"
            className="inline-flex border justify-center rounded-brand relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center bg-brand-500 active:bg-brand-300 can-hover:active:bg-brand-300 text-white border-transparent can-hover:hover:bg-brand-400 font-medium py-3 ps-7 pe-7 text-lg"
          >
            Créer un CV
          </Button>
        </div>

        {/* Right side with animated resume templates */}
        <div className="w-full md:w-[40%] lg:block hidden">
          <ResumeShowcase />
        </div>
      </div>
    </section>
  );
}
