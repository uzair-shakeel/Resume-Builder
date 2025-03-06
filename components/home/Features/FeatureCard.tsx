"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";

interface FeatureCardProps {
  lightIcon: string;
  darkIcon: string;
  title: string;
  description: string;
  isActive: boolean;
  progress: number;
  onClick: () => void;
}

export default function FeatureCard({
  lightIcon,
  darkIcon,
  title,
  description,
  isActive,
  progress,
  onClick,
}: FeatureCardProps) {
  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <button
      className="group p-4 min-w-[350px] flex flex-row items-start justify-start text-start gap-5 rounded focus-visible:ring-4 ring-brand-200"
      onClick={onClick}
    >
      <div className="relative border-transparent flex items-center justify-center rounded-full w-12 h-12 min-w-12 flex-grow-0">
        <svg width="48" height="48" viewBox="0 0 48 48">
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="white"
            stroke="#D1D5DB"
            strokeWidth="2"
          />

          {/* Progress circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke={isActive ? "#4F46E5" : "#D1D5DB"}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
            className="transition-all duration-100 ease-linear"
          />

          {/* Icon */}
          <foreignObject x="12" y="12" width="24" height="24">
            <div className="h-full w-full flex items-center justify-center">
              <Image
                src={isActive ? lightIcon : darkIcon}
                alt={title}
                width={24}
                height={24}
                className="w-6 h-6"
                loading="lazy"
              />
            </div>
          </foreignObject>
        </svg>
      </div>

      <div className="flex-1 space-y-3">
        <h3
          className={`text-xl font-medium text-gray-500 ${
            isActive
              ? "lg:text-brand-500"
              : "can-hover:group-hover:text-gray-700"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-lg text-gray-500 ${
            isActive
              ? "lg:text-gray-700"
              : "can-hover:group-hover:text-gray-700"
          }`}
        >
          {description}
        </p>
      </div>
    </button>
  );
}
