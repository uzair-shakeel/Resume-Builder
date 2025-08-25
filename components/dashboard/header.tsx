"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import PaymentStatusIndicator from "./PaymentStatusIndicator";

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1f1f1f] z-50 flex items-center justify-between px-4 text-white">
      <div className="flex items-center">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center text-gray-900 h-8 ps-2"
        >
          <Image
            src="/assets/logo-white-text.svg"
            alt={t("site.common.logo_alt")}
            width={85.48}
            height={32}
          />
        </Link>
      </div>

      {/* Payment Status Indicator */}
      <div className="flex items-center space-x-3">
        <PaymentStatusIndicator />
      </div>
    </header>
  );
};

export default Header;
