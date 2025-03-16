import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  ressources: {
    title: "Ressources",
    links: [
      { label: "Conseils", href: "/conseils" },
      { label: "Exemples", href: "/exemples" },
    ],
  },
  produit: {
    title: "Produit",
    links: [
      { label: "Prix", href: "/pricing" },
      { label: "Modèles", href: "/modeles" },
      { label: "Avis", href: "https://www.trustpilot.com/review/cv.fr" },
    ],
  },
  service: {
    title: "Service client",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Conditions générales", href: "/conditions" },
      { label: "Politique de confidentialité", href: "/confidentialite" },
      { label: "À propos", href: "/about" },
    ],
  },
};

const languages = [
  { label: "Français", code: "fr" },
  { label: "Nederlands", code: "nl" },
  { label: "Suomi", code: "fi" },
  { label: "Svenska", code: "sv" },
];

const socialLinks = [
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-7 h-7 text-gray-500 can-hover:hover:text-gray-700"
      >
        <path
          fill="currentColor"
          d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.9 5.9 0 0 0 1.384 2.126A5.9 5.9 0 0 0 4.14 23.37c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.9 5.9 0 0 0 2.126-1.384 5.9 5.9 0 0 0 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.9 5.9 0 0 0-1.384-2.126A5.85 5.85 0 0 0 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0m0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.8 3.8 0 0 1-.899 1.382 3.74 3.74 0 0 1-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07s-3.586-.015-4.859-.074c-1.171-.061-1.816-.256-2.236-.421a3.7 3.7 0 0 1-1.379-.899 3.64 3.64 0 0 1-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844s.016-3.586.061-4.861c.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324M12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4m7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0"
        ></path>
      </svg>
    ),
    href: "https://instagram.com",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 960 960"
        className="w-7 h-7 text-gray-500 can-hover:hover:text-gray-700"
      >
        <path
          fill="currentColor"
          d="M552.377 421.797 835.351 99.683h-67.032l-245.81 279.63-196.181-279.63H100l296.729 422.89L100 860.317h67.032l259.413-295.362 207.227 295.362H860M191.225 149.185h102.98l474.063 664.062H665.263"
        ></path>
      </svg>
    ),
    href: "https://twitter.com",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-7 h-7 text-gray-500 can-hover:hover:text-gray-700"
      >
        <path
          fill="currentColor"
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"
        ></path>
      </svg>
    ),
    href: "https://linkedin.com",
  },
  {
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 576 512"
        className="w-7 h-7 text-gray-500 can-hover:hover:text-gray-700"
      >
        <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305m-317.51 213.508V175.185l142.739 81.205z"></path>
      </svg>
    ),
    href: "https://youtube.com",
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white flex flex-col items-center pt-6 md:pt-20 pb-8">
      <div className="max-w-[864px] mx-auto px-[20px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:text-start text-center">
          {/* Resources Column */}
          <div className="flex-equal-width flex-col flex pb-6 md:pb-0">
            <h3 className="text-lg font-medium pb-3 md:pb-6 text-gray-900">
              {footerLinks.ressources.title}
            </h3>
            <ul className="space-y-1">
              {footerLinks.ressources.links.map((link) => (
                <li key={link.href} className="list-none before:content-none">
                  <Link
                    href={link.href}
                    className="text-base focus-visible:ring-4 ring-brand-200 rounded-sm font-normal text-gray-500 md:text-gray-500 hover:text-gray-700 md:pb-1 py-2 md:py-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Column */}
          <div className="flex-equal-width flex-col flex pb-6 md:pb-0">
            <h3 className="text-lg font-medium pb-3 md:pb-6 text-gray-900">
              {footerLinks.produit.title}
            </h3>
            <ul className="space-y-1">
              {footerLinks.produit.links.map((link) => (
                <li key={link.href} className="list-none before:content-none">
                  <Link
                    href={link.href}
                    className="text-base focus-visible:ring-4 ring-brand-200 rounded-sm font-normal text-gray-500 md:text-gray-500 hover:text-gray-700 md:pb-1 py-2 md:py-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Column */}
          <div className="flex-equal-width flex-col flex pb-6 md:pb-0">
            <h3 className="text-lg font-medium pb-3 md:pb-6 text-gray-900">
              {footerLinks.service.title}
            </h3>
            <ul className="space-y-1">
              {footerLinks.service.links.map((link) => (
                <li key={link.href} className="list-none before:content-none">
                  <Link
                    href={link.href}
                    className="text-base focus-visible:ring-4 ring-brand-200 rounded-sm font-normal text-gray-500 md:text-gray-500 hover:text-gray-700 md:pb-1 py-2 md:py-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App Store Links */}
          <div className="flex flex-equal-width flex-col items-center md:items-start space-y-3">
            <Link href="https://apps.apple.com" className="block">
              <Image
                src="/assets/app-store-badge-fr.svg"
                alt="Download on the App Store"
                width={132.82}
                height={42}
                className="h-auto w-[132.82px]"
              />
            </Link>
            <Link href="https://play.google.com" className="block">
              <Image
                src="/assets/google-play-badge-fr.png"
                alt="Get it on Google Play"
                width={141.53}
                height={42}
                className="h-auto w-[141.53px]"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="flex flex-wrap max-w-[864px] mx-auto px-[20px] mt-12 md:mt-24 justify-center">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className="text-base focus-visible:ring-4 ring-brand-200 rounded-sm font-normal text-gray-500 md:text-gray-500 hover:text-gray-700 px-4 py-3 md:px-3 md:py-1"
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Social Links */}
      <div className="flex space-x-2 mt-12 md:mt-24">
        {socialLinks.map((social, index) => (
          <Link
            key={index}
            href={social.href}
            className="focus-visible:ring-4 ring-brand-200 rounded p-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            {social.svg}

            <span className="sr-only">Social Link {index + 1}</span>
          </Link>
        ))}
      </div>

      {/* Copyright */}
      <div className="text-xs md:text-base text-gray-500 mt-5 md:mt-8 text-center mx-5">
        <span>
          © 2025 <Link href="/">CV.fr</Link>
        </span>
      </div>
    </footer>
  );
}
