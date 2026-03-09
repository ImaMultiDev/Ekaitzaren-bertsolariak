import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const works = await prisma.work.findMany({
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
    include: {
      project: { include: { proyecto: true } },
      song: true,
      book: true,
    },
  });
  return NextResponse.json(works);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const {
    title,
    subtitle,
    excerpt,
    content,
    type,
    projectId,
    order = 0,
    published = false,
    featured = false,
    soundcloudId,
    soundcloudUrl,
    embedUrl,
    pdfUrl,
  } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Título requerido" }, { status: 400 });
  if (!type || !["SONG", "BOOK"].includes(type)) {
    return NextResponse.json({ error: "Tipo debe ser SONG o BOOK" }, { status: 400 });
  }

  const author = await prisma.author.findFirst();
  if (!author) return NextResponse.json({ error: "No hay autor" }, { status: 500 });

  const slug = toSlug(title);
  const work = await prisma.work.create({
    data: {
      title: title.trim(),
      slug,
      subtitle: subtitle?.trim() || null,
      excerpt: excerpt?.trim() || null,
      content: content?.trim() || null,
      type,
      projectId: projectId || null,
      order,
      publishedAt: published ? new Date() : null,
      featured,
      authorId: author.id,
    },
  });

  if (type === "SONG") {
    await prisma.song.create({
      data: {
        workId: work.id,
        soundcloudId: soundcloudId || null,
        soundcloudUrl: soundcloudUrl || null,
      },
    });
  }
  if (type === "BOOK") {
    await prisma.book.create({
      data: {
        workId: work.id,
        embedUrl: embedUrl || null,
        pdfUrl: pdfUrl || null,
      },
    });
  }

  const full = await prisma.work.findUnique({
    where: { id: work.id },
    include: { project: { include: { proyecto: true } }, song: true, book: true },
  });
  return NextResponse.json(full);
}
