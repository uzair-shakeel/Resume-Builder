import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import CV from "@/models/CV";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

async function getCVs(userId: string) {
  await connectToDatabase();
  const cvs = await CV.find({ userId }).sort({ lastEdited: -1 });
  return cvs;
}

export default async function CVPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const cvs = await getCVs(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Curriculum vitae</h1>
        <Link href="/cv/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau CV
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
          placeholder="Rechercher un CV..."
          type="search"
        />
      </div>

      {cvs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Aucun CV trouvé</h3>
          <p className="mt-2 text-gray-500">
            Commencez par créer votre premier CV
          </p>
          <div className="mt-6">
            <Link href="/cv/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer un CV
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/cv/create"
            className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Plus className="w-8 h-8" />
              <span>Nouveau CV</span>
            </div>
          </Link>

          {cvs.map((cv: any) => (
            <Link
              key={cv._id}
              href={`/cv/${cv._id}`}
              className="group relative bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="aspect-[210/297] w-full bg-gray-100">
                {/* CV Preview would go here */}
              </div>
              <div className="p-3 border-t">
                <h3 className="font-medium truncate">{cv.title}</h3>
                <p className="text-sm text-gray-500">
                  Modifié {new Date(cv.lastEdited).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
