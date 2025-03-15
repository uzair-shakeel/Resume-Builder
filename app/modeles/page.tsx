import FAQ from "@/components/shared/FAQ";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import Image from "next/image";
import Link from "next/link";
import modelesFaqData from "@/data/modelesFaqData";

const templates = [
  {
    id: "circulaire",
    title: "Circulaire",
    description:
      "Le style de ce modèle de CV contemporain est idéal pour mettre en valeur vos compétences.",
    image: "/assets/circulaire.jpg",
    color: "teal",
  },
  {
    id: "professionnel",
    title: "Professionnel",
    description: "Modèle de CV évocateur de tradition et de précision.",
    image: "/assets/professional.png",
    color: "navy",
  },
  {
    id: "vertical",
    title: "Vertical",
    description:
      "Combinaison de contraste et structure pour un modèle de CV qui attire l'attention.",
    image: "/assets/student-resume.jpg",
    color: "purple",
  },
  {
    id: "horizontal",
    title: "Horizontal",
    description:
      "La simplicité et la mise en valeur du contenu caractérisent ce modèle de CV.",
    image: "/assets/minimal-resume.jpg",
    color: "teal",
  },
  {
    id: "moderne",
    title: "Moderne",
    description:
      "Un modèle de CV accrocheur pour souligner votre candidature au moyen de la couleur.",
    image: "/assets/resume3.png",
    color: "navy",
  },
  {
    id: "chrono",
    title: "Chrono",
    description:
      "Un design moderne empreint de dynamisme centré sur les étapes de votre carrière.",
    image: "/assets/resume6.png",
    color: "purple",
  },
];

