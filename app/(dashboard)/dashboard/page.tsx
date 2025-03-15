"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Mail,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";

// Dynamically import all CV preview components
const CVPreviewAlt = dynamic(
  () => import("@/components/cv-templates/cv-preview-alt")
);
const CVPreviewClassic = dynamic(
  () => import("@/components/cv-templates/cv-preview-classic")
);
const CVPreviewPro = dynamic(
  () => import("@/components/cv-templates/cv-preview-pro")
);
const CVPreviewSherlock = dynamic(
  () => import("@/components/cv-templates/cv-preview-sherlock")
);
const CVPreviewHR = dynamic(
  () => import("@/components/cv-templates/cv-preview-hr")
);
const CVPreviewMinimal = dynamic(
  () => import("@/components/cv-templates/cv-preview-minimal")
);
const CVPreviewTeal = dynamic(
  () => import("@/components/cv-templates/cv-preview-teal")
);
const CVPreviewCirculaire = dynamic(
  () => import("@/components/cv-templates/cv-preview-circulaire")
);
const CVPreviewStudent = dynamic(
  () => import("@/components/cv-templates/cv-preview-student")
);

// Dynamically import cover letter preview components
const CoverLetterPreviewModern = dynamic(
  () => import("@/components/cover-letter-templates/cover-letter-preview-alt")
);
const CoverLetterPreviewClassic = dynamic(
  () =>
    import("@/components/cover-letter-templates/cover-letter-preview-classic")
);
const CoverLetterPreviewProfessional = dynamic(
  () =>
    import(
      "@/components/cover-letter-templates/cover-letter-preview-professional"
    )
);
const CoverLetterPreviewMinimal = dynamic(
  () =>
    import("@/components/cover-letter-templates/cover-letter-preview-minimal")
);
const CoverLetterPreviewCreative = dynamic(
  () =>
    import(
      "@/components/cover-letter-templates/cover-letter-preview-circulaire"
    )
);

interface CV {
  _id: string;
  title: string;
  template: string;
  lastEdited: string;
  createdAt: string;
  preview?: string;
  data?: any;
  sectionOrder?: string[];
  accentColor?: string;
  fontFamily?: string;
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
}

interface CoverLetter {
  _id: string;
  title: string;
  template: string;
  lastEdited: string;
  createdAt: string;
  preview?: string;
  data?: any;
  sectionOrder?: string[];
  accentColor?: string;
  fontFamily?: string;
  sectionPages?: Record<string, number>;
  customSectionNames?: Record<string, string>;
  customSections?: Record<string, string>;
}

// Add this component before the Dashboard component
const PreviewWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="w-full h-full"
      style={{ minWidth: "21cm", minHeight: "29.7cm" }}
    >
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

// Add formatRelativeTime function
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "Modifié à l'instant";
  } else if (diffInMinutes < 60) {
    return `Modifié il y a ${diffInMinutes} minute${
      diffInMinutes > 1 ? "s" : ""
    }`;
  } else if (diffInHours < 24) {
    return `Modifié il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
  } else if (diffInDays < 30) {
    return `Modifié il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
  } else if (diffInMonths < 12) {
    return `Modifié il y a ${diffInMonths} mois`;
  } else {
    return `Modifié il y a ${diffInYears} an${diffInYears > 1 ? "s" : ""}`;
  }
};

