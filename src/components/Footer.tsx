import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-display text-sm tracking-[0.3em] text-stone">
            EKAITZAREN BERTSOLARIAK
          </p>
          <p className="text-sm text-stone max-w-md font-body italic">
            La tormenta tiene voz. La palabra tiene fuego.
          </p>
          <nav className="flex gap-6 text-sm">
            <Link
              href="/"
              className="text-stone hover:text-white transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/obras"
              className="text-stone hover:text-white transition-colors"
            >
              Obras
            </Link>
            <Link
              href="/sobre-mi"
              className="text-stone hover:text-white transition-colors"
            >
              Sobre mí
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
