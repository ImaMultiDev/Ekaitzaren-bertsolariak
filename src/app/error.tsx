"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h2 className="font-display text-2xl tracking-widest text-red">
        Algo ha fallado
      </h2>
      <p className="mt-4 text-white-broken text-center max-w-md">
        La tormenta se ha llevado esta página. Intenta de nuevo.
      </p>
      <div className="mt-10 flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 border border-red text-red text-sm tracking-widest uppercase hover:bg-red hover:text-white transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-border text-stone text-sm tracking-widest uppercase hover:text-white hover:border-stone transition-colors"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
