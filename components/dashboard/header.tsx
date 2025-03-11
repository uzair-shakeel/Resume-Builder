import { HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const header = () => {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1f1f1f] z-50 flex items-center justify-between px-4 text-white">
      <div className="flex items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center text-gray-900 h-8 ps-2">
          <Image
            src="/assets/logo-white-text.svg"
            alt="logo"
            width={85.48}
            height={32}
          />
        </Link>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <HelpCircle className="w-6 h-6" />
      </button>
    </header>
  );
};

export default header;
