import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import CoverLetter from "@/models/CoverLetter";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

async function getCoverLetters(userId: string) {
  await connectToDatabase();
  const coverLetters = await CoverLetter.find({ userId }).sort({
    lastEdited: -1,
  });
  return coverLetters;
}

export default async function CoverLetterPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const coverLetters = await getCoverLetters(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lettres de motivation</h1>
        <Link href="/cover-letter/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle lettre
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          className="pl-10"
          placeholder="Rechercher une lettre de motivation..."
          type="search"
        />
      </div>

      {coverLetters.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            Aucune lettre de motivation trouvée
          </h3>
          <p className="mt-2 text-gray-500">
            Commencez par créer votre première lettre de motivation
          </p>
          <div className="mt-6">
            <Link href="/cover-letter/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer une lettre
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/cover-letter/create"
            className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Plus className="w-8 h-8" />
              <span>Nouvelle lettre</span>
            </div>
          </Link>

          {coverLetters.map((letter: any) => (
            <Link
              key={letter._id}
              href={`/cover-letter/${letter._id}`}
              className="group relative bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="aspect-[210/297] w-full bg-gray-100">
                {/* Cover Letter Preview would go here */}
              </div>
              <div className="p-3 border-t">
                <h3 className="font-medium truncate">{letter.title}</h3>
                <p className="text-sm text-gray-500">
                  Modifié {new Date(letter.lastEdited).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
