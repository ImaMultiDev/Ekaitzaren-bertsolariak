import type { Work } from "./types";

const API_BASE = "/api";

export interface ProyectoWithProjects {
  id: string;
  name: string;
  slug: string;
  order: number;
  projects?: { id: string; name: string; slug: string; worksCount?: number }[];
}

export interface ProyectosResponse {
  proyectos: ProyectoWithProjects[];
  standaloneProjects: { id: string; name: string; slug: string; worksCount?: number }[];
}

export async function fetchProyectos(): Promise<ProyectosResponse> {
  const res = await fetch(`${API_BASE}/proyectos`);
  if (!res.ok) {
    throw new Error("Error al cargar los proyectos");
  }
  return res.json();
}

export async function fetchWorks(options?: {
  type?: string;
  featured?: boolean;
  project?: string;
  search?: string;
}): Promise<Work[]> {
  const params = new URLSearchParams();
  if (options?.type) params.set("type", options.type);
  if (options?.featured) params.set("featured", "true");
  if (options?.project) params.set("project", options.project);
  if (options?.search) params.set("search", options.search);
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
