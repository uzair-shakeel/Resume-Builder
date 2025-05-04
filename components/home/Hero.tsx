"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col items-center max-w-[1150px] mx-auto">
      <h1 className="text-4xl leading-normal md:text-7xl font-medium font-header text-gray-900 mb-1 text-center">
        {t("site.home.hero.title")}
      </h1>
      <p className="max-w-xl text-lg md:text-xl text-gray-500 text-center mt-2 mb-9 tracking-wide">
        {t("site.home.hero.subtitle")}
      </p>
      <Link
        href="/builder"
        className="inline-flex border justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center bg-brand-500 active:bg-brand-300 active:bg-brand-300 text-white border-transparent hover:bg-brand-400 font-medium py-4 ps-9 pe-9 text-xl"
      >
        {t("site.home.hero.cta.primary")}
      </Link>
    </section>
  );
}
