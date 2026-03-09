"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Work = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  content: string | null;
  type: string;
  publishedAt: string | null;
  featured: boolean;
  order: number;
  projectId: string | null;
  project: { id: string; name: string } | null;
  song: { soundcloudId: string | null; soundcloudUrl: string | null } | null;
  book: { embedUrl: string | null; pdfUrl: string | null } | null;
};

export default function AdminObraEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [work, setWork] = useState<Work | null>(null);
  const [albumes, setAlbumes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    excerpt: "",
    content: "",
    projectId: "",
    published: false,
    featured: false,
    soundcloudId: "",
    embedUrl: "",
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/obras`).then((r) => r.json()),
      fetch(`/api/admin/albumes`).then((r) => r.json()),
    ])
      .then(([works, albums]) => {
        const w = works.find((x: Work) => x.id === id);
        if (w) {
          setWork(w);
          setForm({
            title: w.title,
            subtitle: w.subtitle ?? "",
            excerpt: w.excerpt ?? "",
            content: w.content ?? "",
            projectId: w.projectId ?? "",
            published: !!w.publishedAt,
            featured: w.featured,
            soundcloudId: w.song?.soundcloudId ?? "",
            embedUrl: w.book?.embedUrl ?? "",
          });
        }
        setAlbumes(albums);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/obras/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          subtitle: form.subtitle.trim() || null,
          excerpt: form.excerpt.trim() || null,
          content: form.content.trim() || null,
          projectId: form.projectId || null,
          published: form.published,
          featured: form.featured,
          soundcloudId: work?.type === "SONG" ? form.soundcloudId.trim() || null : undefined,
          embedUrl: work?.type === "BOOK" ? form.embedUrl.trim() || null : undefined,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setWork(updated);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-grey-muted">Cargando...</p>;
  if (!work) return <p className="text-grey-muted">Obra no encontrada.</p>;

  return (
    <div>
      <Link href="/admin/obras" className="text-xs uppercase text-grey-muted hover:text-white-muted mb-6 inline-block">
        ← Volver a obras
      </Link>
      <h1 className="font-display text-2xl text-white-broken mb-8">Editar: {work.title}</h1>

      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-xs text-grey-muted uppercase mb-1">Título</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken focus:outline-none focus:border-white-broken/40"
          />
        </div>
        <div>
          <label className="block text-xs text-grey-muted uppercase mb-1">Subtítulo</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken focus:outline-none focus:border-white-broken/40"
          />
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
        {work.type === "SONG" && (
          <div>
            <label className="block text-xs text-grey-muted uppercase mb-1">ID SoundCloud</label>
            <input
              type="text"
              value={form.soundcloudId}
              onChange={(e) => setForm((f) => ({ ...f, soundcloudId: e.target.value }))}
              className="w-full bg-transparent border border-border px-4 py-2 text-white-broken focus:outline-none focus:border-white-broken/40"
            />
          </div>
        )}
        {work.type === "BOOK" && (
          <div>
            <label className="block text-xs text-grey-muted uppercase mb-1">URL Canva / enlace</label>
            <input
              type="url"
              value={form.embedUrl}
              onChange={(e) => setForm((f) => ({ ...f, embedUrl: e.target.value }))}
              className="w-full bg-transparent border border-border px-4 py-2 text-white-broken focus:outline-none focus:border-white-broken/40"
            />
          </div>
        )}
        <div>
          <label className="block text-xs text-grey-muted uppercase mb-1">Letra / contenido</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            rows={12}
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken focus:outline-none focus:border-white-broken/40"
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
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving || !form.title.trim()}
            className="px-4 py-2 text-sm uppercase bg-white-broken text-charcoal hover:bg-white-muted disabled:opacity-50"
          >
            Guardar
          </button>
          <Link
            href={`/obras/${work.slug}`}
            target="_blank"
            className="px-4 py-2 text-sm uppercase border border-border text-white-broken hover:border-white-broken/40"
          >
            Ver en web
          </Link>
        </div>
      </form>
    </div>
  );
}
