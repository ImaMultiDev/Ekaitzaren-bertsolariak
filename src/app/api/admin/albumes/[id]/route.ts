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
  const { name, description, year, proyectoId, order } = body;
  const data: Record<string, unknown> = {};
  if (name?.trim()) {
    data.name = name.trim();
    data.slug = toSlug(name);
  }
  if (description !== undefined) data.description = description?.trim() || null;
  if (year !== undefined) data.year = year ? parseInt(String(year), 10) : null;
  if (proyectoId !== undefined) data.proyectoId = proyectoId || null;
  if (typeof order === "number") data.order = order;
  const project = await prisma.project.update({
    where: { id },
    data,
  });
  return NextResponse.json(project);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
