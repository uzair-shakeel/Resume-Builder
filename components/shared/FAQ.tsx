"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface FAQProps {
  faqs: {
    question: string;
    answer: React.ReactNode;
  }[];
  page?: boolean; // Optional page prop if you need it
}

export default function FAQ({ faqs, page = false }: FAQProps) {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[864px] mx-auto px-[20px]">
        <h2
          className={`font-medium text-3xl leading-normal md:text-5xl text-gray-900 text-center ${
            page ? "pt-20 pb-32 mb-12" : "mb-20"
          }`}
        >
          Foire aux questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-200 last:border-0"
            >
              <AccordionTrigger className="hover:no-underline text-lg md:text-xl text-start text-gray-500 active:text-gray-900 hover:text-gray-700 font-medium flex items-center w-full py-5 rounded-sm focus-visible:ring-4 ring-brand-200">
                <span>{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-900 leading-relaxed pb-5 prose w-full max-w-full block">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="prose mt-5">
          <p className="text-gray-600">
            Vous avez des questions ? Consultez notre{" "}
            <Link
              href="/faq"
              className="inline-flex focus-visible:ring-4 ring-brand-200"
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
