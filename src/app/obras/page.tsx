"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchWorks, fetchProyectos } from "@/lib/api";
import type { Work, WorkType } from "@/lib/types";

const typeLabels: Record<WorkType, string> = {
  SONG: "Canciones",
  BOOK: "Libros",
};

type FilterType = WorkType | "PROYECTOS";

export default function ObrasPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [proyectosData, setProyectosData] = useState<{
    proyectos: { id: string; name: string; slug: string; projects?: { id: string; name: string; slug: string; worksCount?: number }[] }[];
    standaloneProjects: { id: string; name: string; slug: string; worksCount?: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("PROYECTOS");
  const [search, setSearch] = useState("");
  const [proyectoSlug, setProyectoSlug] = useState<string | null>(null);
  const [albumSlug, setAlbumSlug] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchWorks(), fetchProyectos()])
      .then(([w, p]) => {
        setWorks(w);
        setProyectosData(p);
      })
      .catch(() => setError("Error al cargar las obras"))
      .finally(() => setLoading(false));
  }, []);

  const filteredWorks = useMemo(() => {
    if (filter === "SONG") return works.filter((w) => w.type === "SONG");
    if (filter === "BOOK") return works.filter((w) => w.type === "BOOK");
    return works;
  }, [works, filter]);

  const worksWithSearch = useMemo(() => {
    if (!search.trim()) return filteredWorks;
    const q = search.trim().toLowerCase();
    if (filter === "PROYECTOS") return filteredWorks;
    if (filter === "SONG") {
      return filteredWorks.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.project?.name.toLowerCase().includes(q) ||
          w.project?.proyecto?.name.toLowerCase().includes(q)
      );
    }
    if (filter === "BOOK") {
      return filteredWorks.filter((w) => w.title.toLowerCase().includes(q));
    }
    return filteredWorks.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.project?.name.toLowerCase().includes(q) ||
        w.project?.proyecto?.name.toLowerCase().includes(q)
    );
  }, [filteredWorks, search, filter]);

  const displayWorks = worksWithSearch;
  const songsForDisplay = displayWorks.filter((w) => w.type === "SONG");
  const booksForDisplay = displayWorks.filter((w) => w.type === "BOOK");

  const selectedProyecto = proyectoSlug ? proyectosData?.proyectos.find((p) => p.slug === proyectoSlug) : null;
  const albumsOfProyecto = useMemo(() => selectedProyecto?.projects ?? [], [selectedProyecto?.id]);
  const hasMultipleAlbums = albumsOfProyecto.length > 1;
  const songsOfAlbum = useMemo(() => {
    if (!albumSlug) return [];
    return works.filter((w) => w.type === "SONG" && w.project?.slug === albumSlug);
  }, [works, albumSlug]);
  const songsOfProyecto = useMemo(() => {
    if (!selectedProyecto || hasMultipleAlbums) return [];
    const album = albumsOfProyecto[0];
    if (!album) return [];
    return works.filter((w) => w.type === "SONG" && w.project?.slug === album.slug);
  }, [works, selectedProyecto, hasMultipleAlbums, albumsOfProyecto]);

  const isViewingAlbums = proyectoSlug && hasMultipleAlbums && !albumSlug;
  const isViewingSongs = albumSlug || (proyectoSlug && !hasMultipleAlbums);
  const currentSongs = albumSlug ? songsOfAlbum : songsOfProyecto;
  const standaloneAlbum = !proyectoSlug && albumSlug;

  const handleProyectoClick = (slug: string) => {
    setProyectoSlug(slug);
    setAlbumSlug(null);
  };

  const handleAlbumClick = (slug: string) => {
    setAlbumSlug(slug);
  };

  const handleBackToProyectos = () => {
    setProyectoSlug(null);
    setAlbumSlug(null);
  };

  const handleBackToAlbums = () => {
    setAlbumSlug(null);
  };

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <p className="text-white-muted text-center">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            Promise.all([fetchWorks(), fetchProyectos()])
              .then(([w, p]) => {
                setWorks(w);
                setProyectosData(p);
              })
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

          {/* Buscador */}
          <div className="mt-8">
            <input
              type="search"
              placeholder={
                filter === "PROYECTOS"
                  ? "Buscar proyecto o álbum..."
                  : filter === "BOOK"
                  ? "Buscar libro..."
                  : "Buscar canción, proyecto o álbum..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md bg-transparent border-b border-border py-2 text-white-broken text-sm placeholder-grey-muted focus:outline-none focus:border-white-broken/40 transition-colors"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-8 mt-12">
            <button
              onClick={() => {
                setFilter("PROYECTOS");
                setProyectoSlug(null);
                setAlbumSlug(null);
              }}
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                filter === "PROYECTOS"
                  ? "text-white-broken border-b border-white-broken/40 pb-1"
                  : "text-grey-muted hover:text-white-muted"
              }`}
            >
              Proyectos
            </button>
            <button
              onClick={() => {
                setFilter("SONG");
                setProyectoSlug(null);
                setAlbumSlug(null);
              }}
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                filter === "SONG"
                  ? "text-white-broken border-b border-white-broken/40 pb-1"
                  : "text-grey-muted hover:text-white-muted"
              }`}
            >
              Canciones
            </button>
            <button
              onClick={() => {
                setFilter("BOOK");
                setProyectoSlug(null);
                setAlbumSlug(null);
              }}
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                filter === "BOOK"
                  ? "text-white-broken border-b border-white-broken/40 pb-1"
                  : "text-grey-muted hover:text-white-muted"
              }`}
            >
              Libros
            </button>
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
          ) : filter === "PROYECTOS" ? (
            /* Vista PROYECTOS */
            <div className="space-y-20">
              {isViewingAlbums ? (
                <>
                  <button
                    onClick={handleBackToProyectos}
                    className="text-xs tracking-[0.2em] uppercase text-grey-muted hover:text-white-muted transition-colors"
                  >
                    ← Volver a proyectos
                  </button>
                  <p className="text-grey-muted text-xs tracking-wider uppercase mt-4">
                    {selectedProyecto?.name} · Álbumes
                  </p>
                  <div className="space-y-16 mt-8">
                    {albumsOfProyecto
                      .filter((a) => (search ? a.name.toLowerCase().includes(search.toLowerCase()) : true))
                      .map((album) => (
                        <button
                          key={album.id}
                          onClick={() => handleAlbumClick(album.slug)}
                          className="block text-left group w-full"
                        >
                          <p className="text-white-broken font-display text-xl group-hover:text-white-muted transition-colors duration-300">
                            {album.name}
                          </p>
                          <p className="text-grey-muted text-sm mt-1">
                            {album.worksCount ?? 0} canciones
                          </p>
                        </button>
                      ))}
                  </div>
                </>
              ) : isViewingSongs ? (
                <>
                  <button
                    onClick={
                      standaloneAlbum
                        ? () => setAlbumSlug(null)
                        : hasMultipleAlbums
                        ? handleBackToAlbums
                        : handleBackToProyectos
                    }
                    className="text-xs tracking-[0.2em] uppercase text-grey-muted hover:text-white-muted transition-colors"
                  >
                    ← Volver
                  </button>
                  <p className="text-grey-muted text-xs tracking-wider uppercase mt-4">
                    {standaloneAlbum
                      ? proyectosData?.standaloneProjects.find((p) => p.slug === albumSlug)?.name ?? ""
                      : hasMultipleAlbums
                      ? albumsOfProyecto.find((a) => a.slug === albumSlug)?.name ?? ""
                      : selectedProyecto?.name}
                    {" · Canciones"}
                  </p>
                  <div className="space-y-16 mt-8">
                    {currentSongs
                      .filter((w) =>
                        search ? w.title.toLowerCase().includes(search.toLowerCase()) : true
                      )
                      .map((work) => (
                        <Link
                          key={work.id}
                          href={`/obras/${work.slug}`}
                          className="block group"
                        >
                          <p className="text-white-broken font-display text-xl group-hover:text-white-muted transition-colors duration-300">
                            {work.title}
                          </p>
                          {work.excerpt && (
                            <p className="text-white-muted text-sm mt-4 line-clamp-2 max-w-xl">
                              {work.excerpt}
                            </p>
                          )}
                        </Link>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  {(proyectosData?.proyectos?.length === 0 && proyectosData?.standaloneProjects?.length === 0) ? (
                    <p className="text-grey-muted text-sm py-24 text-center">
                      No hay proyectos.
                    </p>
                  ) : (
                  <>
                  {proyectosData?.proyectos
                    ?.filter((p) =>
                      search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
                    )
                    .map((proyecto) => (
                      <div key={proyecto.id}>
                        <button
                          onClick={() => handleProyectoClick(proyecto.slug)}
                          className="block group w-full text-left"
                        >
                          <p className="text-white-broken font-display text-xl group-hover:text-white-muted transition-colors duration-300">
                            {proyecto.name}
                          </p>
                          <p className="text-grey-muted text-sm mt-1">
                            {proyecto.projects?.length ?? 0} álbum
                            {(proyecto.projects?.length ?? 0) !== 1 ? "es" : ""}
                          </p>
                        </button>
                      </div>
                    ))}
                  {proyectosData?.standaloneProjects
                    ?.filter((p) =>
                      search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
                    )
                    .map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setProyectoSlug(null);
                          setAlbumSlug(project.slug);
                        }}
                        className="block group w-full text-left"
                      >
                        <p className="text-white-broken font-display text-xl group-hover:text-white-muted transition-colors duration-300">
                          {project.name}
                        </p>
                        <p className="text-grey-muted text-sm mt-1">
                          {project.worksCount ?? 0} canciones
                        </p>
                      </button>
                    ))}
                  </>
                  )}
                </>
              )}
            </div>
          ) : (
            /* Vista CANCIONES / LIBROS */
            <div className="space-y-20">
              {(filter === "SONG" ? songsForDisplay : booksForDisplay).map(
                (work) => (
                  <Link
                    key={work.id}
                    href={`/obras/${work.slug}`}
                    className="block group"
                  >
                    <p className="text-grey-muted text-xs tracking-wider uppercase">
                      {typeLabels[work.type]}
                      {work.project &&
                        (work.project.proyecto
                          ? ` · ${work.project.proyecto.name} · ${work.project.name}`
                          : ` · ${work.project.name}`)}
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
                )
              )}
            </div>
          )}

          {!loading &&
            filter !== "PROYECTOS" &&
            (filter === "SONG" ? songsForDisplay : booksForDisplay).length === 0 && (
              <p className="text-grey-muted text-sm py-24 text-center">
                No hay obras en esta categoría.
              </p>
            )}
        </div>
      </section>
    </div>
  );
}
