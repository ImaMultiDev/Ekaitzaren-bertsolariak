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
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { year: "desc" }],
    include: { proyecto: true },
  });
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const { name, description, year, proyectoId, order = 0 } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  const slug = toSlug(name);
  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      year: year ? parseInt(String(year), 10) : null,
      proyectoId: proyectoId || null,
      order,
    },
  });
  return NextResponse.json(project);
}
