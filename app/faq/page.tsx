"use client";

import Header from "@/components/shared/Header";
import FAQ from "@/components/shared/FAQ";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <FAQ useTrans={true} page={true} title={t("site.home.faqs.title")} />
      <Footer />
    </main>
  );
}

const faqs = [
  {
    question: "Qu'est-ce qu'un CV ?",
    answer: (
      <>
        <p className="pb-[1.25rem]">
          CV (Curriculum Vitae) signifie en latin "carrière de la vie". Une
          façon poétique de désigner "le dossier comportant l'ensemble des
          indications concernant l'état civil d'un candidat à un poste, ses
          diplômes, son{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/experience-professionnelle-cv"
          >
            <u>expérience professionnelle</u>
          </Link>
          , etc."", selon la définition du dictionnaire français Larousse.
        </p>
        <p className="pb-[1.25rem]">
          Élément indispensable de toute recherche d'emploi, le curriculum vitae
          se doit de renseigner l'employeur sur votre profil, vos{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/competences-cv"
          >
            <u>compétences</u>
          </Link>{" "}
          et et votre parcours. Et face à la concurrence des nombreux candidats
          qui postulent aux mêmes emplois, il est important de savoir faire un
          CV attractif pour sortir du lot et attirer l'œil des recruteurs !
        </p>
        <p className="pb-[1.25rem]">
          Le but premier du CV est de mettre en avant vos qualités, compétences,
          et atouts et d'atténuer le plus possible vos points faibles ou
          accidents de parcours. En effet, le curriculum vitae doit montrer le
          meilleur de votre personnalité et de vos compétences afin d'apparaître
          comme le candidat idéal aux yeux des recruteurs ! Il doit donc donner
          une image positive de votre candidature.
        </p>
        <p className="pb-[1.25rem]">
          Bien sûr il n'existe aucune "loi" qui vous oblige à avoir un CV, mais
          décrocher un job sans en avoir un est quasiment mission impossible !
          Même si quelqu'un vous recommande à un recruteur, par exemple,
          celui-ci vous demandera certainement votre CV pour se faire une idée
          de votre parcours et de vos compétences. Avoir un CV est donc
          absolument indispensable ! Pensez également à garder votre CV à jour
          afin qu'il contienne toujours vos dernières expériences
          professionnelles ou{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/formation-cv"
          >
            <u>formations</u>
          </Link>
          . Il est donc important de toujours le relire avant de l'envoyer à un
          recruteur, pour être sûr que vous n'avez rien oublié !
        </p>
      </>
    ),
  },
  {
    question: "Que mettre dans un CV ?",
    answer: (
      <>
        <p className="pb-[1.25rem]">
          <strong>L'état civil et les coordonnées</strong>
        </p>
        <p className="pb-[1.25rem]">
          Le nom, la ville, le{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/telephone-cv"
          >
            <u>numéro de téléphone</u>
          </Link>{" "}
          et l'
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/adresse-mail-cv"
          >
            <u>adresse mail</u>
          </Link>{" "}
          font partie des informations essentielles à tout CV. On peut ensuite
          choisir d'ajouter ou non une{" "}
          <Link className="text-brand-500 font-[500]" href="/conseils/photo-cv">
            <u>photo</u>
          </Link>
          , de mentionner sa{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/date-naissance-cv"
          >
            <u>date de naissance</u>
          </Link>
          , son{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/permis-conduire-cv"
          >
            <u>permis de conduire</u>
          </Link>
          , son{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/etat-matrimonial-cv"
          >
            <u>état matrimonial</u>
          </Link>
          , sa{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/nationalite-cv"
          >
            <u>nationalité</u>
          </Link>{" "}
          ou encore ses{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/linkedin-reseaux-sociaux-cv"
          >
            <u>réseaux sociaux</u>
          </Link>
          .
        </p>
        <p className="pb-[1.25rem]">
          <strong>Le profil personnel</strong>
        </p>
        <p className="pb-[1.25rem]">
          Ajouter un petit texte pour se présenter n'est pas systématique mais
          c'est une bonne façon d'ajouter une touche personnelle à son CV ! Le{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/profil-accroche-cv"
          >
            <u>profil personnel</u>
          </Link>{" "}
          ou le résumé personnel d'un CV consiste à résumer en quelques mots ou
          phrases qui vous êtes et quels sont vos compétences et{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/objectifs-cv"
          >
            <u>objectifs</u>
          </Link>
          , afin de vous présenter aux employeurs. De cette manière, cela ajoute
          une touche personnelle à votre CV et permet aux recruteurs de savoir
          immédiatement quel poste vous recherchez ou quels sont vos atouts.
          Cette sorte d'introduction se doit d'être accrocheuse, afin de donner
          envie aux recruteurs d'en savoir plus sur vous et de lire votre CV
          dans son intégralité ! Mieux vaut donc privilégier une accroche courte
          et qui répond au profil recherché par l'employeur.
        </p>
        <p className="pb-[1.25rem]">
          <strong>La formation</strong>
        </p>
        <p className="pb-[1.25rem]">
          Baccalauréat, grandes écoles, universités… Vos domaines de formation,
          vos études et vos diplômes sont des éléments absolument essentiels
          pour faire un CV. En effet, ces informations, avec vos expériences
          professionnelles, font partie des plus importantes pour les recruteurs
          puisqu'elles leur permettent de savoir où et comment vous avez été
          formé, votre niveau de qualification et dans quel(s) domaine(s) vous
          êtes compétents. Le niveau de qualification peut d'ailleurs avoir un
          impact sur la rémunération, par exemple.
        </p>
        <p className="pb-[1.25rem]">
          <strong>L'expérience professionnelle</strong>
        </p>
        <p className="pb-[1.25rem]">
          Dans cette rubrique, dites-en plus aux recruteurs sur vos expériences
          professionnelles, qu'il s'agisse de vos{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/stages-cv"
          >
            <u>stages</u>
          </Link>{" "}
          ou précédents emplois. De cette manière, les recruteurs pourront se
          faire une idée plus précise de votre parcours et des missions qui ont
          été les vôtres au cours de vos précédents emplois, et ainsi en savoir
          plus sur vos compétences et ce que vous êtes capable d'accomplir.
          Pensez donc à donner des exemples concrets, comme la publication d'une
          étude, ou chiffrés si vous avez fait de bons résultats dans une
          précédente entreprise.
        </p>
        <p className="pb-[1.25rem]">
          <strong>Les compétences</strong>
        </p>
        <p className="pb-[1.25rem]">
          Indiquer vos compétences et donc vos savoir-faire fait partie des
          incontournables de tout CV. Il peut s'agir des compétences
          informatiques (Excel, Photoshop, InDesign…) mais aussi de
          savoir-faire, aptitudes ou activités apprises ou que vous maîtrisez et
          qui peuvent être développées. Ce peut être la capacité à modéliser des
          maquettes en 3D, par exemple, réaliser des moulures ou à piloter une
          grue. Dans tous les cas, ces compétences doivent permettre de montrer
          aux recruteurs que vous êtes capables de mener à bien des missions
          particulières, qui vous distinguent des autres candidats !
        </p>
        <p className="pb-[1.25rem]">
          <strong>Les langues étrangères</strong>
        </p>
        <p className="pb-[1.25rem]">
          Sans être forcément bilingue, les langues sont un atout de taille dans
          la recherche d'emploi que vous postuliez sur le marché français ou à
          l'étranger. Elles doivent donc apparaître dans le CV. Anglais,
          espagnol, italien, allemand, russe, japonais, chinois… Si l'anglais
          est la langue la plus courante, les autres{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/langues-cv"
          >
            <u>langues étrangères</u>
          </Link>{" "}
          que l'on maîtrise peuvent être un sérieux atout pour sa candidature et
          permettre de se démarquer des autres candidats. Pensez à indiquer
          votre niveau, avec honnêteté, pour chacune d'entre elles !
        </p>
        <p className="pb-[1.25rem]">
          <strong>Les centres d'intérêts et hobbies</strong>
        </p>
        <p className="pb-[1.25rem]">
          Si vous avez une ou plusieurs passions, vous pouvez tout à fait les
          mentionner sur votre CV ! Cela permettra aux recruteurs d'en savoir un
          peu plus sur votre personnalité et de vous démarquer des autres
          candidats à un même poste. Nous vous recommandons d'indiquer quatre
          hobbies au maximum, afin de ne pas surcharger votre CV. Ceux que vous
          choisissez doivent donc présenter un intérêt tout particulier et être
          un véritable atout pour le poste visé. Pour vous démarquer des autres
          candidatures, choisissez des passions qui sont spéciales et qui
          montrent votre personnalité.
        </p>
        <p className="pb-[1.25rem]">
          À ces rubriques "classiques" peuvent bien sûr s'en ajouter d'autres.
        </p>
        <p className="pb-[1.25rem]">
          <strong>Les activités extra professionnelles</strong>
        </p>
        <p className="pb-[1.25rem]">
          Il n'y a pas que les expériences professionnelles qui comptent pour
          faire un CV. Si vous êtes le trésorier d'une association sportive, que
          vous êtes engagé dans une organisation humanitaire ou que vous
          pratiquez l'alpinisme à haut niveau, dites-le ! Tout comme vos
          expériences professionnelles ou vos{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/centres-interets-hobbies-cv"
          >
            <u>centres d'intérêts</u>
          </Link>
          , ces activités mettent en avant vos compétences et permettent d'en
          apprendre plus sur votre personnalité.
        </p>
        <p className="pb-[1.25rem]">
          <strong>Les cours</strong>
        </p>
        <p className="pb-[1.25rem]">
          Vous vous êtes lancé dans un cours d'histoire de l'art, dans un
          atelier de menuiserie ou vous avez appris de nouvelles compétences en
          ligne, sur internet, grâce aux MOOC ? Dites-le dans votre CV ! Ces{" "}
          <Link className="text-brand-500 font-[500]" href="/conseils/cours-cv">
            <u>cours</u>
          </Link>{" "}
          élargissent votre champ de compétences et montrent aux recruteurs que
          vous êtes curieux et prêt à apprendre de nouvelles choses. Cela ne
          pourra que leur plaire !
        </p>
        <p className="pb-[1.25rem]">
          <strong>Les stages</strong>
        </p>
        <p className="pb-[1.25rem]">
          Les stages sont une expérience professionnelle à part entière et, si
          vous faites votre entrée sur le marché du travail, il peut être bien
          de créer une rubrique qui leur est dédiée. Si vous avez déjà réalisé
          plusieurs stages, il est important, comme c'est le cas pour toute
          expérience professionnelle, de ne mentionner que ceux qui ont un
          véritable intérêt pour le poste visé.
        </p>
        <p className="pb-[1.25rem]">
          <strong>Les objectifs</strong>
        </p>
        <p className="pb-[1.25rem]">
          Mentionner son objectif professionnel sur son CV permet d'informer les
          recruteurs sur vos aspirations, les choix de carrière que vous
          aimeriez faire et quels sont vos objectifs professionnels. Et cela
          prouve que vous avez de l'ambition !
        </p>
        <p className="pb-[1.25rem]">
          <strong>Les références</strong>
        </p>
        <p className="pb-[1.25rem]">
          Les{" "}
          <Link
            className="text-brand-500 font-[500]"
            href="/conseils/reference-cv"
          >
            <u>références</u>
          </Link>{" "}
          consistent à donner les coordonnées d'anciens contacts professionnels
          afin que les recruteurs puissent les contacter pour vérifier vos
          informations mais surtout pour connaître vos qualités et compétences
          et savoir quelle expérience cela a été de travailler avec vous. De
          cette manière, les recruteurs en sauront aussi un peu plus sur votre
          personnalité !
        </p>
      </>
    ),
  },
  {
    question: "Comment faire un CV ?",
    answer: (
      <>
        <p className="pb-[1.25rem]">
          Vous avez vu passer ou entendu parler d'un poste qui se libère dans
          une entreprise : cela tombe bien, c'est exactement le job dont vous
          avez toujours rêvé et/ou l'entreprise où vous avez toujours voulu
          travailler. Vous voulez donc répondre à cette offre d'emploi ! Pour
          contacter le recruteur et lui montrer que vous êtes le candidat idéal
          pour ce poste, vous avez besoin d'un CV. Ce document va en effet lui
          permettre de connaître en une ou deux pages vos qualités, expériences
          et compétences. Cela va également lui donner la possibilité de
          comparer votre candidature – et ses atouts – à celles d'autres
          candidats. Le CV doit donc montrer aux recruteurs ce que vous allez
          pouvoir apporter à l'entreprise ! Il est donc temps de faire votre
          curriculum vitae. deux solutions s'offrent à vous :&nbsp;
        </p>
        <ol>
          <li className="my-[.5rem]  before:content-none">
            <strong>Utiliser un générateur de CV</strong>. L'avantage de ces
            outils est qu'ils vous offrent un document clef en main. Le
            curriculum vitae est préconçu et vous n'avez qu'à choisir le design
            qui vous convient et ensuite remplir les différentes sections pour
            retracer votre parcours, indiquer vos compétences, etc. Un cv
            designer est idéal pour faire créer un Cv rapidement et s'assurer de
            la qualité de sa mise en page.&nbsp;
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>Créer votre CV de A à Z</strong> en partant d'une feuille
            blanche. Pour cela, vous pouvez utiliser un logiciel de traitement
            de texte. Vous devrez gérer votre propre mise en page, avec
            l'inconvénient que celle-ci soit à rectifier en fonction des
            changements que vous pourrez effectuer sur votre CV, lors d'une mise
            à jour de vos compétences ou quand vous l'adapterez à différentes
            offres d'emploi.
          </li>
        </ol>
        <p className="pb-[1.25rem]">
          Si vous ne savez pas par où commencer, vous pouvez essayer un CV
          designer, comme celui offert par CV.fr. Il vous suffit de choisir
          votre{" "}
          <Link className="text-brand-500 font-[500]" href="/modeles-cv">
            <u>modèle de CV</u>
          </Link>{" "}
          et vous serez prêt à réaliser votre candidature en un clin d'œil !
        </p>
      </>
    ),
  },
  {
    question: "Comment faire un CV à l'aide d'un générateur ?",
    answer: (
      <>
        <p className="pb-[1.25rem]">
          Rien de plus simple : il vous suffit de parcourir les différents
          modèles disponibles et d'en choisir un correspondant à l'image que
          vous souhaitez donner de votre profil (selon votre métier, le secteur
          d'activité dans lequel vous évoluez, etc.). Une fois que vous avez
          fait votre choix, il vous suffit d'utiliser le CV designer pour
          compléter les différentes sections disponibles en fonction de votre
          profil. Vous pouvez ajouter des sections, par exemple une section sur
          les qualités ou même le bénévolat, qui compléteront votre CV.
        </p>
      </>
    ),
  },
  {
    question: "Quels sont les avantages d'un générateur de CV ?",
    answer: (
      <>
        <p className="pb-[1.25rem]">
          En premier lieu, on peut citer le gain de temps puisque le générateur
          de CV met à dispositions des modèles de CV préconçus. De ce fait, en
          un clic vous disposez d'un document type. Le temps à investir ne sera
          lié qu'à la rédaction du contenu à insérer dans le CV. Par ailleurs,
          cela vous permet de n'omettre aucune rubrique importante.
        </p>
        <p className="pb-[1.25rem]">
          Lorsque vous décidez de faire un CV avec un générateur de CV, vous
          vous assurez de maintenir l'intégrité de la mise en page. Vous pouvez
          ajouter ou supprimer des sections aisément et sans modifier
          l'apparence du design. Quand vous avez besoin d'effectuer une mise à
          jour de votre CV, il suffit de cliquer et de modifier le contenu.
        </p>
        <p className="pb-[1.25rem]">
          Avec la possibilité d'enregistrer votre document au format PDF, vous
          avez la certitude que le destinataire de votre CV pourra le découvrir
          tel quel, sans risque de problèmes de compatibilité éventuels.
        </p>
        <p className="pb-[1.25rem]">
          Avec CV.fr, vous pouvez créer un CV gratuit en utilisant l'un de nos
          modèles gratuits. Si vous choisissez un abonnement, vous pourrez
          choisir parmi davantage de modèles de CV. Avec nos CV gratuits ou
          payants, vous impressionnerez n'importe quel futur employeur et
          obtiendrez le travail de vos rêves.
        </p>
      </>
    ),
  },
  {
    question: "Conseils pour créer un bon CV",
    answer: (
      <>
        <p className="pb-[1.25rem]">
          Voici quelques règles à suivre pour vous y aider :
        </p>
        <ul className="ms-[1rem] ps-[1.25rem] mt-[.4rem] list-disc">
          <li className="my-[.5rem]  before:content-none">
            <strong>organiser votre CV :</strong> les différentes rubriques d'un
            CV (état civil, coordonnées, formations, expériences
            professionnelles…) permettent d'organiser votre CV et de rendre sa
            lecture plus claire et plus agréable. Il est donc important de créer
            différentes rubriques et de ne pas mettre toutes les informations en
            un seul bloc.
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>
              rédiger chaque information de façon claire et concise :
            </strong>{" "}
            lors de la rédaction de votre CV, essayez toujours d'aller à
            l'essentiel pour que les recruteurs comprennent immédiatement de
            quelle formation ou expérience professionnelle il s'agit. Utilisez
            des mots simples et évitez les acronymes sauf s'ils sont vraiment
            incontournables.
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>évitez le trop plein d'informations :</strong> pour bien
            faire un CV, il faut éviter de le surcharger. Effectuez un tri dans
            les informations que vous voulez mentionner afin de ne faire
            apparaître que celles qui présentent un véritable intérêt pour le
            poste envisagé ! Votre CV ne doit pas contenir l'ensemble de vos
            formations, expériences professionnelles et centres d'intérêts, mais
            seulement ceux qui sont un atout pour votre candidature.
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>deux pages maximum :</strong> concernant la{" "}
            <Link
              className="text-brand-500 font-[500]"
              href="/conseils/longueur-cv"
            >
              <u>longueur de votre CV</u>
            </Link>
            , nous vous conseillons de ne pas dépasser deux pages A4 maximum.
            Au-delà, les recruteurs risqueraient de ne pas lire votre CV dans
            son intégralité. Ils en reçoivent en général beaucoup et n'ont pas
            le temps de se lancer dans la lecture d'un roman !
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>soyez positif :</strong> ne mettez en avant sur votre CV que
            des informations qui jouent en votre faveur et donnent une bonne
            image de vous. Parlez donc de vos points forts, vos qualités et vos
            compétences.
          </li>
        </ul>
        <p className="pb-[1.25rem]">
          Faire un CV demande beaucoup de rigueur, et quelques erreurs sont à
          éviter afin de se donner toutes les chances de décrocher le job de ses
          rêves. Voici quelques unes des plus courantes :
        </p>
        <ul>
          <li className="my-[.5rem]  before:content-none">
            <strong>ne pas mettre son CV régulièrement à jour :</strong>{" "}
            assurez-vous de toujours mettre à jour votre CV avant de l'envoyer
            aux recruteurs, afin qu'il reflète votre situation actuelle.
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>les fautes d'orthographe :</strong> sur un CV, l'orthographe
            doit être irréprochable afin de donner la meilleure image aux
            recruteurs. On relit donc son CV plusieurs fois, voire on le fait
            relire par un proche !
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>une mise en page bâclée :</strong> la forme compte autant
            que le fond ! Il est donc important de soigner la{" "}
            <Link href="/conseils/mise-en-page-cv">
              <u>mise en page</u>
            </Link>{" "}
            de son CV en créant des titres, en l'aérant et en utilisant une
            police de caractère agréable à lire afin de donner envie aux
            recruteurs de se plonger dans sa lecture.
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>donner trop d'informations personnelles :</strong> ne
            mentionnez sur votre CV que les informations qui ont un véritable
            intérêt pour le poste convoité. Ainsi évitez de donner trop
            d'informations personnelles sur vous (statut matrimonial,{" "}
            <Link
              className="text-brand-500 font-[500]"
              href="/conseils/enfants-cv"
            >
              <u>enfants</u>
            </Link>
            ,{" "}
            <Link
              className="text-brand-500 font-[500]"
              href="/conseils/lieu-naissance-cv"
            >
              <u>lieu de naissance</u>
            </Link>
            …) si cela n'est pas nécessaire.
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>des "trous" dans son CV :</strong> évitez à tout prix de
            laisser des ""
            <Link
              className="text-brand-500 font-[500]"
              href="/conseils/trou-cv"
            >
              <u>trous</u>
            </Link>
            "" dans votre CV, c'est-à-dire des périodes d'inactivité où vous
            n'avez ni suivi de formation ni réalisé d'expérience
            professionnelle, car cela donnerait une mauvaise image de vous aux
            recruteurs. Si vous avez pris du temps pour vous occuper de votre
            famille ou si vous avez voyagé, dites-le.
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>une photo qui n'est pas professionnelle :</strong> si vous
            choisissez d'ajouter une photo sur votre CV, n'utilisez pas celle de
            vos dernières vacances ! La photo de votre CV se doit d'être
            professionnelle.
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>éviter les formules toutes faites :</strong> lors de la
            rédaction de votre CV, bannissez les tournures du type "Je suis le
            candidat qu'il vous faut" ou "j'aime sortir des sentiers battus" qui
            la plupart du temps exaspèrent les recruteurs.
          </li>
          <li className="my-[.5rem]  before:content-none">
            <strong>indiquer vos prétentions salariales :</strong> le CV n'est
            pas le lieu pour indiquer le salaire que vous visez. Vous aurez tout
            le temps d'aborder le sujet au moment de l'entretien d'embauche !
          </li>
        </ul>
        <p className="pb-[1.25rem]">
          Pour en apprendre davantage et bénéficier de tous nos conseils,
          consultez nos{" "}
          <Link className="text-brand-500 font-[500]" href="/exemples-cv">
            <u>exemples de CV</u>
          </Link>{" "}
          et créez un CV qui vous ouvrira les portes des entreprises !
        </p>
      </>
    ),
  },
];
