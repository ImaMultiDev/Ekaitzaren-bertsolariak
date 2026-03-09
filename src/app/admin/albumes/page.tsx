"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Album = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  year: number | null;
  order: number;
  proyectoId: string | null;
  proyecto: { id: string; name: string } | null;
};

type Proyecto = { id: string; name: string; slug: string };

export default function AdminAlbumesPage() {
  const [albumes, setAlbumes] = useState<Album[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", year: "", proyectoId: "" });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/albumes").then((r) => r.json()),
      fetch("/api/admin/proyectos").then((r) => r.json()),
    ])
      .then(([albums, proys]) => {
        setAlbumes(albums);
        setProyectos(proys);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/albumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          year: form.year ? parseInt(form.year, 10) : undefined,
          proyectoId: form.proyectoId || undefined,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setAlbumes((a) => [...a, created]);
        setForm({ name: "", description: "", year: "", proyectoId: "" });
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este álbum?")) return;
    const res = await fetch(`/api/admin/albumes/${id}`, { method: "DELETE" });
    if (res.ok) setAlbumes((a) => a.filter((x) => x.id !== id));
  }

  if (loading) return <p className="text-grey-muted">Cargando...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-white-broken mb-8">Álbumes</h1>

      <form onSubmit={handleCreate} className="mb-12 space-y-4 max-w-xl">
        <div>
          <label className="block text-xs text-grey-muted uppercase mb-1">Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ej: Gritos en la Tormenta"
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken placeholder-grey-muted focus:outline-none focus:border-white-broken/40"
          />
        </div>
        <div>
          <label className="block text-xs text-grey-muted uppercase mb-1">Año</label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            placeholder="2024"
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken placeholder-grey-muted focus:outline-none focus:border-white-broken/40"
          />
        </div>
        <div>
          <label className="block text-xs text-grey-muted uppercase mb-1">Proyecto</label>
          <select
            value={form.proyectoId}
            onChange={(e) => setForm((f) => ({ ...f, proyectoId: e.target.value }))}
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken focus:outline-none focus:border-white-broken/40"
          >
            <option value="">— Sin proyecto —</option>
            {proyectos.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-grey-muted uppercase mb-1">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full bg-transparent border border-border px-4 py-2 text-white-broken placeholder-grey-muted focus:outline-none focus:border-white-broken/40"
          />
        </div>
        <button
          type="submit"
          disabled={creating || !form.name.trim()}
          className="px-4 py-2 text-sm uppercase bg-white-broken text-charcoal hover:bg-white-muted disabled:opacity-50"
        >
          Crear álbum
        </button>
      </form>

      <ul className="space-y-4">
        {albumes.map((a) => (
          <li key={a.id} className="flex items-center justify-between border-b border-border py-4">
            <div>
              <p className="text-white-broken">{a.name}</p>
              <p className="text-xs text-grey-muted">
                {a.proyecto?.name ?? "Sin proyecto"} · {a.year ?? "—"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/obras?album=${a.id}`}
                className="text-xs uppercase text-grey-muted hover:text-white-muted"
              >
                Obras
              </Link>
              <button
                onClick={() => handleDelete(a.id)}
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
