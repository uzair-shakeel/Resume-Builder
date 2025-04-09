"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
import { useLanguage } from "@/contexts/LanguageContext";

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

// Add this component before the Dashboard component
const CVPreviewWrapper = ({ children }: { children: React.ReactNode }) => {
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
  const { t } = useLanguage();
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return t("site.dashboard.common.just_now");
  } else if (diffInMinutes < 60) {
    return `${t("site.dashboard.common.modified_prefix")} ${diffInMinutes} ${t(
      "site.dashboard.common.minutes_ago"
    )}`;
  } else if (diffInHours < 24) {
    return `${t("site.dashboard.common.modified_prefix")} ${diffInHours} ${t(
      "site.dashboard.common.hours_ago"
    )}`;
  } else if (diffInDays < 30) {
    return `${t("site.dashboard.common.modified_prefix")} ${diffInDays} ${t(
      "site.dashboard.common.days_ago"
    )}`;
  } else if (diffInMonths < 12) {
    return `${t("site.dashboard.common.modified_prefix")} ${diffInMonths} ${t(
      "site.dashboard.common.months_ago"
    )}`;
  } else {
    return `${t("site.dashboard.common.modified_prefix")} ${diffInYears} ${t(
      "site.dashboard.common.years_ago"
    )}`;
  }
};

export default function CVDashboard() {
  const { t } = useLanguage();
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [renamingCV, setRenamingCV] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const getScale = (width: number): number => {
      if (width >= 1500) {
        return (0.8 + width) / 5400;
      } else if (width >= 1280) {
        return (0.6 + width) / 4800;
      } else if (width >= 1024) {
        return (0.6 + width) / 4000;
      } else if (width >= 840) {
        return (0.9 + width) / 2300;
      } else if (width >= 768) {
        return (0.9 + width) / 2000;
      } else if (width >= 500) {
        return (1 + width) / 1000;
      } else if (width >= 350) {
        return (1 + width) / 1150;
      } else {
        return (1 + width) / 1250;
      }
    };

    const handleResize = () => {
      setScale(getScale(window.innerWidth));
    };

    // Set scale on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      const response = await fetch("/api/cv/load");
      const data = await response.json();

      if (data.success) {
        // Sort CVs by lastEdited date (newest first)
        const sortedCVs = [...data.cvs].sort((a, b) => {
          return (
            new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
          );
        });
        setCVs(sortedCVs);
      }
    } catch (error) {
      console.error("Error loading CVs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cvId: string) => {
    if (!confirm(t("site.dashboard.common.confirm_delete"))) {
      return;
    }

    try {
      const response = await fetch(`/api/cv/delete?id=${cvId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCVs((prev) => prev.filter((cv) => cv._id !== cvId));
      } else {
        console.error("Failed to delete CV");
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
    }
  };

  const startRenaming = (cv: CV) => {
    setRenamingCV(cv._id);
    setNewTitle(cv.title);
  };

  const handleRename = async (cvId: string) => {
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
        setCVs((prev) =>
          prev.map((cv) =>
            cv._id === cvId ? { ...cv, title: newTitle.trim() } : cv
          )
        );
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
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

    return <CVPreviewWrapper>{preview}</CVPreviewWrapper>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-1 pt-20 lg:pt-5 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">
              {t("site.dashboard.resumes.title")}
            </h1>
            <button
              onClick={() => router.push("/builder")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t("site.dashboard.resumes.create_resume")}
            </button>
          </div>

          {/* CV grid content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : cvs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {t("site.dashboard.resumes.empty_state.title")}
              </h2>
              <p className="text-gray-500 mb-4">
                {t("site.dashboard.resumes.empty_state.description")}
              </p>
              <button
                onClick={() => router.push("/builder")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t("site.dashboard.resumes.create_resume")}
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
                    <span className="font-medium">
                      {t("site.dashboard.resumes.create_resume")}
                    </span>
                  </div>
                </Link>
              </div>

              {/* CV Cards */}
              {cvs.map((cv) => (
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
                        <DropdownMenuItem onClick={() => startRenaming(cv)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          {t("site.dashboard.common.rename")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(cv._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("site.dashboard.common.delete")}
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
                              handleRename(cv._id);
                            } else if (e.key === "Escape") {
                              setRenamingCV(null);
                              setNewTitle("");
                            }
                          }}
                          className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(cv._id)}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {t("site.dashboard.common.save")}
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
      </main>
    </div>
  );
}
