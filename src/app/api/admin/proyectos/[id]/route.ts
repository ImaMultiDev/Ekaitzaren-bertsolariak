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
  const { name, order } = body;
  const data: { name?: string; slug?: string; order?: number } = {};
  if (name?.trim()) {
    data.name = name.trim();
    data.slug = toSlug(name);
  }
  if (typeof order === "number") data.order = order;
  const proyecto = await prisma.proyecto.update({
    where: { id },
    data,
  });
  return NextResponse.json(proyecto);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  await prisma.proyecto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
