"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const socialLinks = [
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6 text-gray-500 hover:text-blue-600 transition-colors duration-200"
      >
        <path
          fill="currentColor"
          d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.9 5.9 0 0 0 1.384 2.126A5.9 5.9 0 0 0 4.14 23.37c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.9 5.9 0 0 0 2.126-1.384 5.9 5.9 0 0 0 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.9 5.9 0 0 0-1.384-2.126A5.85 5.85 0 0 0 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0m0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.8 3.8 0 0 1-.899 1.382 3.74 3.74 0 0 1-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07s-3.586-.015-4.859-.074c-1.171-.061-1.816-.256-2.236-.421a3.7 3.7 0 0 1-1.379-.899 3.64 3.64 0 0 1-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844s.016-3.586.061-4.861c.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324M12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4m7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0"
        />
      </svg>
    ),
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 960 960"
        className="w-6 h-6 text-gray-500 hover:text-blue-400 transition-colors duration-200"
      >
        <path
          fill="currentColor"
          d="M552.377 421.797 835.351 99.683h-67.032l-245.81 279.63-196.181-279.63H100l296.729 422.89L100 860.317h67.032l259.413-295.362 207.227 295.362H860M191.225 149.185h102.98l474.063 664.062H665.263"
        />
      </svg>
    ),
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6 text-gray-500 hover:text-blue-700 transition-colors duration-200"
      >
        <path
          fill="currentColor"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"
        />
      </svg>
    ),
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 576 512"
        className="w-6 h-6 text-gray-500 hover:text-red-600 transition-colors duration-200"
      >
        <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305m-317.51 213.508V175.185l142.739 81.205z" />
      </svg>
    ),
    href: "https://youtube.com",
    label: "YouTube",
  },
];

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    ressources: {
      title: t("site.home.footer.resources"),
      icon: (
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      links: [
        { label: t("site.home.footer.product"), href: "/modeles" },
        { label: t("site.home.footer.examples"), href: "/modeles" },
        { label: "CV Builder", href: "/builder" },
        { label: "Cover Letter Builder", href: "/builder/cover-letter" },
      ],
    },

    service: {
      title: t("site.home.footer.customerService"),
      icon: (
        <svg
          className="w-5 h-5 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      links: [
        { label: t("site.home.footer.faq"), href: "/faq" },
        { label: "Login", href: "/login" },
        { label: "Sign Up", href: "/auth/signup" },
      ],
    },
  };

  return (
    <footer className="w-full bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between w-full gap-12 mb-12">
          {/* Left Side - Big Title & Description */}
          <div className="lg:col-span-1 space-y-6 w-[40%]">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Resume Builder
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Create professional resumes and cover letters with our
                easy-to-use builder. Choose from multiple templates and
                customize every detail to make your application stand out.
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Follow us
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.svg}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Two Sections */}
          <div className="lg:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-[35%]">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key} className="space-y-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  {section.links.map((link) => (
                    <div key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-2 group"
                      >
                        <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors duration-200"></span>
                        <span>{link.label}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Language Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 font-medium">Language:</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md font-medium">
                FR
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200">
                EN
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-500">
              © 2024 Resume Builder. {t("site.home.footer.copyright")}
            </p>
            <div className="flex justify-center md:justify-end space-x-6 mt-2 text-xs text-gray-400">
              <Link
                href="/faq"
                className="hover:text-gray-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/faq"
                className="hover:text-gray-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/faq"
                className="hover:text-gray-600 transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
