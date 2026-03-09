"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminProyectosPage() {
  const [proyectos, setProyectos] = useState<{ id: string; name: string; slug: string; order: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch("/api/admin/proyectos")
      .then((r) => r.json())
      .then(setProyectos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (res.ok) {
        const created = await res.json();
        setProyectos((p) => [...p, created]);
        setNewName("");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este proyecto?")) return;
    const res = await fetch(`/api/admin/proyectos/${id}`, { method: "DELETE" });
    if (res.ok) setProyectos((p) => p.filter((x) => x.id !== id));
  }

  if (loading) return <p className="text-grey-muted">Cargando...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-white-broken mb-8">Proyectos</h1>

      <form onSubmit={handleCreate} className="mb-12 flex gap-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre del proyecto"
          className="flex-1 max-w-xs bg-transparent border border-border px-4 py-2 text-white-broken placeholder-grey-muted focus:outline-none focus:border-white-broken/40"
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="px-4 py-2 text-sm uppercase bg-white-broken text-charcoal hover:bg-white-muted disabled:opacity-50"
        >
          Crear
        </button>
      </form>

      <ul className="space-y-4">
        {proyectos.map((p) => (
          <li key={p.id} className="flex items-center justify-between border-b border-border py-4">
            <div>
              <p className="text-white-broken">{p.name}</p>
              <p className="text-xs text-grey-muted">{p.slug}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/albumes?proyecto=${p.id}`}
                className="text-xs uppercase text-grey-muted hover:text-white-muted"
              >
                Álbumes
              </Link>
              <button
                onClick={() => handleDelete(p.id)}
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
