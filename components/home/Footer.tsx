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
      { label: "Prix", href: "/prix" },
      { label: "Modèles", href: "/modeles" },
      { label: "Avis", href: "/avis" },
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
  { icon: Instagram, href: "https://instagram.com" },
  { icon: Twitter, href: "https://twitter.com" },
  { icon: Linkedin, href: "https://linkedin.com" },
  { icon: Youtube, href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="max-w-[864px] mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Resources Column */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            {footerLinks.ressources.title}
          </h3>
          <ul className="space-y-3">
            {footerLinks.ressources.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Column */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            {footerLinks.produit.title}
          </h3>
          <ul className="space-y-3">
            {footerLinks.produit.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Service Column */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            {footerLinks.service.title}
          </h3>
          <ul className="space-y-3">
            {footerLinks.service.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* App Store Links */}
        <div className="space-y-4">
          <Link href="https://apps.apple.com" className="block">
            <Image
              src="/app-store-badge.svg"
              alt="Download on the App Store"
              width={140}
              height={42}
              className="h-auto w-auto"
            />
          </Link>
          <Link href="https://play.google.com" className="block">
            <Image
              src="/google-play-badge.svg"
              alt="Get it on Google Play"
              width={140}
              height={42}
              className="h-auto w-auto"
            />
          </Link>
        </div>
      </div>

      {/* Language Selection */}
      <div className="mt-12 flex flex-wrap gap-6 justify-center">
        {languages.map((lang) => (
          <button key={lang.code} className="text-gray-600 hover:text-gray-900">
            {lang.label}
          </button>
        ))}
      </div>

      {/* Social Links */}
      <div className="mt-12 flex justify-center gap-6">
        {socialLinks.map((social, index) => {
          const Icon = social.icon;
          return (
            <Link
              key={index}
              href={social.href}
              className="text-gray-400 hover:text-gray-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon className="h-6 w-6" />
              <span className="sr-only">{social.icon.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Copyright */}
      <div className="mt-12 text-center text-gray-500">
        <p>© 2025 CV.fr</p>
      </div>
    </footer>
  );
}
