"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ObrasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <h2 className="font-display text-2xl font-normal text-white-broken">
        Error al cargar las obras
      </h2>
      <p className="mt-6 text-white-muted text-center max-w-md">
        No hemos podido conectar con la base de datos. Intenta de nuevo.
      </p>
      <div className="mt-12 flex gap-8">
        <button
          onClick={reset}
          className="text-xs tracking-[0.2em] uppercase text-grey-muted hover:text-white-muted transition-colors duration-300"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="text-xs tracking-[0.2em] uppercase text-grey-muted hover:text-white-muted transition-colors duration-300"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
