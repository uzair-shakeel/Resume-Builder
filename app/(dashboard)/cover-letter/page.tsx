"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
import { useLanguage } from "@/contexts/LanguageContext";

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
const CoverLetterPreviewCirculaire = dynamic(
  () =>
    import(
      "@/components/cover-letter-templates/cover-letter-preview-circulaire"
    )
);
const CoverLetterPreviewSherlock = dynamic(
  () =>
    import("@/components/cover-letter-templates/cover-letter-preview-sherlock")
);
const CoverLetterPreviewStudent = dynamic(
  () =>
    import("@/components/cover-letter-templates/cover-letter-preview-student")
);
const CoverLetterPreviewHR = dynamic(
  () => import("@/components/cover-letter-templates/cover-letter-preview-hr")
);
const CoverLetterPreviewTeal = dynamic(
  () => import("@/components/cover-letter-templates/cover-letter-preview-teal")
);

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

const CoverLetterPreviewWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className="w-full h-full"
      style={{ minWidth: "21cm", minHeight: "29.7cm" }}
    >
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

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

export default function CoverLetterDashboard() {
  const { t } = useLanguage();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [renamingCoverLetter, setRenamingCoverLetter] = useState<string | null>(
    null
  );
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();
  const [scale, setScale] = useState<number>(1);
  const [deletingCoverLetter, setDeletingCoverLetter] = useState<string | null>(
    null
  );

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
    loadCoverLetters();
  }, []);

  const loadCoverLetters = async () => {
    try {
      const response = await fetch("/api/cover-letter/load");
      const data = await response.json();

      if (data.success) {
        // Sort cover letters by lastEdited date (newest first)
        const sortedCoverLetters = [...data.coverLetters].sort((a, b) => {
          return (
            new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
          );
        });
        setCoverLetters(sortedCoverLetters);
      }
    } catch (error) {
      console.error("Error loading cover letters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (coverId: string) => {
    if (!confirm(t("site.dashboard.coverLetters.deleteConfirmation"))) {
      return;
    }

    try {
      setDeletingCoverLetter(coverId);
      const response = await fetch(`/api/cover-letter/delete?id=${coverId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCoverLetters((prev) =>
          prev.filter((letter) => letter._id !== coverId)
        );
      } else {
        console.error("Failed to delete cover letter");
      }
    } catch (error) {
      console.error("Error deleting cover letter:", error);
    } finally {
      setDeletingCoverLetter(null);
    }
  };

  const startRenaming = (coverLetter: CoverLetter) => {
    setRenamingCoverLetter(coverLetter._id);
    setNewTitle(coverLetter.title);
  };

  const handleRename = async (coverId: string) => {
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
        setCoverLetters((prev) =>
          prev.map((letter) =>
            letter._id === coverId
              ? { ...letter, title: newTitle.trim() }
              : letter
          )
        );
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
          return <CoverLetterPreviewCirculaire {...commonProps} />;
        case "sherlock":
          return <CoverLetterPreviewSherlock {...commonProps} />;
        case "student":
          return <CoverLetterPreviewStudent {...commonProps} />;
        case "hr":
          return <CoverLetterPreviewHR {...commonProps} />;
        case "teal":
          return <CoverLetterPreviewTeal {...commonProps} />;
        default:
          return <CoverLetterPreviewModern {...commonProps} />;
      }
    })();

    return <CoverLetterPreviewWrapper>{preview}</CoverLetterPreviewWrapper>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-1 pt-20 lg:pt-5 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">
              {t("site.dashboard.coverLetters.title")}
            </h1>
            <button
              onClick={() => router.push("/builder/cover-letter")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t("site.dashboard.coverLetters.create_letter")}
            </button>
          </div>

          {/* Cover Letter grid content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : coverLetters.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {t("site.dashboard.coverLetters.empty_state.title")}
              </h2>
              <p className="text-gray-500 mb-4">
                {t("site.dashboard.coverLetters.empty_state.description")}
              </p>
              <button
                onClick={() => router.push("/builder/cover-letter")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t("site.dashboard.coverLetters.create_letter")}
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
                    <span className="font-medium">
                      {t("site.dashboard.coverLetters.create_letter")}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Cover Letter Cards */}
              {coverLetters.map((coverLetter) => (
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
                          onClick={() => startRenaming(coverLetter)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          {t("site.dashboard.common.rename")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(coverLetter._id)}
                          className="text-red-600"
                          disabled={deletingCoverLetter === coverLetter._id}
                        >
                          {deletingCoverLetter === coverLetter._id ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2" />
                              {t("site.dashboard.common.delete")}
                            </div>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t("site.dashboard.common.delete")}
                            </>
                          )}
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
                              handleRename(coverLetter._id);
                            } else if (e.key === "Escape") {
                              setRenamingCoverLetter(null);
                              setNewTitle("");
                            }
                          }}
                          className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(coverLetter._id)}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {t("site.dashboard.common.save")}
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
      </main>
    </div>
  );
}
