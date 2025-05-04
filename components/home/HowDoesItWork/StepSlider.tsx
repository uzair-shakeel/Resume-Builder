"use client";

import { useState, useEffect } from "react";
import StepCard from "./SetpCard";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const STEP_ORDER = [0, 1, 2]; // Explicit step order
const PROGRESS_INCREMENT = 1; // Speed of progress
const INTERVAL_DELAY = 100; // Milliseconds between progress updates

export default function StepSlider() {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          // Get next step index
          const currentPosition = STEP_ORDER.indexOf(currentStepIndex);
          const nextPosition = (currentPosition + 1) % STEP_ORDER.length;
          setCurrentStepIndex(STEP_ORDER[nextPosition]);
          return 0;
        }
        return prevProgress + PROGRESS_INCREMENT;
      });
    }, INTERVAL_DELAY);

    return () => clearInterval(timer);
  }, [currentStepIndex]);

  const handleStepClick = (index: number) => {
    if (STEP_ORDER.includes(index)) {
      setCurrentStepIndex(index);
      setProgress(0);
    }
  };

  const steps = [
    {
      id: 1,
      title: t("site.home.steps.items.step1.title"),
      description: t("site.home.steps.items.step1.description"),
      icon: "/assets/how-it-works-step-1.svg",
    },
    {
      id: 2,
      title: t("site.home.steps.items.step2.title"),
      description: t("site.home.steps.items.step2.description"),
      icon: "/assets/how-it-works-step-2.svg",
    },
    {
      id: 3,
      title: t("site.home.steps.items.step3.title"),
      description: t("site.home.steps.items.step3.description"),
      icon: "/assets/how-it-works-step-3.svg",
    },
  ];

  return (
    <section className="max-w-[1150px] mx-auto px-[20px] py-20 w-full flex flex-col items-center">
      <h1 className="text-gray-900 font-medium text-3xl md:text-5xl mb-12">
        {t("site.home.steps.title")}
      </h1>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
          {steps.map((step, index) => (
            <StepCard
              key={step.id}
              number={step.id}
              title={step.title}
              description={step.description}
              isActive={index === currentStepIndex}
              progress={index === currentStepIndex ? progress : 0}
              onClick={() => handleStepClick(index)}
            />
          ))}
        </div>

        {/* Image Preview area */}
        <div className="relative hidden w-full lg:flex items-center justify-center shadow-md rounded-md">
          <div className="flex justify-center lg:min-h-[555px]">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-opacity duration-500 ${
                  index === currentStepIndex
                    ? "opacity-100"
                    : "opacity-0 hidden"
                }`}
              >
                <Image
                  src={step.icon || `/placeholder.svg?text=Step${step.id}`}
                  alt={`CV template ${step.id}`}
                  width={1100}
                  height={555}
                  className="max-w-full h-auto mx-auto"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
