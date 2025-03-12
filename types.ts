export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  photo: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface ExperienceItem {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface InterestItem {
  name: string;
}

export interface CustomSectionItem {
  title: string;
  description: string;
}

export interface CVData {
  personalInfo: PersonalInfoData;
  profile: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  interests: InterestItem[];
  [key: string]: any; // Allow for custom sections
}

export interface CoverLetterData {
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
  recipient: {
    description: string;
    name: string;
    company: string;
    address: string;
    postalCode: string;
    city: string;
  };
  dateAndSubject: {
    date: string;
    location: string;
    subject: string;
  };
  introduction: string;
  currentSituation: string;
  motivation: string;
  conclusion: string;
}
