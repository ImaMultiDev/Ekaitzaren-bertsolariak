import { NextResponse } from "next/server";
import { getProyectos, getProjectsWithoutProyecto } from "@/lib/works";

export async function GET() {
  try {
    const [proyectos, standaloneProjects] = await Promise.all([
      getProyectos(),
      getProjectsWithoutProyecto(),
    ]);
    return NextResponse.json({
      proyectos,
      standaloneProjects,
    });
  } catch (error) {
    console.error("[API] Error fetching proyectos:", error);
    return NextResponse.json(
      { error: "Error al obtener los proyectos" },
      { status: 500 }
    );
  }
}
