import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const placeholderData = {
  personalInfo: {
    firstName: "Votre Prénom",
    lastName: "Votre Nom",
    title: "Votre Titre Professionnel",
    email: "votre.email@exemple.com",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de l'Exemple",
    postalCode: "75000",
    city: "Paris",
    photo: "/placeholder-user.jpg",
  },
  profile: "Professionnel expérimenté avec plus de X années d'expérience dans le domaine de [votre domaine]. Passionné par [vos centres d'intérêt professionnels] et expert en [vos compétences clés]. À la recherche de nouvelles opportunités pour mettre à profit mes compétences en [domaine] et contribuer au succès d'une entreprise innovante.",
  education: [
    {
      school: "Université Example",
      degree: "Master en [Votre Domaine]",
      startDate: "2018",
      endDate: "2020",
      current: false,
      description: "Spécialisation en [votre spécialité]. Projets majeurs réalisés dans [domaine]."
    },
    {
      school: "École Exemple",
      degree: "Licence en [Votre Domaine]",
      startDate: "2015",
      endDate: "2018",
      current: false,
      description: "Formation approfondie en [domaine]. Participation active aux projets étudiants."
    }
  ],
  experience: [
    {
      position: "Poste Exemple",
      company: "Entreprise Example",
      location: "Paris, France",
      startDate: "2020",
      endDate: "Présent",
      current: true,
      description: "• Gestion de projets importants dans [domaine]\n• Direction d'une équipe de X personnes\n• Amélioration des processus de [domaine]\n• Réalisation d'objectifs clés"
    },
    {
      position: "Poste Précédent",
      company: "Entreprise Précédente",
      location: "Lyon, France",
      startDate: "2018",
      endDate: "2020",
      current: false,
      description: "• Développement de solutions pour [domaine]\n• Collaboration avec différentes équipes\n• Mise en place de [projet/processus]"
    }
  ],
  skills: [
    { name: "Compétence 1", level: 90 },
    { name: "Compétence 2", level: 85 },
    { name: "Compétence 3", level: 80 },
    { name: "Compétence 4", level: 75 },
  ],
  languages: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Anglais", level: "Professionnel" },
    { name: "Espagnol", level: "Intermédiaire" },
  ],
  interests: [
    { name: "Centre d'intérêt 1" },
    { name: "Centre d'intérêt 2" },
    { name: "Centre d'intérêt 3" },
  ],
};

export function getPlaceholderOrValue(section: string, field: string, value: any, parentField?: string) {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    if (parentField) {
      return placeholderData[section][parentField][field];
    }
    return placeholderData[section][field];
  }
  return value;
}

export function getArrayPlaceholderOrValue(section: string, array: any[], index: number) {
  if (!array || array.length <= index) {
    return placeholderData[section][index];
  }
  return array[index];
}
