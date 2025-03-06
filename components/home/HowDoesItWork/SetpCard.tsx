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
  const radius = 23;
  const circumference = 2 * Math.PI * radius;

  // The dashOffset should start at circumference (empty circle) and go to 0 (full circle)
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <button
      className="group p-4 flex flex-1 flex-col lg:flex-row items-center lg:items-start justify-start text-start rounded focus-visible:ring-4 ring-brand-200 gap-5"
      onClick={onClick}
    >
      <div className="relative border-transparent flex items-center justify-center rounded-full w-12 h-12 min-w-[48px] flex-grow-0">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="absolute start-0 top-0"
        >
          {/* Background circle */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="white"
            stroke="#D1D5DB"
            strokeWidth="2"
          />

          {/* Blue progress circle */}
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

          {/* Number */}
          <text
            x="24"
            y="24"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="14"
            fontWeight={isActive ? "bold" : ""}
            fill={isActive ? "#4F46E5" : "#6B7280"}
            className="can-hover:group-hover:text-gray-700"
          >
            {number}
          </text>
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
