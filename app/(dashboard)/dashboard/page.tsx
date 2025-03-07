import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import CV from "@/models/CV";
import CoverLetter from "@/models/CoverLetter";
import { Plus, MoreVertical, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

async function getDashboardData(userId: string) {
  await connectToDatabase();

  const cvs = await CV.find({ userId }).sort({ lastEdited: -1 }).limit(6);
  const coverLetters = await CoverLetter.find({ userId })
    .sort({ lastEdited: -1 })
    .limit(6);

  return {
    cvs,
    coverLetters,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const { cvs, coverLetters } = await getDashboardData(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Curriculum vitae
        </h1>
        <div className="flex items-center space-x-2">
          <div className="bg-white rounded-lg border p-1 flex items-center">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <LayoutGrid size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg text-gray-400"
            >
              <List size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New CV Card */}
        <Link
          href="/cv/create"
          className="group relative aspect-[210/297] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
        >
          <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-blue-500">
            <Plus className="w-8 h-8" />
            <span className="font-medium">Créer un nouveau CV</span>
          </div>
        </Link>

        {/* CV Cards */}
        {cvs.map((cv: any) => (
          <div key={cv._id} className="group relative aspect-[210/297]">
            <Link
              href={`/cv/${cv._id}`}
              className="block w-full h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="w-full h-full bg-gray-50">
                {/* CV Preview would go here */}
              </div>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Renommer</DropdownMenuItem>
                <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                <DropdownMenuItem>Télécharger</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t">
              <h3 className="font-medium text-gray-900 truncate">{cv.title}</h3>
              <p className="text-sm text-gray-500">
                Modifié{" "}
                {new Date(cv.lastEdited).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
