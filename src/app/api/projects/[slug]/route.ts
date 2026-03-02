import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/works";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Slug requerido" }, { status: 400 });
    }
    const result = await getProjectBySlug(slug);
    if (!result) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Error fetching project:", error);
    return NextResponse.json(
      { error: "Error al obtener el proyecto" },
      { status: 500 }
    );
  }
}
