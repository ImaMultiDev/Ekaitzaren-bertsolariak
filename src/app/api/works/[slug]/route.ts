import { NextRequest, NextResponse } from "next/server";
import { getWorkBySlug } from "@/lib/works";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug requerido" },
        { status: 400 }
      );
    }

    const work = await getWorkBySlug(slug);

    if (!work) {
      return NextResponse.json(
        { error: "Obra no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(work);
  } catch (error) {
    console.error("[API] Error fetching work:", error);
    return NextResponse.json(
      { error: "Error al obtener la obra" },
      { status: 500 }
    );
  }
}
