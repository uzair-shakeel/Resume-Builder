import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Image from "next/image";

const templates = [
  {
    id: "circulaire",
    title: "Circulaire",
    description:
      "Le style de ce modèle de CV contemporain est idéal pour mettre en valeur vos compétences.",
    image: "/assets/resume1.png",
    color: "teal",
  },
  {
    id: "professionnel",
    title: "Professionnel",
    description: "Modèle de CV évocateur de tradition et de précision.",
    image: "/assets/resume2.jpg",
    color: "navy",
  },
  {
    id: "vertical",
    title: "Vertical",
    description:
      "Combinaison de contraste et structure pour un modèle de CV qui attire l'attention.",
    image: "/assets/resume3.png",
    color: "purple",
  },
  {
    id: "circulaire",
    title: "Circulaire",
    description:
      "Le style de ce modèle de CV contemporain est idéal pour mettre en valeur vos compétences.",
    image: "/assets/resume4.png",
    color: "teal",
  },
  {
    id: "professionnel",
    title: "Professionnel",
    description: "Modèle de CV évocateur de tradition et de précision.",
    image: "/assets/resume5.svg",
    color: "navy",
  },
  {
    id: "vertical",
    title: "Vertical",
    description:
      "Combinaison de contraste et structure pour un modèle de CV qui attire l'attention.",
    image: "/assets/resume1.png",
    color: "purple",
  },
];

export default function CVTemplates() {
  return (
    <main>
      <Header />
      <section className="py-16 bg-[#f9f9f8]">
        <div className="max-w-[1150px] mx-auto px-[20px]">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Modèles de CV et mise en page
            </h1>
            <p className="text-gray-600 mb-8">
              Valorisez votre profil en choisissant parmi une sélection de
              modèles de CV professionnels.
            </p>
            <p className="text-gray-600 text-lg">
              Tirez avantage de nos modèles de CV pour vous démarquer des autres
              candidats. Design contemporain, graphisme marqué ou encore choix
              du minimalisme, de nombreuses options s'offrent à vous pour créer
              un CV de qualité qui attirera l'attention des recruteurs, tout en
              soulignant vos compétences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="flex flex-col">
                {/* Template Preview */}
                <div className="relative aspect-[3/4] w-full mb-4 rounded-lg overflow-hidden group">
                  <Image
                    src={template.image || "/placeholder.svg"}
                    alt={`Template ${template.title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Utiliser ce modèle
                    </button>
                  </div>
                </div>

                {/* Template Info */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    {template.title}
                  </h3>
                  <p className="text-gray-600">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
