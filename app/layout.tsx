import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/providers/session-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV.FR - Créez votre CV en ligne",
  description: "Créez votre CV professionnel en quelques minutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

import "./globals.css";
