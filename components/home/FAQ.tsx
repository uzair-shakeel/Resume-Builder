"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "Qu'est-ce qu'un CV ?",
    answer:
      "Un CV (Curriculum Vitae) est un document qui présente votre parcours professionnel, vos compétences et vos qualifications. C'est un outil essentiel pour postuler à un emploi et donner aux recruteurs un aperçu de votre profil.",
  },
  {
    question: "Que mettre dans un CV ?",
    answer:
      "Un CV doit inclure vos informations personnelles, votre expérience professionnelle, votre formation, vos compétences, et éventuellement vos centres d'intérêt. Il est important d'adapter le contenu en fonction du poste visé.",
  },
  {
    question: "Comment faire un CV ?",
    answer:
      "Pour faire un CV, commencez par rassembler toutes vos informations importantes, choisissez un format clair et professionnel, et organisez vos informations de manière logique. Mettez en avant les éléments les plus pertinents pour le poste visé.",
  },
  {
    question: "Comment faire un CV à l'aide d'un générateur ?",
    answer:
      "Utilisez notre générateur de CV en ligne en suivant ces étapes : choisissez un modèle, remplissez vos informations dans les champs prévus, personnalisez la mise en page, et téléchargez votre CV au format PDF.",
  },
  {
    question: "Quels sont les avantages d'un générateur de CV ?",
    answer:
      "Un générateur de CV offre plusieurs avantages : gain de temps, mise en page professionnelle automatique, multiples modèles disponibles, suggestions de contenu, et possibilité de modifier facilement votre CV à tout moment.",
  },
  {
    question: "Conseils pour créer un bon CV",
    answer:
      "Pour créer un bon CV, soyez concis et précis, adaptez le contenu au poste, utilisez des mots-clés pertinents, vérifiez l'orthographe, et optez pour une mise en page claire et professionnelle.",
  },
];

export default function FAQ() {
  return (
    <section className="py-16">
      <div className="container max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Foire aux questions
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-200 last:border-0"
            >
              <AccordionTrigger className="hover:no-underline py-6 text-left">
                <span className="text-lg text-gray-900">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Vous avez des questions ? Consultez notre{" "}
            <Link
              href="/faq"
              className="text-blue-600 hover:text-blue-700 inline-flex items-center"
            >
              FAQ
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
