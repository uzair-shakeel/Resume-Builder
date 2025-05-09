"use client";

import { Check, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Pricing() {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
  };

  const pricingOptions = {
    month: {
      price: "14,99",
      trial: "0,99",
      period: t("site.pricing.period.month"),
      fullPrice: "1499",
    },
    quarter: {
      price: "39,99",
      trial: "0,99",
      period: t("site.pricing.period.quarter"),
      fullPrice: "3999",
    },
    year: {
      price: "139,99",
      trial: "0,99",
      period: t("site.pricing.period.year"),
      fullPrice: "13999",
    },
  };

  const features = [
    t("site.pricing.features.unlimited_cv"),
    t("site.pricing.features.cover_letters"),
    t("site.pricing.features.job_alerts"),
    t("site.pricing.features.track_applications"),
  ];

  return (
    <main>
      <Header />
      <section className="w-full bg-background pt-40 pb-32">
        <div className="max-w-[864px] mx-auto px-5 text-center">
          <h1 className="text-3xl md:text-5xl font-medium font-header mb-6 leading-tight md:leading-tight text-gray-900">
            {t("site.pricing.title")}
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            {t("site.pricing.subtitle")}
          </p>

          <div className="flex flex-start items-center">
            <div className="mt-12 flex flex-col bg-white shadow-md mx-auto w-full max-w-sm rounded-md mb-12">
              {/* Period Selector */}
              <div className="mt-2 px-4 w-full">
                <div className="py-2">
                  <div className="relative">
                    <select
                      data-value={selectedPeriod}
                      id="pricing-recurring-period-select"
                      className="w-full appearance-none outline-none border focus:border-brand-400 focus:bg-brand-50 rounded py-2 px-3 text-base text-base text-gray-400 border-transparent bg-gray-100"
                      required
                      value={selectedPeriod}
                      onChange={handlePeriodChange}
                    >
                      <option value="month" className="bg-white text-gray-800">
                        {t("site.pricing.options.monthly")}
                      </option>
                      <option
                        value="quarter"
                        className="bg-white text-gray-800"
                      >
                        {t("site.pricing.options.quarterly")}
                      </option>
                      <option value="year" className="bg-white text-gray-800">
                        {t("site.pricing.options.yearly")}
                      </option>
                    </select>
                    <div className="absolute flex top-0 end-0 bottom-0 px-2 pointer-events-none transform rotate-180">
                      <span className="relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                          className="w-5 ms-auto text-gray-500 h-full"
                        >
                          <path
                            fill="currentColor"
                            d="M480-542.463 317.076-379.539q-8.307 8.308-20.884 8.5t-21.268-8.5q-8.693-8.692-8.693-21.076t8.693-21.077l179.769-179.769q5.615-5.615 11.846-7.923T480-611.691t13.461 2.307q6.231 2.308 11.846 7.923l179.769 179.769q8.308 8.308 8.5 20.884t-8.5 21.269T664-370.847t-21.076-8.692z"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="p-4">
                <div className="text-center text-sm">
                  <div className="relative py-2 mt-4 mb-5 flex justify-center items-end ">
                    <span className="text-gray-400">
                      <span
                        id="pricing-recurring-fee"
                        className="text-4xl leading-normal sm:text-5xl font-medium text-gray-900"
                      >
                        {
                          pricingOptions[
                            selectedPeriod as keyof typeof pricingOptions
                          ].fullPrice
                        }
                        &nbsp;XOF
                      </span>{" "}
                      <span id="pricing-per-period">
                        /{" "}
                        {
                          pricingOptions[
                            selectedPeriod as keyof typeof pricingOptions
                          ].period
                        }
                      </span>
                    </span>
                  </div>
                  <p className="text-gray-500">
                    {t("site.pricing.auto_renewal")}
                  </p>
                </div>
                <div className="mt-2">
                  <div className="flex w-full">
                    <Link
                      id="pricing-get-started"
                      className="outline-none inline-flex border justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center w-full bg-brand-500 active:bg-brand-300 can-hover:active:bg-brand-300 text-white border-transparent can-hover:hover:bg-brand-400 font-medium py-1 ps-3 pe-3 text-base"
                      href="#"
                    >
                      <div className="   ">
                        {t("site.pricing.try_for_days", { days: 14 })}{" "}
                        <span id="pricing-trial-fee">
                          {
                            pricingOptions[
                              selectedPeriod as keyof typeof pricingOptions
                            ].trial
                          }
                          &nbsp;XOF
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Features List */}
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="w-full py-4 border-t border-gray-200 flex justify-center text-sm text-gray-700 px-6 relative"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 absolute start-5 top-5 text-gray-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
