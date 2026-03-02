import { NextResponse } from "next/server";
import { getProjects } from "@/lib/works";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[API] Error fetching projects:", error);
    return NextResponse.json(
      { error: "Error al obtener los proyectos" },
      { status: 500 }
    );
  }
}
