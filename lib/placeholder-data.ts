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
  };
  recipient: {
    company: string;
    name: string;
    address: string;
    postalCode: string;
    city: string;
  };
  dateAndSubject: {
    location: string;
    subject: string;
  };
  sections: {
    introduction: string;
    currentSituation: string;
    motivation: string;
    conclusion: string;
  };
}

export const placeholderData: Record<string, PlaceholderData> = {
  fr: {
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      title: "Professional Title",
      email: "email@example.com",
      phone: "+33 6 12 34 56 78",
      address: "123 Rue Example",
      postalCode: "75000",
      city: "Paris",
    },
    recipient: {
      company: "Entreprise XYZ",
      name: "Responsable Recrutement",
      address: "456 Avenue Business",
      postalCode: "75001",
      city: "Paris",
    },
    dateAndSubject: {
      location: "Paris",
      subject: "Candidature pour le poste de [Poste]",
    },
    sections: {
      introduction:
        "Je me permets de vous écrire concernant le poste de [Poste] que vous proposez. Ayant découvert votre annonce sur [Site], je souhaite vous faire part de ma candidature.",
      currentSituation:
        "Actuellement [Poste actuel] chez [Entreprise] à [Ville], je suis en charge de [Responsabilités]. Cette expérience m'a permis de développer de solides compétences en [Compétences clés].",
      motivation:
        "Votre entreprise m'intéresse particulièrement pour [Aspect spécifique]. Mes compétences en [Compétences clés] et mon expertise en [Domaine d'expertise] seraient des atouts pour contribuer aux [Projets/Objectifs de l'entreprise].",
      conclusion:
        "Je me tiens à votre disposition pour échanger plus en détail sur ma candidature lors d'un entretien. Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
    },
  },
  en: {
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      title: "Professional Title",
      email: "email@example.com",
      phone: "+1 234 567 8900",
      address: "123 Example Street",
      postalCode: "10001",
      city: "New York",
    },
    recipient: {
      company: "XYZ Company",
      name: "HR Manager",
      address: "456 Business Avenue",
      postalCode: "10002",
      city: "New York",
    },
    dateAndSubject: {
      location: "New York",
      subject: "Application for [Position]",
    },
    sections: {
      introduction:
        "I am writing to express my interest in the [Position] position at your company. Having discovered your job posting on [Platform], I would like to submit my application.",
      currentSituation:
        "Currently working as a [Current Position] at [Company] in [City], I am responsible for [Responsibilities]. This experience has allowed me to develop strong skills in [Key Skills].",
      motivation:
        "Your company particularly interests me because of [Specific Aspect]. My skills in [Key Skills] and expertise in [Field of Expertise] would be valuable assets in contributing to [Company Projects/Goals].",
      conclusion:
        "I would welcome the opportunity to discuss my application in more detail during an interview. Thank you for considering my application. I look forward to your response.",
    },
  },
};

// Helper function to get placeholder value based on language
export const getPlaceholder = (
  section: keyof PlaceholderData,
  field: string,
  value: string | undefined,
  language: string = "fr"
): string => {
  const data = placeholderData[language];
  if (!data) return value || "";

  if (
    section === "personalInfo" ||
    section === "recipient" ||
    section === "dateAndSubject"
  ) {
    return value || (data[section] as any)[field] || "";
  }

  if (section === "sections") {
    return value || data.sections[field as keyof typeof data.sections] || "";
  }

  return value || "";
};
