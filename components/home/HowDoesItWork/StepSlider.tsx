"use client";

import { useState, useEffect } from "react";
import StepCard from "./SetpCard";
import Image from "next/image";

const steps = [
  {
    number: 1,
    title: "Remplissez vos infos",
    description:
      "Vous commencez par saisir vos infos qui constituent le contenu de votre CV.",
    image: "/assets/how-it-works-step-1.svg",
  },
  {
    number: 2,
    title: "Choisissez un modèle",
    description:
      "Choisissez un modèle de CV et personnalisez-le en fonction de votre personnalité et style.",
    image: "/assets/how-it-works-step-2.svg",
  },
  {
    number: 3,
    title: "Télécharger le CV",
    description:
      "Téléchargez votre CV immédiatement et modifiez-le à tout moment. Simplissime !",
    image: "/assets/how-it-works-step-3.svg",
  },
];

const STEP_ORDER = [0, 1, 2]; // Explicit step order
const PROGRESS_INCREMENT = 1; // Speed of progress
const INTERVAL_DELAY = 100; // Milliseconds between progress updates

export default function StepSlider() {
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

  return (
    <section className="max-w-[1150px] mx-auto px-[20px] py-20 w-full flex flex-col items-center">
      <h1 className="text-gray-900 font-medium text-3xl md:text-5xl mb-12">
        Comment ça marche ?
      </h1>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              number={step.number}
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
                  src={step.image || `/placeholder.svg?text=Step${step.number}`}
                  alt={`CV template ${step.number}`}
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
