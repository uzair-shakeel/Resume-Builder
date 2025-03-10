export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  photo?: string;
}

export interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface Experience {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Language {
  name: string;
  level: string;
}

export interface Interest {
  name: string;
}

export interface Reference {
  name: string;
  company: string;
  phone: string;
  email: string;
}

export interface Social {
  platform: string;
  url: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  profile?: string;
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
  languages?: Language[];
  interests?: Interest[];
  references?: Reference[];
  socials?: Social[];
  [key: string]: any; // Allow for custom sections
}
