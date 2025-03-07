"use client";

import { useState, useEffect } from "react";
import FeatureCard from "./FeatureCard";
import Image from "next/image";

const features = [
  {
    lightIcon: "/assets/resume-light.svg",
    darkIcon: "/assets/resume-dark.svg",
    title: "CV",
    description:
      "Créez de manière illimitée de nouveaux CV et modifiez-les à tout moment.",
    image: "/assets/our-tools-step-1.svg",
  },
  {
    lightIcon: "/assets/letter-light.svg",
    darkIcon: "/assets/letter-dark.svg",
    title: "Lettre de motivation",
    description:
      "Écrivez facilement des lettres de motivation professionnelles.",
    image: "/assets/our-tools-step-2.svg",
  },
  {
    lightIcon: "/assets/businesscenter-light.svg",
    darkIcon: "/assets/businesscenter-dark.svg",
    title: "Offres d'emplois",
    description:
      "Soyez informés automatiquement des offres d'emploi pertinentes pour vous.",
    image: "/assets/our-tools-step-3.svg",
  },
  {
    lightIcon: "/assets/applications-light.svg",
    darkIcon: "/assets/applications-dark.svg",
    title: "Candidatures",
    description: "Organisez toutes vos candidatures de manière claire.",
    image: "/assets/our-tools-step-4.svg",
  },
];

const STEP_ORDER = [0, 1, 2, 3];
const PROGRESS_INCREMENT = 1;
const INTERVAL_DELAY = 100;

export default function FeaturesSlider() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          const currentPosition = STEP_ORDER.indexOf(currentFeatureIndex);
          const nextPosition = (currentPosition + 1) % STEP_ORDER.length;
          setCurrentFeatureIndex(STEP_ORDER[nextPosition]);
          return 0;
        }
        return prevProgress + PROGRESS_INCREMENT;
      });
    }, INTERVAL_DELAY);

    return () => clearInterval(timer);
  }, [currentFeatureIndex]);

  const handleFeatureClick = (index: number) => {
    if (STEP_ORDER.includes(index)) {
      setCurrentFeatureIndex(index);
      setProgress(0);
    }
  };

  return (
    <section className="max-w-[1150px] w-full mx-auto pt-20 px-5 flex flex-col items-center">
      <h1 className="text-gray-900 font-medium text-3xl md:text-5xl mb-12">
        Fonctionnalités
      </h1>

      <div className="flex w-full flex-col lg:flex-row items-center lg:items-start">
        {/* Features list */}
        <div className="pb-10 lg:pb-16 w-full lg:w-2/5">
          <div className="w-full flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pe-0 md:pe-5 lg:pe-10">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                lightIcon={feature.lightIcon}
                darkIcon={feature.darkIcon}
                title={feature.title}
                description={feature.description}
                isActive={index === currentFeatureIndex}
                progress={index === currentFeatureIndex ? progress : 0}
                onClick={() => handleFeatureClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Feature preview */}
        <div className="relative w-full self-end lg:w-3/5 pb-[80%] sm:pb-[70%] md:pb-[60%] lg:pb-[50%]">
          {features.map((feature, index) => (
            <Image
              key={index}
              src={feature.image || "/placeholder.svg"}
              alt={feature.title}
              fill
              className={`absolute w-full h-full lg:h-auto lg:bottom-0 rounded-md transition-opacity duration-500 ${
                index === currentFeatureIndex
                  ? "opacity-100 block"
                  : "opacity-0 hidden"
              }`}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