export default function Dashboard() {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loadingCVs, setLoadingCVs] = useState(true);
  const [loadingCoverLetters, setLoadingCoverLetters] = useState(true);
  const [renamingCV, setRenamingCV] = useState<string | null>(null);
  const [renamingCoverLetter, setRenamingCoverLetter] = useState<string | null>(
    null
  );
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();
  const [scale, setScale] = useState((0.6 + window.innerWidth) / 4600);

  useEffect(() => {
    const handleResize = () => {
      setScale((0.6 + window.innerWidth) / 4600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadCVs();
    loadCoverLetters();
  }, []);

  const loadCVs = async () => {
    try {
      const response = await fetch("/api/cv/load");
      const data = await response.json();

      if (data.success) {
        console.log("Loaded CVs:", data.cvs); // Debug log
        setCVs(data.cvs);
      }
    } catch (error) {
      console.error("Error loading CVs:", error);
    } finally {
      setLoadingCVs(false);
    }
  };

  const loadCoverLetters = async () => {
    try {
      const response = await fetch("/api/cover-letter/load");
      const data = await response.json();

      if (data.success) {
        console.log("Loaded Cover Letters:", data.coverLetters); // Debug log
        setCoverLetters(data.coverLetters);
      }
    } catch (error) {
      console.error("Error loading cover letters:", error);
    } finally {
      setLoadingCoverLetters(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) {
      return;
    }

    try {
      const response = await fetch(`/api/cv/delete?id=${cvId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the CV list
        loadCVs();
      } else {
        console.error("Failed to delete CV");
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
    }
  };

  const handleDeleteCoverLetter = async (coverId: string) => {
    if (!confirm("Are you sure you want to delete this cover letter?")) {
      return;
    }

    try {
      const response = await fetch(`/api/cover-letter/delete?id=${coverId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the cover letter list
        loadCoverLetters();
      } else {
        console.error("Failed to delete cover letter");
      }
    } catch (error) {
      console.error("Error deleting cover letter:", error);
    }
  };

  const startRenamingCV = (cv: CV) => {
    setRenamingCV(cv._id);
    setNewTitle(cv.title);
  };

  const startRenamingCoverLetter = (coverLetter: CoverLetter) => {
    setRenamingCoverLetter(coverLetter._id);
    setNewTitle(coverLetter.title);
  };

  const handleRenameCV = async (cvId: string) => {
    if (!newTitle.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/cv/rename", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cvId, newTitle: newTitle.trim() }),
      });

      if (response.ok) {
        // Refresh the CV list
        loadCVs();
      } else {
        console.error("Failed to rename CV");
      }
    } catch (error) {
      console.error("Error renaming CV:", error);
    } finally {
      setRenamingCV(null);
      setNewTitle("");
    }
  };

  const handleRenameCoverLetter = async (coverId: string) => {
    if (!newTitle.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/cover-letter/rename", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coverId, newTitle: newTitle.trim() }),
      });

      if (response.ok) {
        // Refresh the cover letter list
        loadCoverLetters();
      } else {
        console.error("Failed to rename cover letter");
      }
    } catch (error) {
      console.error("Error renaming cover letter:", error);
    } finally {
      setRenamingCoverLetter(null);
      setNewTitle("");
    }
  };

  const renderCVPreview = (cv: CV) => {
    // Default data structure
    const defaultData = {
      personalInfo: {
        firstName: "",
        lastName: "",
        title: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        city: "",
        photo: "/placeholder-user.jpg",
      },
      profile: "",
      education: [],
      experience: [],
      skills: [],
      languages: [],
      interests: [],
      references: [],
      socials: [],
    };

    const commonProps = {
      data: cv.data || defaultData,
      sectionOrder: cv.sectionOrder || [
        "personal-info",
        "profile",
        "education",
        "experience",
        "skills",
        "languages",
        "interests",
      ],
      accentColor: cv.accentColor || "#3b82f6",
      fontFamily: cv.fontFamily || "'DejaVu Sans', sans-serif",
      sectionPages: cv.sectionPages || {},
      customSectionNames: cv.customSectionNames || {},
    };

    const preview = (() => {
      switch (cv.template) {
        case "modern":
          return <CVPreviewAlt {...commonProps} />;
        case "classic":
          return <CVPreviewClassic {...commonProps} />;
        case "pro":
          return <CVPreviewPro {...commonProps} />;
        case "sherlock":
          return <CVPreviewSherlock {...commonProps} />;
        case "hr":
          return <CVPreviewHR {...commonProps} />;
        case "minimal":
          return <CVPreviewMinimal {...commonProps} />;
        case "teal":
          return <CVPreviewTeal {...commonProps} />;
        case "circulaire":
          return <CVPreviewCirculaire {...commonProps} />;
        case "student":
          return <CVPreviewStudent {...commonProps} />;
        default:
          return <CVPreviewAlt {...commonProps} />;
      }
    })();

    return <PreviewWrapper>{preview}</PreviewWrapper>;
  };

  const renderCoverLetterPreview = (coverLetter: CoverLetter) => {
    // Fallback to template-based preview
    const commonProps = {
      data: coverLetter.data || {
        personalInfo: { firstName: "", lastName: "" },
        recipient: {},
        dateAndSubject: {},
        introduction: "",
        currentSituation: "",
        motivation: "",
        conclusion: "",
      },
      sectionOrder: coverLetter.sectionOrder || [],
      accentColor: coverLetter.accentColor || "#3498db",
      fontFamily: coverLetter.fontFamily || "'DejaVu Sans', sans-serif",
      sectionPages: coverLetter.sectionPages || {},
      customSectionNames: coverLetter.customSectionNames || {},
      customSections: coverLetter.customSections || {},
    };

    try {
      const preview = (() => {
        switch (coverLetter.template) {
          case "modern":
            return <CoverLetterPreviewModern {...commonProps} />;
          case "classic":
            return <CoverLetterPreviewClassic {...commonProps} />;
          case "professional":
            return <CoverLetterPreviewProfessional {...commonProps} />;
          case "minimal":
            return <CoverLetterPreviewMinimal {...commonProps} />;
          case "circulaire":
            return <CoverLetterPreviewCreative {...commonProps} />;
          default:
            return <CoverLetterPreviewModern {...commonProps} />;
        }
      })();

      return <PreviewWrapper>{preview}</PreviewWrapper>;
    } catch (error) {
      console.error("Error rendering cover letter preview:", error);
      return (
        <div className="aspect-[210/297] w-full bg-white flex items-center justify-center">
          <div className="text-gray-400">Aperçu non disponible</div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-1 pt-20 lg:pt-5 pb-24">
        <div className="container mx-auto px-4">
          {/* CV Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Mes CV</h1>
              <Link
                href="/cv"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir tous
              </Link>
            </div>

            {/* CV grid content */}
            {loadingCVs ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : cvs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucun CV
                </h2>
                <p className="text-gray-500 mb-4">
                  Créez votre premier CV pour commencer
                </p>
                <button
                  onClick={() => router.push("/builder")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Créer un CV
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Create New CV Card */}
                <div className="relative aspect-[1/1.414] group">
                  <Link
                    href="/builder"
                    className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-blue-500">
                      <Plus className="w-8 h-8" />
                      <span className="font-medium">Créer un CV</span>
                    </div>
                  </Link>
                </div>

                {/* CV Cards - Show only first 3 */}
                {cvs.slice(0, 3).map((cv) => (
                  <div key={cv._id} className="relative group">
                    <div className="relative aspect-[1/1.414] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                      <Link
                        href={`/builder?id=${cv._id}`}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-full h-full relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-[21cm] transform origin-center"
                              style={{ transform: `scale(${scale})` }}
                            >
                              {renderCVPreview(cv)}
                            </div>
                          </div>
                        </div>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="absolute bottom-2 right-2 z-30 p-1.5 rounded-lg bg-white shadow-md hover:bg-gray-50 text-gray-600 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-50">
                          <DropdownMenuItem onClick={() => startRenamingCV(cv)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Renommer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteCV(cv._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-3">
                      {renamingCV === cv._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRenameCV(cv._id);
                              } else if (e.key === "Escape") {
                                setRenamingCV(null);
                                setNewTitle("");
                              }
                            }}
                            className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRenameCV(cv._id)}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Enregistrer
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-start items-start">
                          <h3 className="font-medium text-gray-900 truncate">
                            {cv.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(cv.lastEdited)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cover Letter Section */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Mes lettres de motivation</h1>
              <Link
                href="/cover-letter"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir tous
              </Link>
            </div>

            {/* Cover Letter grid content */}
            {loadingCoverLetters ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : coverLetters.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucune lettre de motivation
                </h2>
                <p className="text-gray-500 mb-4">
                  Créez votre première lettre de motivation pour commencer
                </p>
                <button
                  onClick={() => router.push("/builder/cover-letter")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Créer une lettre
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Create New Cover Letter Card */}
                <div className="relative aspect-[1/1.414] group">
                  <Link
                    href="/builder/cover-letter"
                    className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-blue-500">
                      <Plus className="w-8 h-8" />
                      <span className="font-medium">Créer une lettre</span>
                    </div>
                  </Link>
                </div>

                {/* Cover Letter Cards - Show only first 3 */}
                {coverLetters.slice(0, 3).map((coverLetter) => (
                  <div key={coverLetter._id} className="relative group">
                    <div className="relative aspect-[1/1.414] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                      <Link
                        href={`/builder/cover-letter?id=${coverLetter._id}`}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-full h-full relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-[21cm] transform origin-center"
                              style={{ transform: `scale(${scale})` }}
                            >
                              {renderCoverLetterPreview(coverLetter)}
                            </div>
                          </div>
                        </div>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="absolute bottom-2 right-2 z-30 p-1.5 rounded-lg bg-white shadow-md hover:bg-gray-50 text-gray-600 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-50">
                          <DropdownMenuItem
                            onClick={() =>
                              startRenamingCoverLetter(coverLetter)
                            }
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Renommer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteCoverLetter(coverLetter._id)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-3">
                      {renamingCoverLetter === coverLetter._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRenameCoverLetter(coverLetter._id);
                              } else if (e.key === "Escape") {
                                setRenamingCoverLetter(null);
                                setNewTitle("");
                              }
                            }}
                            className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() =>
                              handleRenameCoverLetter(coverLetter._id)
                            }
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Enregistrer
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-start items-start">
                          <h3 className="font-medium text-gray-900 truncate">
                            {coverLetter.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(coverLetter.lastEdited)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
