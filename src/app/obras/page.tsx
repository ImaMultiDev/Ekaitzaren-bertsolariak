"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchWorks } from "@/lib/api";
import type { Work, WorkType } from "@/lib/types";

const typeLabels: Record<WorkType, string> = {
  SONG: "Canciones",
  BOOK: "Libros",
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <p className="text-white-muted text-center">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchWorks()
              .then(setWorks)
              .catch(() => setError("Error al cargar las obras"))
              .finally(() => setLoading(false));
          }}
          className="mt-8 text-xs tracking-widest uppercase text-grey-muted hover:text-white-muted transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-grey-muted text-xs tracking-[0.2em] uppercase mb-4">
            Obras
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-white-broken">
            Canciones y libros
          </h1>
          <p className="mt-6 text-white-muted max-w-xl">
            Índice de obras. La palabra como centro.
          </p>

          {/* Filtros minimalistas */}
          <div className="flex gap-8 mt-12">
            <button
              onClick={() => setFilter("ALL")}
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                filter === "ALL"
                  ? "text-white-broken border-b border-white-broken/40 pb-1"
                  : "text-grey-muted hover:text-white-muted"
              }`}
            >
              Todas
            </button>
            {(Object.keys(typeLabels) as WorkType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                  filter === type
                    ? "text-white-broken border-b border-white-broken/40 pb-1"
                    : "text-grey-muted hover:text-white-muted"
                }`}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div
                className="h-6 w-6 border border-white-broken/30 border-t-white-broken/60 rounded-full animate-spin"
                aria-hidden
              />
              <p className="mt-6 text-grey-muted text-sm">Cargando...</p>
            </div>
          ) : (
            <div className="space-y-20">
              {filteredWorks.map((work) => (
                <Link
                  key={work.id}
                  href={`/obras/${work.slug}`}
                  className="block group"
                >
                  <p className="text-grey-muted text-xs tracking-wider uppercase">
                    {typeLabels[work.type]}
                    {work.project && ` · ${work.project.name}`}
                  </p>
                  <p className="text-white-broken font-display text-xl mt-2 group-hover:text-white-muted transition-colors duration-300">
                    {work.title}
                  </p>
                  {work.subtitle && (
                    <p className="text-grey-muted text-sm mt-1 italic">{work.subtitle}</p>
                  )}
                  {work.excerpt && (
                    <p className="text-white-muted text-sm mt-4 line-clamp-2 max-w-xl">
                      {work.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}

          {!loading && filteredWorks.length === 0 && (
            <p className="text-grey-muted text-sm py-24 text-center">
              No hay obras en esta categoría.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