export default function CVTemplates() {
  return (
    <main>
      <Header />
      <div className="bg-white">
        <div className="bg-background w-full pt-32 pb-16">
          <section className="flex flex-col items-center text-center max-w-[1150px] mx-auto">
            <h1
              id="hero-title"
              className="text-4xl leading-normal md:text-5xl font-medium font-header text-gray-900 mb-2 text-center"
            >
              Modèles de CV et mise en page
            </h1>
            <p className="max-w-xl text-base md:text-lg text-gray-500 text-center">
              Valorisez votre profil en choisissant parmi une sélection de
              modèles de CV professionnels.
            </p>
          </section>
        </div>
        <div className="max-w-[1150px] mx-auto px-[20px] w-full">
          <div className="text-gray-900 text-base leading-7 bg-white py-8 break-words">
            <div className="break-words">
              <p>
                Tirez avantage de nos modèles de CV pour vous démarquer des
                autres candidats. Design contemporain, graphisme marqué ou
                encore choix du minimalisme, de nombreuses options s’offrent à
                vous pour créer un CV de qualité qui attirera l'attention des
                recruteurs, tout en soulignant vos compétences.
              </p>
            </div>
          </div>

          {/* templates Section */}
          <div className="flex flex-wrap justify-center md:justify-between -mx-5 py-8">
            {templates.map((template) => (
              <a
                key={template.id}
                href="#"
                className="block w-full md:w-1/2 lg:w-1/3 focus-visible:ring-4 ring-brand-200 rounded group px-5 mb-12"
              >
                <div className="relative">
                  <div className="relative" style={{ paddingBottom: "141%" }}>
                    <Image
                      src={template.image || "/placeholder.svg"}
                      alt={`Modèles de CV et mise en page - ${template.title}`}
                      fill
                      className="w-full rounded shadow-md transition-shadow can-hover:group-hover:shadow-lg object-cover absolute start-0 end-0 bottom-0 top-0"
                    />
                  </div>
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 py-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="inline-flex border justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center bg-brand-500 active:bg-brand-300 can-hover:active:bg-brand-300 text-white border-transparent can-hover:hover:bg-brand-400 font-medium py-1 ps-3 pe-3 text-base"
                      style={{ outline: "none" }}
                    >
                      <div className="truncate h-6">Utiliser ce modèle</div>
                    </button>
                  </div>
                </div>
                <p className="font-bold mt-4 text-gray-800 group-hover:text-brand-500 text-base">
                  {template.title}
                </p>
                <p className="w-full text-sm text-gray-500 leading-7 mt-3">
                  {template.description}
                </p>
              </a>
            ))}
          </div>

          {/* Section */}
          <div className="text-gray-900 text-base leading-7 bg-white py-8 break-words">
            <div className="break-words">
              <h2 className="text-2xl font-medium leading-tight text-gray-900 mb-4 mt-8 first:mt-0">
                Sélectionner le meilleur modèle de CV pour votre profil
              </h2>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                La mise en page de votre CV est un élément crucial de votre
                candidature. Elle est au service du contenu de votre document.
                Autrement dit, une mise en page réussie permet de mettre en
                évidence vos compétences, votre expérience et vos qualifications
                pour le poste, tout en proposant une lecture agréable.
              </p>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                Choisir le bon modèle de CV, c’est vous donner l’opportunité de
                susciter l’intérêt pour votre candidature grâce à un design
                original. En vous démarquant, vous augmentez vos chances d’être
                présélectionné, et d’être considéré pour un entretien puis pour
                un emploi.
              </p>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                Tous nos modèles vous donnent la possibilité de créer votre{" "}
                <a href="/" className="text-brand-500 font-medium underline">
                  <u>CV en ligne</u>
                </a>
                , ce qui facilite le processus et vous fait gagner du temps.
                Autre avantage, un modèle pré-conçu vous permet également
                d’adapter votre CV en quelques clics seulement à toute offre
                d’emploi qui pourrait vous intéresser.
              </p>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                Grâce à notre large sélection de couleurs et de styles
                différents, vous pouvez concevoir un CV correspondant aussi bien
                au secteur d’activité dans lequel vous souhaitez travailler,
                qu’au poste que vous visez. Nos{" "}
                <a
                  href="/exemples-cv"
                  className="text-brand-500 font-medium underline"
                >
                  <u>exemples de CV</u>
                </a>{" "}
                vous aideront à vous représenter les différentes options
                desquelles vous bénéficiez.
              </p>
              <h2
                className="text-2xl font-medium leading-tight text-gray-900 mb-4 mt-8"
                id="quel-est-le-bon-format-pour-votre-cv"
              >
                Quel est le bon format pour votre CV ?
              </h2>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                Bien que le contenu de chaque CV varie selon les profils, le
                format et la structure de ce document s’appliquent à tous les
                candidats. On peut distinguer deux grandes catégories : le CV
                chronologique inversé et le CV fonctionnel.
              </p>
              <h3
                className="text-xl font-medium leading-tight text-gray-900 mb-3 mt-6"
                id="cv-chronologique-invers%C3%A9"
              >
                CV chronologique inversé
              </h3>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                Aussi appelé{" "}
                <a
                  href="/conseils/cv-antechronologique"
                  className="text-brand-500 font-medium underline"
                >
                  <u>CV antéchronologique</u>
                </a>
                , ce type de CV est le plus fréquemment utilisé. Sa
                particularité concerne les rubriques Formation et Expérience
                professionnelle de votre CV en priorité, mais cela vaut aussi
                pour les stages ou les certifications par exemple.&nbsp;
              </p>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                Dans celles-ci, les entrées sont énumérées de la plus récente à
                la plus ancienne. C’est un CV qui convient aux candidats ayant
                un parcours classique.&nbsp;&nbsp;
              </p>
              <h3
                className="text-xl font-medium leading-tight text-gray-900 mb-3 mt-6"
                id="cv-fonctionnel"
              >
                CV fonctionnel
              </h3>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                Ce type de CV convient aux candidats qui présentent un parcours
                moins classique. Cela peut être dû à un changement de carrière,
                ou à des périodes d’inactivité. Quoi qu’il en soit, dans ces cas
                présenter la trajectoire de façon chronologique ne met pas
                forcément en valeur l’expérience ou les qualifications du
                candidat.&nbsp;
              </p>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                Un CV fonctionnel repose sur les compétences. En ce sens,
                celles-ci sont placées juste en dessous du profil personnel ou
                de l’en-tête du CV, avant l’expérience professionnelle et la
                formation. En utilisant un{" "}
                <a
                  rel="nofollow"
                  href="https://www.cv.fr/modeles-cv"
                  className="text-brand-500 font-medium underline"
                >
                  <u>modèle de CV</u>
                </a>
                , vous pouvez déplacer les rubriques comme vous le souhaitez,
                vous permettant ainsi facilement de créer un CV adoptant la
                structure qui vous correspond le mieux.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <FAQ
            faqs={modelesFaqData}
            title={"Foire aux questions : les modèles de CV"}
          />
        </div>
        {/* Create Resume Section */}
        <section className="bg-background relative py-16 lg:py-32">
          <div className="max-w-[1150px] mx-auto flex flex-col items-center text-center px-5">
            <h2 className="font-medium text-3xl md:text-5xl leading-tight md:leading-tight text-gray-900 mb-3">
              Utilisez un modèle de CV élégant
            </h2>
            <p className="max-w-xl text-xl text-gray-500 mb-10">
              Trouvez votre prochain emploi avec un modèle de CV professionnel
            </p>
            <Link
              className="inline-flex border outline-none justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center bg-brand-500 active:bg-brand-300 can-hover:active:bg-brand-300 text-white border-transparent can-hover:hover:bg-brand-400 font-medium py-3 ps-7 pe-7 text-lg"
              href="/builder"
              data-testid=""
            >
              <div className="truncate h-7">Créez votre CV</div>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
