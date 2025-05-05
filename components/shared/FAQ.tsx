"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQProps {
  faqs?: {
    question: string;
    answer: React.ReactNode;
  }[];
  page?: boolean; // Optional page prop if you need it
  useTrans?: boolean; // Whether to use translations or provided faqs
}

export default function FAQ({
  faqs = [],
  page = false,
  useTrans = false,
}: FAQProps) {
  const { t } = useLanguage();

  // If useTrans is true, use translations instead of provided faqs
  const faqItems = useTrans
    ? [
        {
          question: t("site.home.faqs.items.faq1.question"),
          answer: (
            <p className="pb-[1.25rem]">
              {t("site.home.faqs.items.faq1.answer")}
            </p>
          ),
        },
        {
          question: t("site.home.faqs.items.faq2.question"),
          answer: (
            <p className="pb-[1.25rem]">
              {t("site.home.faqs.items.faq2.answer")}
            </p>
          ),
        },
        {
          question: t("site.home.faqs.items.faq3.question"),
          answer: (
            <p className="pb-[1.25rem]">
              {t("site.home.faqs.items.faq3.answer")}
            </p>
          ),
        },
        {
          question: t("site.home.faqs.items.faq4.question"),
          answer: (
            <p className="pb-[1.25rem]">
              {t("site.home.faqs.items.faq4.answer")}
            </p>
          ),
        },
        {
          question: t("site.home.faqs.items.faq5.question"),
          answer: (
            <p className="pb-[1.25rem]">
              {t("site.home.faqs.items.faq5.answer")}
            </p>
          ),
        },
        {
          question: t("site.home.faqs.items.faq6.question"),
          answer: (
            <p className="pb-[1.25rem]">
              {t("site.home.faqs.items.faq6.answer")}
            </p>
          ),
        },
      ]
    : faqs;

  return (
    <section className="bg-white py-20">
      <div className="max-w-[864px] mx-auto px-[20px]">
        <h2
          className={`font-medium text-3xl leading-normal md:text-5xl text-gray-900 text-center ${
            page ? "pt-20 pb-32 mb-12" : "mb-20"
          }`}
        >
          {t("site.home.faqs.title")}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((faq, index) => (
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
            {t("site.home.faqs.moreQuestions")}{" "}
            <Link
              href="/faq"
              className="inline-flex items-center text-[#173dff] font-[500]"
            >
              <span className="hover:underline">FAQ</span>
              <svg
                className="w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path
                  d="M664.463-450.001H210.001q-12.769 0-21.384-8.615-8.616-8.615-8.616-21.384t8.616-21.384q8.615-8.615 21.384-8.615h454.462L532.769-641.693q-8.923-8.923-8.807-20.884.115-11.961 8.807-21.269 9.308-9.307 21.384-9.615 12.077-.308 21.384 9l179.154 179.154q5.615 5.615 7.923 11.846 2.308 6.23 2.308 13.461t-2.308 13.461q-2.308 6.231-7.923 11.846L575.537-275.539q-8.922 8.923-21.191 8.808-12.269-.116-21.577-9.423-8.692-9.308-9-21.077-.307-11.769 9-21.076l131.694-131.694Z"
                  fill="currentColor"
                ></path>
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
