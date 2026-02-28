"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchWorks } from "@/lib/api";
import type { Work, WorkType } from "@/lib/types";

const typeLabels: Record<WorkType, string> = {
  SONG: "Canciones",
  BOOK: "Libros",
  POEM: "Poemas",
  OTHER: "Otros",
};

export default function ObrasPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<WorkType | "ALL">("ALL");

  useEffect(() => {
    fetchWorks()
      .then(setWorks)
      .catch(() => setError("Error al cargar las obras"))
      .finally(() => setLoading(false));
  }, []);

  const filteredWorks =
    filter === "ALL" ? works : works.filter((w) => w.type === filter);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-red text-center">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchWorks()
              .then(setWorks)
              .catch(() => setError("Error al cargar las obras"))
              .finally(() => setLoading(false));
          }}
          className="mt-6 text-sm tracking-widest uppercase text-stone hover:text-white"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header de sección */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-6xl">
          <div className="line-accent mb-4" />
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.15em] text-white">
            OBRAS
          </h1>
          <p className="mt-6 text-white-broken max-w-2xl text-lg">
            Letras, canciones, poemas y libros. Todo lo que nace de la tormenta
            y vuelve a ella como eco.
          </p>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mt-10">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 text-sm tracking-widest uppercase transition-colors ${
                filter === "ALL"
                  ? "bg-red text-white"
                  : "border border-border text-stone hover:text-white hover:border-stone"
              }`}
            >
              Todas
            </button>
            {(Object.keys(typeLabels) as WorkType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 text-sm tracking-widest uppercase transition-colors ${
                  filter === type
                    ? "bg-red text-white"
                    : "border border-border text-stone hover:text-white hover:border-stone"
                }`}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listado */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div
                className="h-8 w-8 border-2 border-red border-t-transparent rounded-full animate-spin"
                aria-hidden
              />
              <p className="mt-4 text-stone text-sm">Cargando obras...</p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                {filteredWorks.map((work) => (
                  <Link
                    key={work.id}
                    href={`/obras/${work.slug}`}
                    className="group block border-b border-border py-8 sm:py-10 hover:border-red/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <span className="text-xs tracking-widest uppercase text-red">
                          {typeLabels[work.type]}
                        </span>
                        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-white mt-1 group-hover:text-red transition-colors">
                          {work.title}
                        </h2>
                        {work.subtitle && (
                          <p className="text-stone mt-1 italic">{work.subtitle}</p>
                        )}
                      </div>
                      <span className="text-stone group-hover:text-red transition-colors sm:ml-4">
                        →
                      </span>
                    </div>
                    {work.excerpt && (
                      <p className="mt-4 text-white-broken line-clamp-2 max-w-2xl">
                        {work.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>

              {filteredWorks.length === 0 && (
                <p className="text-stone text-center py-16">
                  No hay obras en esta categoría.
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
