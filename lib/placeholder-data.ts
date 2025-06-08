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
      firstName: " ",
      lastName: " ",
      title: " ",
      email: " ",
      phone: " ",
      address: " ",
      postalCode: " ",
      city: " ",
    },
    recipient: {
      company: " ",
      name: " ",
      address: " ",
      postalCode: " ",
      city: " ",
    },
    dateAndSubject: {
      location: " ",
      subject: " ",
    },
    sections: {
      introduction: " ",
      currentSituation: " ",
      motivation: " ",
      conclusion: " ",
    },
  },
  en: {
    personalInfo: {
      firstName: " ",
      lastName: " ",
      title: " ",
      email: " ",
      phone: " ",
      address: " ",
      postalCode: " ",
      city: " ",
    },
    recipient: {
      company: " ",
      name: " ",
      address: " ",
      postalCode: " ",
      city: " ",
    },
    dateAndSubject: {
      location: " ",
      subject: " ",
    },
    sections: {
      introduction: " ",
      currentSituation: " ",
      motivation: " ",
      conclusion: " ",
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
