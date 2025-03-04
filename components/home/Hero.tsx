import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full py-16 md:py-24 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
        Créez votre CV professionnel
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
        Remplissez le formulaire, choisissez un modèle et téléchargez votre CV
        en quelques minutes.
      </p>
      <Link
        href="/creer-un-cv"
        className="px-8 py-4 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Créer un CV
      </Link>
    </section>
  );
}
