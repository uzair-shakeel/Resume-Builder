import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define the type for placeholderData with an index signature
interface PlaceholderData {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    postalCode: string;
    city: string;
    photo: string;
  };
  profile: string;
  education: Array<{
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  experience: Array<{
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  skills: Array<{
    name: string;
    level: number;
  }>;
  languages: Array<{
    name: string;
    level: string;
  }>;
  interests: Array<{
    name: string;
  }>;
  references: Array<{
    name: string;
    company: string;
    phone: string;
    email: string;
  }>;
  socials: Array<{
    platform: string;
    url: string;
  }>;
  [key: string]: any; // Index signature to allow string indexing
}

export const placeholderData: PlaceholderData = {
  personalInfo: {
    firstName: "Sherlock",
    lastName: "Holmes",
    title: "Consulting Detective",
    email: "sherlock.holmes@detective.com",
    phone: "+44 20 7946 0123",
    address: "221B Baker Street",
    postalCode: "NW1 6XE",
    city: "London",
    photo: "/placeholder-logo.svg",
  },
  profile:
    "Highly analytical consulting detective with exceptional observational skills and expertise in criminal psychology. Specializing in solving complex cases that baffle conventional investigators. Known for attention to detail, logical reasoning, and the science of deduction.",
  education: [
    {
      school: "University of London",
      degree: "Master of Science in Chemistry",
      startDate: "2010",
      endDate: "2012",
      current: false,
      description:
        "Specialized in forensic chemistry and toxicology. Graduated with honors.",
    },
    {
      school: "Oxford University",
      degree: "Bachelor of Science in Criminal Psychology",
      startDate: "2006",
      endDate: "2010",
      current: false,
      description:
        "Focused on behavioral analysis and criminal profiling. Thesis on patterns of serial offenders.",
    },
  ],
  experience: [
    {
      position: "Consulting Detective",
      company: "Self-Employed",
      location: "London, UK",
      startDate: "2012",
      endDate: "Present",
      current: true,
      description:
        "• Solved over 100 complex criminal cases in collaboration with Scotland Yard\n• Developed innovative methods for crime scene analysis and evidence collection\n• Provided expert consultation to international law enforcement agencies\n• Published research on criminal behavior patterns and forensic techniques",
    },
    {
      position: "Forensic Analyst",
      company: "Metropolitan Police",
      location: "London, UK",
      startDate: "2010",
      endDate: "2012",
      current: false,
      description:
        "• Analyzed crime scene evidence using advanced chemical techniques\n• Assisted detectives with technical aspects of investigations\n• Developed new protocols for evidence preservation and analysis\n• Trained junior staff in forensic methodologies",
    },
  ],
  skills: [
    { name: "Deductive Reasoning", level: 5 },
    { name: "Forensic Analysis", level: 5 },
    { name: "Criminal Psychology", level: 4 },
    { name: "Disguise & Infiltration", level: 4 },
    { name: "Chemical Analysis", level: 5 },
    { name: "Combat Skills", level: 3 },
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "French", level: "Fluent" },
    { name: "German", level: "Intermediate" },
    { name: "Latin", level: "Basic" },
  ],
  interests: [
    { name: "Violin" },
    { name: "Boxing" },
    { name: "Chemistry" },
    { name: "Beekeeping" },
    { name: "Literature" },
  ],
  references: [
    {
      name: "Dr. John Watson",
      company: "Medical Practice",
      phone: "+44 20 7946 0456",
      email: "john.watson@medical.co.uk",
    },
    {
      name: "Inspector Lestrade",
      company: "Scotland Yard",
      phone: "+44 20 7946 0789",
      email: "g.lestrade@scotlandyard.gov.uk",
    },
  ],
  socials: [
    {
      platform: "Website",
      url: "www.thescienceofdeduction.co.uk",
    },
    {
      platform: "LinkedIn",
      url: "linkedin.com/in/sherlock-holmes",
    },
    {
      platform: "Twitter",
      url: "twitter.com/consulting_detective",
    },
  ],
};

export function getPlaceholderOrValue(
  section: string,
  field: string,
  value: any,
  parentField?: string
) {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    if (parentField) {
      return placeholderData[section]?.[parentField]?.[field] || "";
    }
    return placeholderData[section]?.[field] || "";
  }
  return value;
}

export function getArrayPlaceholderOrValue(
  section: string,
  array: any[],
  index: number
) {
  if (!array || array.length === 0 || !array[index]) {
    return placeholderData[section]?.[index] || null;
  }
  return array[index];
}
