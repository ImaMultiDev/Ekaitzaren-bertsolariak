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
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { order: "asc" },
    include: { projects: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const { name, order = 0 } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  const slug = toSlug(name);
  const proyecto = await prisma.proyecto.create({
    data: { name: name.trim(), slug, order },
  });
  return NextResponse.json(proyecto);
}
