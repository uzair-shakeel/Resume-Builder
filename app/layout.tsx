import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/providers/session-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/ui/LanguageSelector";
import "./globals.css";
import { PaymentProvider } from "./contexts/PaymentContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV.fr - Online Resume Builder",
  description: "Professional Resume & CV Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <PaymentProvider>{children}</PaymentProvider>
            <LanguageSelector />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import "./globals.css";
