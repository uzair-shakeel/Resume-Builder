import React from "react";
import { FAQProps } from "@/components/shared/FAQ";
import Link from "next/link";

type FAQItem = FAQProps["faqs"][0];

const modelesFaqData: FAQItem[] = [
  {
    question:
      "Entre modèle de CV simple et modèle de CV créatif, lequel choisir ?",
    answer: (
      <>
        <p className="pb-[1.25rem]">
          Cela dépend à la fois de votre poste et du secteur dans lequel vous
          évoluez. S’il est certain qu’un{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/cv-creatif"
          >
            <u>CV créatif</u>
          </Link>
          vous permet d’exprimer votre personnalité, il est plutôt réservé aux
          profils pour lesquels il permettra de valoriser des compétences.
        </p>
        <p className="">
          Pour la majorité des candidats n’occupant pas un emploi créatif, un CV
          plus sobre est recommandé. Vous pouvez néanmoins personnaliser votre
          CV grâce à de la couleur ou quelques éléments graphiques discrets.
        </p>
      </>
    ),
  },
  {
    question: "Quels sont les meilleurs modèles de CV en 2025 ?",
    answer: (
      <>
        <p>
          En 2024, les CV reflétant les qualités et les compétences des
          candidats tirent leur épingle du jeu. Cela ne les éloigne pour autant
          pas totalement du modèle de CV traditionnel, en ce sens que la
          simplicité a toujours la faveur des recruteurs et des employeurs. Cela
          étant dit, apporter de la couleur et quelques éléments distinctifs de
          design réhausseront votre document.
        </p>
      </>
    ),
  },
  {
    question: "Quelle est la structure appropriée pour un modèle de CV ?",
    answer: (
      <>
        <p className="pb-5">
          Voici la structure classique selon laquelle vous pouvez organiser les
          sections de votre CV :
        </p>
        <ol className="list-decimal custom-counter space-y-4 [direction:ltr]">
          <li>En-tête</li>
          <li>Informations personnelles</li>
          <li>Profil personnel</li>
          <li>Expérience professionnelle</li>
          <li>Formation</li>
          <li>Compétences</li>
          <li>
            Rubriques optionnelles (langues étrangères, bénévolat par exemple,
            activités extra-scolaires, etc.)
          </li>
        </ol>
        <p className="pb-5">
          Notez que les candidats ne disposant pas d’expérience professionnelle
          ou débutant leur carrière placeront la rubrique formation avant
          l’expérience professionnelle.
        </p>
        <p className="pb-5">
          En utilisant un modèle de CV à remplir, vous pouvez modifier autant
          que vous le souhaitez et choisir la version qui vous convient le
          mieux. Vous pouvez faire différents essais afin de valoriser certaines
          sections de votre CV, comme les compétences ou les qualités.
        </p>
        <p>
          Pensez aussi à faire en sorte de créer un «{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/cv-logiciels-recrutement-ats"
          >
            <u>CV pour ATS</u>
          </Link>{" "}
          » en y plaçant des mots-clés. Vous pouvez les déduire en lisant bien
          l’offre d’emploi et en relevant les termes pertinents et importants
          correspondant à la recherche de l’entreprise.
        </p>
      </>
    ),
  },
  {
    question: "Comment puis-je créer un modèle de CV ?",
    answer: (
      <>
        <p className="pb-5">
          Avec CV.fr, vous pouvez facilement créer un CV en créant un compte.
          Vous n’avez qu’à choisir un modèle de CV gratuit. Vous pourrez le
          modifier et l'adapter à différentes offres d’emploi sans difficultés.
        </p>
        <p>
          Une fois votre compte créé, vous pourrez accéder à tous nos modèles de
          CV, y compris les modèles premium. Police et taille de caractères,
          gamme de couleurs, création ou suppression de rubriques, vous avez
          l’embarras du choix pour créer autant de CV que vous le souhaitez en
          quelques instants. Une fois terminé, vous pourrez télécharger le CV au
          format PDF afin d’envoyer votre candidature.
        </p>
      </>
    ),
  },
  {
    question: "Quelle est la meilleure mise en page pour un CV ?",
    answer: (
      <>
        <p className="pb-5">
          La meilleure mise en page est la mise en page qui permet de valoriser
          au mieux votre profil, tout en répondant aux attentes de l’entreprise
          auprès de laquelle vous postulez. Modèle de CV simple ou modèle de CV
          qui accroche, l’essentiel est de disposer d’un design professionnel.
        </p>
        <p>
          L’avantage des modèles de CV de CV.fr est que vous pouvez changer la
          mise en page en un clic et visualiser immédiatement le rendu du
          document. De cette façon, vous avez la possibilité de tester aussi
          bien les modèles que les couleurs rapidement et facilement.
        </p>
      </>
    ),
  },
];

export default modelesFaqData;
