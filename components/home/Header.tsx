import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-6 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded mr-2"></div>
          <span className="font-bold text-lg">CV.FR</span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/modeles" className="text-gray-600 hover:text-gray-900">
          Modèles
        </Link>
        <Link href="/prix" className="text-gray-600 hover:text-gray-900">
          Prix
        </Link>
        <Link href="/faq" className="text-gray-600 hover:text-gray-900">
          FAQ
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        <Link
          href="/connexion"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Connexion
        </Link>
        <Link
          href="/creer-un-cv"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Créer un CV
        </Link>
      </div>
    </header>
  );
}
