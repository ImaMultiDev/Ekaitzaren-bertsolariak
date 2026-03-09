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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const {
    title,
    subtitle,
    excerpt,
    content,
    projectId,
    order,
    published,
    featured,
    soundcloudId,
    soundcloudUrl,
    embedUrl,
    pdfUrl,
  } = body;

  const workData: Record<string, unknown> = {};
  if (title?.trim()) {
    workData.title = title.trim();
    workData.slug = toSlug(title);
  }
  if (subtitle !== undefined) workData.subtitle = subtitle?.trim() || null;
  if (excerpt !== undefined) workData.excerpt = excerpt?.trim() || null;
  if (content !== undefined) workData.content = content?.trim() || null;
  if (projectId !== undefined) workData.projectId = projectId || null;
  if (typeof order === "number") workData.order = order;
  if (typeof published === "boolean") workData.publishedAt = published ? new Date() : null;
  if (typeof featured === "boolean") workData.featured = featured;

  await prisma.work.update({ where: { id }, data: workData });

  const work = await prisma.work.findUnique({
    where: { id },
    include: { song: true, book: true },
  });
  if (!work) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  if (work.type === "SONG") {
    if (work.song) {
      await prisma.song.update({
        where: { workId: id },
        data: {
          soundcloudId: soundcloudId !== undefined ? soundcloudId || null : undefined,
          soundcloudUrl: soundcloudUrl !== undefined ? soundcloudUrl || null : undefined,
        },
      });
    } else if (soundcloudId !== undefined || soundcloudUrl !== undefined) {
      await prisma.song.create({
        data: {
          workId: id,
          soundcloudId: soundcloudId || null,
          soundcloudUrl: soundcloudUrl || null,
        },
      });
    }
  }
  if (work.book) {
    await prisma.book.update({
      where: { workId: id },
      data: {
        embedUrl: embedUrl !== undefined ? embedUrl || null : undefined,
        pdfUrl: pdfUrl !== undefined ? pdfUrl || null : undefined,
      },
    });
  }

  const full = await prisma.work.findUnique({
    where: { id },
    include: { project: { include: { proyecto: true } }, song: true, book: true },
  });
  return NextResponse.json(full);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  await prisma.work.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
