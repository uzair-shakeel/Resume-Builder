"use client";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  progress: number;
  onClick: () => void;
}

export default function StepCard({
  number,
  title,
  description,
  isActive,
  progress,
  onClick,
}: StepCardProps) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  // The dashOffset should start at circumference (empty circle) and go to 0 (full circle)
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div
      className={`flex items-start space-x-4 p-4 rounded-lg cursor-pointer transition-all ${
        isActive ? "bg-white shadow-md" : "bg-transparent hover:bg-gray-50"
      }`}
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
            stroke="#E5E7EB"
            strokeWidth="1"
          />

          {/* Blue progress circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke={isActive ? "#4F46E5" : "#E2E8F0"}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
            className="transition-all duration-100 ease-linear"
          />

          {/* Number */}
          <text
            x="24"
            y="24"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="14"
            fontWeight="bold"
            fill={isActive ? "#4F46E5" : "#94A3B8"}
          >
            {number}
          </text>
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
    </div>
  );
}
