import prisma from "./prisma";
import type { Work, Project, Proyecto } from "./types";
import { WorkType, Prisma } from "@prisma/client";

function serializeProyecto(p: { id: string; name: string; slug: string; order: number }): Proyecto {
  return { id: p.id, name: p.name, slug: p.slug, order: p.order };
}

function serializeProject(p: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  year: number | null;
  order: number;
  proyecto?: { id: string; name: string; slug: string; order: number } | null;
}): Project {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? undefined,
    imageUrl: p.imageUrl ?? undefined,
    year: p.year ?? undefined,
    order: p.order,
    proyecto: p.proyecto ? serializeProyecto(p.proyecto) : undefined,
  };
}

function serializeWork(work: {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  content: string | null;
  type: WorkType;
  featured: boolean;
  order: number;
  project: { id: string; name: string; slug: string; description: string | null; imageUrl: string | null; year: number | null; order: number; proyecto?: { id: string; name: string; slug: string; order: number } | null } | null;
  song: { soundcloudId: string | null; soundcloudUrl: string | null } | null;
  book: { pdfUrl: string | null; embedUrl: string | null } | null;
  images: { cloudinaryUrl: string; alt: string | null; caption: string | null }[];
  tags: { tag: { name: string } }[];
}): Work {
  return {
    id: work.id,
    title: work.title,
    slug: work.slug,
    subtitle: work.subtitle ?? undefined,
    excerpt: work.excerpt ?? undefined,
    content: work.content ?? undefined,
    type: work.type,
    featured: work.featured,
    order: work.order,
    project: work.project ? serializeProject(work.project) : undefined,
    soundcloudId: work.song?.soundcloudId ?? undefined,
    soundcloudUrl: work.song?.soundcloudUrl ?? undefined,
    pdfUrl: work.book?.pdfUrl ?? undefined,
    embedUrl: work.book?.embedUrl ?? undefined,
    images: work.images.map((img) => ({
      url: img.cloudinaryUrl,
      alt: img.alt ?? undefined,
      caption: img.caption ?? undefined,
    })),
    tags: work.tags.map((wt) => wt.tag.name),
  };
}

const workInclude = {
  project: { include: { proyecto: true } },
  song: true,
  book: true,
  images: { orderBy: { order: "asc" as const } },
  tags: { include: { tag: true } },
};

export async function getWorks(options?: {
  type?: WorkType;
  featured?: boolean;
  projectSlug?: string;
  search?: string;
}): Promise<Work[]> {
  const where: Record<string, unknown> = { publishedAt: { not: null } };

  if (options?.type) where.type = options.type;
  if (options?.featured) where.featured = true;
  if (options?.projectSlug) where.project = { slug: options.projectSlug };

  if (options?.search && options.search.trim()) {
    const q = options.search.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { project: { name: { contains: q, mode: "insensitive" } } },
      { project: { proyecto: { name: { contains: q, mode: "insensitive" } } } },
    ];
  }

  const works = await prisma.work.findMany({
    where: where as Prisma.WorkWhereInput,
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    include: workInclude,
  });

  return works.map(serializeWork);
}

export async function getProyectos(): Promise<Proyecto[]> {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { order: "asc" },
    include: {
      projects: {
        orderBy: { order: "asc" },
        include: { _count: { select: { works: true } } },
      },
    },
  });
  return proyectos.map((p) => ({
    ...serializeProyecto(p),
    projects: p.projects.map((proj) => ({
      ...serializeProject(proj),
      worksCount: proj._count.works,
    })),
  }));
}

export async function getProjectsWithoutProyecto(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: { proyectoId: null },
    orderBy: { order: "asc" },
    include: { _count: { select: { works: true } } },
  });
  return projects.map((p) => ({
    ...serializeProject(p),
    worksCount: p._count.works,
  }));
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const work = await prisma.work.findUnique({
    where: { slug, publishedAt: { not: null } },
    include: workInclude,
  });
  if (!work) return null;
  return serializeWork(work);
}

export async function getWorkSlugs(): Promise<string[]> {
  const works = await prisma.work.findMany({
    where: { publishedAt: { not: null } },
    select: { slug: true },
  });
  return works.map((w) => w.slug);
}

