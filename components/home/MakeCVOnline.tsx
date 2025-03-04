import ResumeShowcase from "./ResumeShowcase";
import { Button } from "@/components/ui/button";

export default function MakeCVOnline() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row items-center">
      {/* Left side content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
          Faire un CV en ligne
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-md">
          Télécharger simple et facile un CV professionnel en quelques minutes.
        </p>
        <div className="mt-10">
          <Button
            size="lg"
            className="bg-[#2563EB] hover:bg-blue-700 text-white text-lg px-8 py-6 h-auto"
          >
            Créer un CV
          </Button>
        </div>
      </div>

      {/* Right side with animated resume templates */}
      <div className="w-full md:w-1/2 h-screen bg-gray-50">
        <ResumeShowcase />
      </div>
    </main>
  );
}
