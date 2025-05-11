"use client";

import FAQ from "@/components/shared/FAQ";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const templates = [
  {
    id: "circulaire",
    image: "/assets/circulaire.jpg",
    color: "teal",
  },
  {
    id: "pro",
    image: "/assets/professional.png",
    color: "navy",
  },
  {
    id: "student",
    image: "/assets/student-resume.jpg",
    color: "purple",
  },
  {
    id: "minimal",
    image: "/assets/minimal-resume.jpg",
    color: "teal",
  },
  {
    id: "sherlock",
    image: "/assets/resume3.png",
    color: "navy",
  },
  {
    id: "modern",
    image: "/assets/modern-cv.svg",
    color: "brown",
  },
  {
    id: "classic",
    image: "/assets/classic.jpg",
    color: "#2c3e50",
  },
  {
    id: "hr",
    image: "/assets/hr.jpg",
    color: "#9b59b6",
  },
  {
    id: "teal",
    image: "/assets/teal.jpg",
    color: "#2BCBBA",
  },
];

const pricingOptions = {
  month: {
    price: "14,99",
    period: "mois",
    fullPrice: "1499",
  },
  quarter: {
    price: "39,99",
    period: "trimestre",
    fullPrice: "3999",
  },
  year: {
    price: "139,99",
    period: "an",
    fullPrice: "13999",
  },
};

export default function CVTemplates() {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
  };

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
              {t("site.templates.page.title")}
            </h1>
            <p className="max-w-xl text-base md:text-lg text-gray-500 text-center">
              {t("site.templates.page.subtitle")}
            </p>
          </section>
        </div>
        <div className="max-w-[1150px] mx-auto px-[20px] w-full">
          <div className="text-gray-900 text-base leading-7 bg-white py-8 break-words">
            <div className="break-words">
              <p>{t("site.templates.page.description")}</p>
            </div>
          </div>

          {/* templates Section */}
          <div className="flex flex-wrap justify-center md:justify-between -mx-5 py-8">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/builder?template=${template.id}`}
                className="block w-full md:w-1/2 lg:w-1/3 focus-visible:ring-4 ring-brand-200 rounded group px-5 mb-12"
              >
                <div className="relative">
                  <div className="relative" style={{ paddingBottom: "141%" }}>
                    <Image
                      src={template.image || "/placeholder.svg"}
                      alt={`${t("site.templates.page.title")} - ${t(
                        `site.templates.templates.${template.id}.title`
                      )}`}
                      fill 
                      className="w-full rounded shadow-md transition-shadow can-hover:group-hover:shadow-lg object-cover absolute start-0 end-0 bottom-0 top-0"
                    />
                  </div>
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 py-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className="inline-flex border justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center bg-brand-500 active:bg-brand-300 can-hover:active:bg-brand-300 text-white border-transparent can-hover:hover:bg-brand-400 font-medium py-1 ps-3 pe-3 text-base"
                      style={{ outline: "none" }}
                    >
                      <div className="truncate h-6">
                        {t("site.templates.page.cta")}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-bold mt-4 text-gray-800 group-hover:text-brand-500 text-base">
                  {t(`site.templates.templates.${template.id}.title`)}
                </p>
                <p className="w-full text-sm text-gray-500 leading-7 mt-3">
                  {t(`site.templates.templates.${template.id}.description`)}
                </p>
              </Link>
            ))}
          </div>

          {/* Section */}
          <div className="text-gray-900 text-base leading-7 bg-white py-8 break-words">
            <div className="break-words">
              <h2 className="text-2xl font-medium leading-tight text-gray-900 mb-4 mt-8 first:mt-0">
                {t("site.templates.page.select_best.title")}
              </h2>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                {t("site.templates.page.select_best.description")}
              </p>
              <h2
                className="text-2xl font-medium leading-tight text-gray-900 mb-4 mt-8"
                id="quel-est-le-bon-format-pour-votre-cv"
              >
                {t("site.templates.page.format.title")}
              </h2>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                {t("site.templates.page.format.description")}
              </p>
              <h3
                className="text-xl font-medium leading-tight text-gray-900 mb-3 mt-6"
                id="cv-chronologique-inversé"
              >
                {t("site.templates.page.format.chronological.title")}
              </h3>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                {t("site.templates.page.format.chronological.description")}
              </p>
              <h3
                className="text-xl font-medium leading-tight text-gray-900 mb-3 mt-6"
                id="cv-fonctionnel"
              >
                {t("site.templates.page.format.functional.title")}
              </h3>
              <p className="mb-5 mt-2 last:mb-0 first:mt-0 after:content-['\200b']">
                {t("site.templates.page.format.functional.description")}
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <FAQ useTrans={true} title={t("site.templates.page.faq.title")} />
        </div>
        {/* Create Resume Section */}
        <section className="bg-background relative py-16 lg:py-32">
          <div className="max-w-[1150px] mx-auto flex flex-col items-center text-center px-5">
            <h2 className="font-medium text-3xl md:text-5xl leading-tight md:leading-tight text-gray-900 mb-3">
              {t("site.templates.page.create_resume.title")}
            </h2>
            <p className="max-w-xl text-xl text-gray-500 mb-10">
              {t("site.templates.page.create_resume.subtitle")}
            </p>

            {/* Period Selector */}
            <div className="mb-6 w-full max-w-sm">
              <select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                className="w-full p-2 border rounded-md bg-white"
              >
                <option value="month">
                  {t("site.pricing.options.monthly")}
                </option>
                <option value="quarter">
                  {t("site.pricing.options.quarterly")}
                </option>
                <option value="year">{t("site.pricing.options.yearly")}</option>
              </select>
            </div>

            <div className="text-4xl leading-normal sm:text-5xl font-medium text-gray-900">
              {
                pricingOptions[selectedPeriod as keyof typeof pricingOptions]
                  .price
              }{" "}
              XOF
            </div>
            <div className="text-sm text-gray-500">
              pour{" "}
              {selectedPeriod === "month"
                ? "30"
                : selectedPeriod === "quarter"
                ? "90"
                : "365"}{" "}
              jours
            </div>
            <div className="text-center text-sm text-gray-500 mt-2">
              <p>{t("site.pricing.auto_renewal")}</p>
            </div>
            <div className="flex w-full max-w-sm mt-6">
              <Link
                href="#"
                className="w-full outline-none inline-flex border justify-center rounded-[5px] relative overflow-hidden focus-visible:ring-4 ring-brand-200 items-center bg-brand-500 active:bg-brand-300 can-hover:active:bg-brand-300 text-white border-transparent can-hover:hover:bg-brand-400 font-medium py-3 ps-3 pe-3 text-base"
              >
                <div>
                  {t("site.pricing.try_for_days", {
                    days:
                      selectedPeriod === "month"
                        ? "30"
                        : selectedPeriod === "quarter"
                        ? "90"
                        : "365",
                  })}{" "}
                  <span>
                    {
                      pricingOptions[
                        selectedPeriod as keyof typeof pricingOptions
                      ].price
                    }{" "}
                    XOF
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
