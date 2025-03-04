"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

// Sample resume templates
const resumeTemplates = [
  {
    name: "Template 1",
    image: "/assets/resume1.png",
  },
  {
    name: "Template 2",
    image: "/assets/resume2.jpg",
  },
  {
    name: "Template 3",
    image: "/assets/resume3.png",
  },
  {
    name: "Template 4",
    image: "/assets/resume4.png",
  },
  {
    name: "Template 5",
    image: "/assets/resume5.svg",
  },
  {
    name: "Template 6",
    image: "/assets/resume1.png",
  },
];

export default function ResumeShowcase() {
  return (
    <div className="relative h-[800px] overflow-hidden flex gap-6 p-6">
      {/* Left column - moves bottom to top */}
      <div className="w-1/2 relative overflow-hidden">
        <div className="animate-marquee-up flex flex-col gap-6">
          {/* First set of images */}
          {resumeTemplates.map((template, index) => (
            <div
              key={`left-${index}`}
              className="rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105"
            >
              <Image
                src={template.image}
                alt={`CV ${template.name}`}
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {resumeTemplates.map((template, index) => (
            <div
              key={`left-duplicate-${index}`}
              className="rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105"
            >
              <Image
                src={template.image}
                alt={`CV ${template.name}`}
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right column - moves top to bottom */}
      <div className="w-1/2 relative overflow-hidden">
        <div className="animate-marquee-down flex flex-col gap-6">
          {/* First set of images */}
          {resumeTemplates.map((template, index) => (
            <div
              key={`right-${index}`}
              className="rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105"
            >
              <Image
                src={template.image}
                alt={`CV ${template.name}`}
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {resumeTemplates.map((template, index) => (
            <div
              key={`right-duplicate-${index}`}
              className="rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105"
            >
              <Image
                src={template.image}
                alt={`CV ${template.name}`}
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
