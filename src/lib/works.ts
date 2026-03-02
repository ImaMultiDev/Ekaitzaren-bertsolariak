import prisma from "./prisma";
import type { Work, Project } from "./types";
import { WorkType } from "@prisma/client";

function serializeProject(p: { id: string; name: string; slug: string; description: string | null; imageUrl: string | null; year: number | null; order: number }): Project {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? undefined,
    imageUrl: p.imageUrl ?? undefined,
    year: p.year ?? undefined,
    order: p.order,
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
  project: { id: string; name: string; slug: string; description: string | null; imageUrl: string | null; year: number | null; order: number } | null;
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
  project: true,
  song: true,
  book: true,
  images: { orderBy: { order: "asc" as const } },
  tags: { include: { tag: true } },
};

export async function getWorks(options?: {
  type?: WorkType;
  featured?: boolean;
  projectSlug?: string;
}): Promise<Work[]> {
  const where: {
    publishedAt: { not: null };
    type?: WorkType;
    featured?: boolean;
    project?: { slug: string };
  } = { publishedAt: { not: null } };

  if (options?.type) where.type = options.type;
  if (options?.featured) where.featured = true;
  if (options?.projectSlug) where.project = { slug: options.projectSlug };

  const works = await prisma.work.findMany({
    where,
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    include: workInclude,
  });

  return works.map(serializeWork);
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

export async function getProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { year: "desc" }],
    include: {
      _count: { select: { works: true } },
    },
  });
  return projects.map((p) => ({
    ...serializeProject(p),
    worksCount: p._count.works,
  }));
}

export async function getProjectBySlug(slug: string): Promise<{ project: Project; works: Work[] } | null> {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      works: {
        where: { publishedAt: { not: null } },
        orderBy: [{ order: "asc" }],
        include: workInclude,
      },
    },
  });
  if (!project) return null;
  return {
    project: { ...serializeProject(project), worksCount: project.works.length },
    works: project.works.map(serializeWork),
  };
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await prisma.project.findMany({ select: { slug: true } });
  return projects.map((p) => p.slug);
}
