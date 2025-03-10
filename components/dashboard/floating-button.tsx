"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function FloatingButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/builder")}
      className="lg:hidden fixed right-4 bottom-20 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-50"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
