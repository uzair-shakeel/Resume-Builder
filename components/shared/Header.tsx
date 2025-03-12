"use client";

import { EllipsisVertical, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "w-full p-2 lg:p-3 z-40 flex items-center justify-between fixed transition-all duration-200",
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        )}
      >
        <div className="flex items-center p-1">
          <Link href="/" className="flex items-center text-gray-900 h-8">
            <Image
              src="/assets/logo-black-text.svg"
              alt="logo"
              width={85.48}
              height={32}
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-7">
          <Link
            href="/modeles"
            className="text-gray-500 focus-visible:ring-4 ring-[#b0bdff] hover:text-gray-900 rounded lg:text-lg py-1 px-2 lg:py-2 lg:px-4"
          >
            Modèles
          </Link>
          <Link
            href="/pricing"
            className="text-gray-500 focus-visible:ring-4 ring-[#b0bdff] hover:text-gray-900 rounded lg:text-lg py-1 px-2 lg:py-2 lg:px-4"
          >
            Prix
          </Link>
          <Link
            href="/faq"
            className="text-gray-500 focus-visible:ring-4 ring-[#b0bdff] hover:text-gray-900 rounded lg:text-lg py-1 px-2 lg:py-2 lg:px-4"
          >
            FAQ
          </Link>
          <Link
            href="/cover-letter"
            className="text-gray-500 focus-visible:ring-4 ring-[#b0bdff] hover:text-gray-900 rounded lg:text-lg py-1 px-2 lg:py-2 lg:px-4"
          >
            Lettre de motivation
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <Link
            href="/login"
            className="hidden md:inline-flex border justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-[#b0bdff] items-center bg-transparent active:bg-brand-100 active:bg-brand-100 text-gray-700 border-gray-400 hover:bg-brand-50 hover:border-brand-400 font-medium py-1 lg:py-2 ps-3 pe-3 lg:ps-4 lg:pe-4 text-base"
          >
            Connexion
          </Link>
          <Link
            href="/creer-un-cv"
            className="inline-flex border justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-[#b0bdff] items-center bg-[#173dff] active:bg-brand-300 active:bg-brand-300 text-white border-transparent hover:bg-brand-400 font-medium py-1 lg:py-2 ps-3 pe-3 lg:ps-4 lg:pe-4 text-base"
          >
            Créer un CV
          </Link>
          {!isMobileMenuOpen && (
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden min-w-[33.6px] h-[33.6px] inline-flex border justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center bg-transparent active:bg-brand-100 active:bg-brand-100 text-gray-700 border-gray-400 hover:bg-brand-50 hover:border-brand-400 font-medium py-1 lg:py-2 ps-1 pe-1 lg:ps-2 lg:pe-2 text-base"
            >
              <EllipsisVertical
                strokeWidth={1}
                className="!w-5 !h-5 flex-shrink-0"
              />
            </Button>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="flex items-center justify-between px-2 py-[11px]">
            <Link
              href="/"
              className="flex items-center text-gray-900 h-8 p-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/assets/logo-black-text.svg"
                alt="logo"
                width={85.48}
                height={32}
              />
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/creer-un-cv"
                className="inline-flex border justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-[#b0bdff] items-center bg-[#173dff] active:bg-brand-300 active:bg-brand-300 text-white border-transparent hover:bg-brand-400 font-medium py-1 lg:py-2 ps-3 pe-3 lg:ps-4 lg:pe-4 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Créer un CV
              </Link>
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(false)}
                className="min-w-[33.6px] h-[33.6px] inline-flex justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center bg-transparent active:bg-brand-100 active:bg-brand-100 text-gray-700 border-gray-400 hover:bg-brand-50 hover:border-brand-400 font-medium py-1 lg:py-2 ps-1 pe-1 lg:ps-2 lg:pe-2 text-base"
              >
                <X
                  strokeWidth={1.8}
                  className="!w-[21px] !h-[21px] flex-shrink-0"
                />
              </Button>
            </div>
          </div>

          <nav className="flex flex-col p-4 space-y-4 text-left">
            <Link
              href="/modeles"
              className="active:text-[#4a68ff] py-1 focus-visible:ring-4 hover:text-[#173dff] rounded ring-[#b0bdff] inline-flex items-center text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Modèles
            </Link>
            <Link
              href="/pricing"
              className="active:text-[#4a68ff] py-1 focus-visible:ring-4 hover:text-[#173dff] rounded ring-[#b0bdff] inline-flex items-center text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Prix
            </Link>
            <Link
              href="/faq"
              className="active:text-[#4a68ff] py-1 focus-visible:ring-4 hover:text-[#173dff] rounded ring-[#b0bdff] inline-flex items-center text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/cover-letter"
              className="active:text-[#4a68ff] py-1 focus-visible:ring-4 hover:text-[#173dff] rounded ring-[#b0bdff] inline-flex items-center text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Lettre de motivation
            </Link>
            <div>
              <Link
                href="/login"
                className="inline-flex border justify-center rounded-[5px] relative overflow-hidden max-w-full focus-visible:ring-4 ring-[#b0bdff] items-center w-full bg-transparent active:bg-[#e3e8ff] active:bg-brand-100 text-gray-700 border-gray-400 hover:bg-brand-50 hover:border-brand-400 font-medium py-2 ps-4 pe-4 text-base mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Connexion
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
