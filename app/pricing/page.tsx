"use client";

import { Check, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

const features = [
  "Créez des CV en illimité",
  "Générez des lettres de motivation",
  "Alertes pour les offres d'emplois",
  "Suivez vos candidatures",
];

const periods = [
  { label: "Mensuel", value: "monthly", price: "14,99" },
  { label: "Annuel", value: "yearly", price: "149,99" },
];

export default function Pricing() {
  return (
    <main>
      <Header />
      <section className="py-20 bg-[#f9f9f8]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Prix</h1>
            <p className="text-gray-600 text-lg mb-12">
              Un prix unique, toutes les fonctionnalités, en illimité.
            </p>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              {/* Period Selector */}
              <Select.Root defaultValue="monthly">
                <Select.Trigger
                  className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg flex items-center justify-between mb-8 hover:bg-gray-100 transition-colors"
                  aria-label="Sélectionnez une période"
                >
                  <Select.Value placeholder="Sélectionnez une période" />
                  <Select.Icon>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
                    <Select.Viewport className="p-1">
                      {periods.map((period) => (
                        <Select.Item
                          key={period.value}
                          value={period.value}
                          className={cn(
                            "relative flex items-center px-8 py-2 rounded-md text-sm text-gray-900",
                            "hover:bg-gray-100 cursor-default outline-none"
                          )}
                        >
                          <Select.ItemText>{period.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>

              {/* Price Display */}
              <div className="text-center mb-2">
                <div className="inline-flex items-baseline">
                  <span className="text-5xl font-bold">14,99 US$</span>
                  <span className="text-gray-500 ml-2">/ mois</span>
                </div>
              </div>

              <div className="text-center text-gray-500 text-sm mb-8">
                (renouvellement automatique)
              </div>

              {/* CTA Button */}
              <button className="w-full bg-[#173dff] text-white rounded-lg py-3 px-4 font-medium hover:bg-blue-600 transition-colors mb-8">
                Essayez 14 jours pour 0,99 US$
              </button>

              {/* Features List */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-[#173dff] mr-4 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
