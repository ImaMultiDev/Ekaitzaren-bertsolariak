import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <h1 className="font-display text-5xl sm:text-6xl font-normal text-white-broken">
        404
      </h1>
      <p className="mt-8 text-white-muted text-center max-w-md">
        La página que buscas se perdió en la tormenta.
      </p>
      <Link
        href="/"
        className="mt-12 text-xs tracking-[0.2em] uppercase text-grey-muted hover:text-white-muted transition-colors duration-300"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
