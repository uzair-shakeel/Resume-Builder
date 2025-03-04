"use client";

import { useState, useEffect } from "react";
import StepCard from "./SetpCard";
import { ChevronLeft, Download } from "lucide-react";
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

const SLIDE_DURATION = 4000; // 4 seconds in milliseconds

export default function StepSlider() {
  const [activeStep, setActiveStep] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!autoplayEnabled) return;

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          // Ensure we go from 0 to 1 to 2 sequentially
          setActiveStep((prevStep) => {
            if (prevStep >= steps.length - 1) {
              return 0; // Reset to first step after last step
            }
            return prevStep + 1; // Otherwise, move to next step
          });
          return 0;
        }
        return prevProgress + 100 / (SLIDE_DURATION / 100); // Increase by percentage per 100ms
      });
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(timer);
  }, [autoplayEnabled]);

  useEffect(() => {
    setProgress(0);
  }, []); // Removed activeStep from dependencies

  const handleManualStepChange = (index: number) => {
    setAutoplayEnabled(false);
    setActiveStep(index);
    setProgress(0);

    setTimeout(() => {
      setAutoplayEnabled(true);
    }, 5000);
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <StepCard
            key={step.number}
            number={step.number}
            title={step.title}
            description={step.description}
            isActive={index === activeStep}
            progress={
              index === activeStep
                ? progress
                : index < activeStep
                ? 100
                : index > activeStep
                ? 0
                : 0
            }
            onClick={() => handleManualStepChange(index)}
          />
        ))}
      </div>

      {/* Preview area (unchanged) */}
      <div className="relative w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative aspect-[16/9] w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === activeStep
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={step.image || `/placeholder.svg?height=600&width=1200`}
                alt={`CV template ${step.number}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Template selection thumbnails */}
        <div className="flex justify-center p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-4 gap-4 max-w-2xl">
            {[1, 2, 3, 4].map((template) => (
              <div
                key={template}
                className={`relative aspect-[3/4] w-24 border-2 rounded cursor-pointer hover:opacity-90 transition-all ${
                  template === 1 ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={`/placeholder.svg?height=120&width=90&text=Template${template}`}
                  alt={`Template ${template}`}
                  fill
                  className="object-cover rounded"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 text-xs p-1 text-center">
                  {template === 1
                    ? "Professional"
                    : template === 2
                    ? "Chrono"
                    : template === 3
                    ? "Elegant"
                    : "Circular"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
