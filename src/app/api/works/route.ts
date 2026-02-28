import { NextRequest, NextResponse } from "next/server";
import { getWorks } from "@/lib/works";
import { WorkType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as WorkType | null;
    const featured = searchParams.get("featured");

    const options: { type?: WorkType; featured?: boolean } = {};
    if (type && ["SONG", "BOOK", "POEM", "OTHER"].includes(type)) {
      options.type = type;
    }
    if (featured === "true") {
      options.featured = true;
    }

    const works = await getWorks(options);
    return NextResponse.json(works);
  } catch (error) {
    console.error("[API] Error fetching works:", error);
    return NextResponse.json(
      { error: "Error al obtener las obras" },
      { status: 500 }
    );
  }
}
