"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Work = {
  id: string;
  title: string;
  slug: string;
  type: string;
  publishedAt: string | null;
  featured: boolean;
  order: number;
  project: { id: string; name: string; proyecto?: { name: string } } | null;
  song: { soundcloudId: string | null } | null;
  book: { embedUrl: string | null; pdfUrl: string | null } | null;
};

type Project = { id: string; name: string; proyectoId: string | null };

export default function AdminObrasPage() {
  const [obras, setObras] = useState<Work[]>([]);
  const [albumes, setAlbumes] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    excerpt: "",
    content: "",
    type: "SONG" as "SONG" | "BOOK",
    projectId: "",
    published: false,
    featured: false,
    soundcloudId: "",
    embedUrl: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/obras").then((r) => r.json()),
      fetch("/api/admin/albumes").then((r) => r.json()),
    ])
      .then(([works, albums]) => {
        setObras(works);
        setAlbumes(albums);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/obras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          subtitle: form.subtitle.trim() || undefined,
          excerpt: form.excerpt.trim() || undefined,
          content: form.content.trim() || undefined,
          type: form.type,
          projectId: form.projectId || undefined,
          published: form.published,
          featured: form.featured,
          soundcloudId: form.type === "SONG" ? form.soundcloudId.trim() || undefined : undefined,
          embedUrl: form.type === "BOOK" ? form.embedUrl.trim() || undefined : undefined,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setObras((o) => [...o, created]);
        setForm({
          title: "",
          subtitle: "",
          excerpt: "",
          content: "",
          type: "SONG",
          projectId: "",
          published: false,
          featured: false,
          soundcloudId: "",
          embedUrl: "",
        });
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta obra?")) return;
    const res = await fetch(`/api/admin/obras/${id}`, { method: "DELETE" });
    if (res.ok) setObras((o) => o.filter((x) => x.id !== id));
  }

  async function togglePublished(w: Work) {
    const res = await fetch(`/api/admin/obras/${w.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !w.publishedAt }),
    });
    if (res.ok) {
      const updated = await res.json();
      setObras((o) => o.map((x) => (x.id === w.id ? updated : x)));
    }
  }

  async function toggleFeatured(w: Work) {
    const res = await fetch(`/api/admin/obras/${w.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !w.featured }),
    });
    if (res.ok) {
      const updated = await res.json();
      setObras((o) => o.map((x) => (x.id === w.id ? updated : x)));
    }
  }

  if (loading) return <p className="text-grey-muted">Cargando...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-white-broken mb-8">Obras</h1>

      <form onSubmit={handleCreate} className="mb-12 space-y-4 max-w-2xl">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-grey-muted uppercase mb-1">Título</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Título de la canción o libro"
              className="w-full bg-transparent border border-border px-4 py-2 text-white-broken placeholder-grey-muted focus:outline-none focus:border-white-broken/40"
            />
          </div>
          <div>
            <label className="block text-xs text-grey-muted uppercase mb-1">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "SONG" | "BOOK" }))}
              className="bg-transparent border border-border px-4 py-2 text-white-broken focus:outline-none focus:border-white-broken/40"
            >
              <option value="SONG">Canción</option>
              <option value="BOOK">Libro</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-grey-muted uppercase mb-1">Álbum</label>
          <select
            value={form.projectId}
            onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken focus:outline-none focus:border-white-broken/40"
          >
            <option value="">— Sin álbum —</option>
            {albumes.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        {form.type === "SONG" && (
          <div>
            <label className="block text-xs text-grey-muted uppercase mb-1">ID SoundCloud</label>
            <input
              type="text"
              value={form.soundcloudId}
              onChange={(e) => setForm((f) => ({ ...f, soundcloudId: e.target.value }))}
              placeholder="ID de la pista en SoundCloud"
              className="w-full bg-transparent border border-border px-4 py-2 text-white-broken placeholder-grey-muted focus:outline-none focus:border-white-broken/40"
            />
          </div>
        )}
        {form.type === "BOOK" && (
          <div>
            <label className="block text-xs text-grey-muted uppercase mb-1">URL Canva / enlace</label>
            <input
              type="url"
              value={form.embedUrl}
              onChange={(e) => setForm((f) => ({ ...f, embedUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-transparent border border-border px-4 py-2 text-white-broken placeholder-grey-muted focus:outline-none focus:border-white-broken/40"
            />
          </div>
        )}
        <div>
          <label className="block text-xs text-grey-muted uppercase mb-1">Letra / contenido</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            rows={8}
            placeholder="Letra de la canción o contenido del libro"
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken placeholder-grey-muted focus:outline-none focus:border-white-broken/40"
          />
        </div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-white-muted">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="bg-transparent border border-border"
            />
            Publicado
          </label>
          <label className="flex items-center gap-2 text-sm text-white-muted">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="bg-transparent border border-border"
            />
            Destacado
          </label>
        </div>
        <button
          type="submit"
          disabled={creating || !form.title.trim()}
          className="px-4 py-2 text-sm uppercase bg-white-broken text-charcoal hover:bg-white-muted disabled:opacity-50"
        >
          Crear obra
        </button>
      </form>

      <ul className="space-y-4">
        {obras.map((w) => (
          <li key={w.id} className="flex items-center justify-between border-b border-border py-4">
            <div>
              <p className="text-white-broken">
                {w.title}
                <span className="text-xs text-grey-muted ml-2">
                  ({w.type === "SONG" ? "Canción" : "Libro"})
                </span>
              </p>
              <p className="text-xs text-grey-muted">
                {w.project?.proyecto?.name ?? ""}
                {w.project?.proyecto && " · "}
                {w.project?.name ?? "Sin álbum"}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => toggleFeatured(w)}
                title={w.featured ? "Quitar de destacados" : "Añadir a destacados"}
                className={`text-sm ${w.featured ? "text-amber-400" : "text-grey-muted hover:text-white-muted"}`}
              >
                {w.featured ? "★" : "☆"}
              </button>
              <button
                onClick={() => togglePublished(w)}
                className={`text-xs uppercase ${w.publishedAt ? "text-white-muted" : "text-grey-muted"}`}
              >
                {w.publishedAt ? "Publicado" : "Borrador"}
              </button>
              <Link
                href={`/obras/${w.slug}`}
                target="_blank"
                className="text-xs uppercase text-grey-muted hover:text-white-muted"
              >
                Ver
              </Link>
              <Link
                href={`/admin/obras/${w.id}`}
                className="text-xs uppercase text-grey-muted hover:text-white-muted"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(w.id)}
                className="text-xs uppercase text-grey-muted hover:text-white-muted"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
