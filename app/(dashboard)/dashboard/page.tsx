"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Calendar,
  Clock,
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
const CVPreviewAlt = dynamic(() => import("@/components/cv-preview-alt"));
const CVPreviewClassic = dynamic(
  () => import("@/components/cv-preview-classic")
);
const CVPreviewPro = dynamic(() => import("@/components/cv-preview-pro"));
const CVPreviewSherlock = dynamic(
  () => import("@/components/cv-preview-sherlock")
);
const CVPreviewHR = dynamic(() => import("@/components/cv-preview-hr"));
const CVPreviewMinimal = dynamic(
  () => import("@/components/cv-preview-minimal")
);
const CVPreviewTeal = dynamic(() => import("@/components/cv-preview-teal"));
const CVPreviewCirculaire = dynamic(
  () => import("@/components/cv-preview-circulaire")
);
const CVPreviewStudent = dynamic(
  () => import("@/components/cv-preview-student")
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

export default function Dashboard() {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [renamingCV, setRenamingCV] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const router = useRouter();
  const [scale, setScale] = useState((0.25 + window.innerWidth) / 5300);

  useEffect(() => {
    const handleResize = () => {
      setScale((0.25 + window.innerWidth) / 5300);
    };

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
        console.log("Loaded CVs:", data.cvs); // Debug log
        setCVs(data.cvs);
      }
    } catch (error) {
      console.error("Error loading CVs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cvId: string) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
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

    // Debug log to check the data
    console.log("CV Data:", cv.data);

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
    <div className="container mx-auto pt-5 pb-40 lg:pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My CVs</h1>
        <button
          onClick={() => router.push("/builder")}
          className="bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New CV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : cvs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No CVs yet
          </h2>
          <p className="text-gray-500 mb-4">
            Create your first CV to get started
          </p>
          <button
            onClick={() => router.push("/builder")}
            className="bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New CV
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap -ms-5">
          {/* Create New CV Card */}
          <div className="relative p-5 w-1/2 md:w-1/3 lg:w-1/4 group">
            <div className="relative pb-[141%]">
              <Link
                href="/builder"
                className="group absolute top-1/2 left-1/2-translate-x-1/2 -translate-y-1/2 h-full w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-blue-500">
                  <Plus className="w-8 h-8" />
                  <span className="font-medium text-center">Create New CV</span>
                </div>
              </Link>
            </div>
          </div>

          {/* CV Cards */}
          {cvs.map((cv) => (
            <div
              key={cv._id}
              className="relative p-5 w-1/2 md:w-1/3 lg:w-1/4 group"
            >
              <div className="relative pb-[141%] bg-white rounded shadow-sm hover:shadow-md transition-shadow overflow-hidden">
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
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute top-2 right-2 z-[20] p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => startRenaming(cv)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(cv._id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative p-3 z-[20] bg-white border-t">
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
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-gray-900 truncate">
                      {cv.title}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Created {formatDate(cv.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Last edited {formatTime(cv.lastEdited)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
