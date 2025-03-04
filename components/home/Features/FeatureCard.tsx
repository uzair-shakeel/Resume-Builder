"use client";

import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
  progress: number;
  onClick: () => void;
}

export default function FeatureCard({
  Icon,
  title,
  description,
  isActive,
  progress,
  onClick,
}: FeatureCardProps) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <button
      className="flex items-start text-left space-x-4 p-4 rounded-lg cursor-pointer transition-all"
      onClick={onClick}
    >
      <div className="relative flex-shrink-0 w-12 h-12">
        <svg width="48" height="48" viewBox="0 0 48 48">
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="white"
            stroke="#D1D5DB"
            strokeWidth="1"
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
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              />
            </div>
          </foreignObject>
        </svg>
      </div>

      <div className="flex-1">
        <h3
          className={`font-medium text-lg mb-1 ${
            isActive ? "text-blue-600" : "text-gray-800"
          }`}
        >
          {title}
        </h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </button>
  );
}
