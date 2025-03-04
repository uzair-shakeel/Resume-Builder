"use client";

import { useState, useEffect } from "react";
import FeatureCard from "./FeatureCard";
import { FileText, Mail, Briefcase, FolderOpen } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: FileText,
    title: "CV",
    description:
      "Créez de manière illimitée de nouveaux CV et modifiez-les à tout moment.",
    image: "/assets/our-tools-step-1.svg",
  },
  {
    icon: Mail,
    title: "Lettre de motivation",
    description:
      "Écrivez facilement des lettres de motivation professionnelles.",
    image: "/assets/our-tools-step-2.svg",
  },
  {
    icon: Briefcase,
    title: "Offres d'emplois",
    description:
      "Soyez informés automatiquement des offres d'emploi pertinentes pour vous.",
    image: "/assets/our-tools-step-3.svg",
  },
  {
    icon: FolderOpen,
    title: "Candidatures",
    description: "Organisez toutes vos candidatures de manière claire.",
    image: "/assets/our-tools-step-4.svg",
  },
];

const STEP_ORDER = [0, 1, 2, 3];
const PROGRESS_INCREMENT = 1;
const INTERVAL_DELAY = 40;

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
    <section className="max-w-[1150px] mx-auto px-4 md:px-5 py-20">
      <h1 className="text-4xl font-bold text-center mb-16">Fonctionnalités</h1>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Features list */}
        <div className="w-full lg:w-1/2 space-y-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              Icon={feature.icon}
              title={feature.title}
              description={feature.description}
              isActive={index === currentFeatureIndex}
              progress={index === currentFeatureIndex ? progress : 0}
              onClick={() => handleFeatureClick(index)}
            />
          ))}
        </div>

        {/* Feature preview */}
        <div className="w-full lg:w-1/2">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`transition-opacity duration-500 ${
                index === currentFeatureIndex
                  ? "opacity-100"
                  : "opacity-0 hidden"
              }`}
            >
              <Image
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                width={500}
                height={800}
                className="w-full h-auto"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
