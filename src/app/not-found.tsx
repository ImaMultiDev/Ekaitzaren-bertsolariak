import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="font-display text-6xl sm:text-8xl tracking-widest text-red">
        404
      </h1>
      <p className="mt-6 text-white-broken text-center max-w-md">
        La página que buscas se perdió en la tormenta.
      </p>
      <Link
        href="/"
        className="mt-10 text-sm tracking-widest uppercase text-red hover:underline"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
