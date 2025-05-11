import CVBuilder from "@/components/cv-templates/cv-builder";

export default function CreateCVPage() {
  const initialData: CVData = {
    personalInfo: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      photo: "",
    },
    profile: "",
    education: [],
    experience: [],
    skills: [],
    languages: [],
    interests: [],
  };

  return (
    <div className="container mx-auto py-6">
      <CVBuilder initialData={initialData} />
    </div>
  );
}
