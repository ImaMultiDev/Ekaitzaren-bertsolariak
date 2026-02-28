import type { Work } from "./types";

const API_BASE = "/api";

export async function fetchWorks(options?: {
  type?: string;
  featured?: boolean;
}): Promise<Work[]> {
  const params = new URLSearchParams();
  if (options?.type) params.set("type", options.type);
  if (options?.featured) params.set("featured", "true");
  const url = `${API_BASE}/works${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Error al cargar las obras");
  }
  return res.json();
}

export async function fetchWorkBySlug(slug: string): Promise<Work | null> {
  const res = await fetch(`${API_BASE}/works/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("Error al cargar la obra");
  }
  return res.json();
}
