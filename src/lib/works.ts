import prisma from "./prisma";
import type { Work } from "./types";
import { WorkType } from "@prisma/client";

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

export async function getWorks(options?: {
  type?: WorkType;
  featured?: boolean;
}): Promise<Work[]> {
  const where: {
    publishedAt: { not: null };
    type?: WorkType;
    featured?: boolean;
  } = {
    publishedAt: { not: null },
  };

  if (options?.type) where.type = options.type;
  if (options?.featured) where.featured = true;

  const works = await prisma.work.findMany({
    where,
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    include: {
      song: true,
      book: true,
      images: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
    },
  });

  return works.map(serializeWork);
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const work = await prisma.work.findUnique({
    where: {
      slug,
      publishedAt: { not: null },
    },
    include: {
      song: true,
      book: true,
      images: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
    },
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
