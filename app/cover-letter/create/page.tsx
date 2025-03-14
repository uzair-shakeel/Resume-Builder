"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoverLetterPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/builder/cover-letter");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirection...</h1>
        <p>
          Vous allez être redirigé vers le créateur de lettre de motivation.
        </p>
      </div>
    </div>
  );
}
