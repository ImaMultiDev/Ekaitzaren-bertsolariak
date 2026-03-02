import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <Image
            src="/ico/logo.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-auto opacity-80 rounded-md"
          />
          <p className="font-display text-xs tracking-[0.2em] text-grey-muted">
            Ekaitzaren Bertsolariak
          </p>
          <nav className="flex flex-wrap justify-center gap-8 text-xs tracking-[0.15em] uppercase">
            <Link href="/" className="text-grey-muted hover:text-white-muted transition-colors duration-300">
              Inicio
            </Link>
            <Link href="/proyectos" className="text-grey-muted hover:text-white-muted transition-colors duration-300">
              Proyectos
            </Link>
            <Link href="/obras" className="text-grey-muted hover:text-white-muted transition-colors duration-300">
              Obras
            </Link>
            <Link href="/sobre-mi" className="text-grey-muted hover:text-white-muted transition-colors duration-300">
              Sobre mí
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
