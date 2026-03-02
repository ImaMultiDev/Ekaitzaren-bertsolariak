import * as fs from "fs";
import * as path from "path";
import prisma from "../src/lib/prisma";

function findContentDir(): string {
  const candidates = [
    path.join(process.cwd(), "content", "txt_letras"),
    path.join(process.cwd(), "..", "content", "txt_letras"),
    path.join(process.cwd(), "..", "..", "content", "txt_letras"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return candidates[0];
}
const CONTENT_DIR = findContentDir();

function parseFilename(
  filename: string,
): { track: number; title: string } | null {
  const match = filename.match(/^(\d{2})_(.+)\.txt$/);
  if (!match) return null;
  const track = parseInt(match[1], 10);
  const titleRaw = match[2].replace(/_/g, " ");
  const title = titleRaw
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return { track, title };
}

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function importSongsFromAlbum(
  albumPath: string,
): { track: number; title: string; content: string; slug: string }[] {
  if (!fs.existsSync(albumPath)) {
    console.warn("Carpeta no encontrada:", albumPath);
    return [];
  }

  const files = fs.readdirSync(albumPath).filter((f) => f.endsWith(".txt"));
  const songs: {
    track: number;
    title: string;
    content: string;
    slug: string;
  }[] = [];

  for (const file of files.sort()) {
    const parsed = parseFilename(file);
    if (!parsed) continue;
    const content = fs.readFileSync(path.join(albumPath, file), "utf-8").trim();
    songs.push({
      track: parsed.track,
      title: parsed.title,
      content,
      slug: toSlug(parsed.title),
    });
  }

  return songs;
}

async function main() {
  await prisma.workTag.deleteMany({});
  await prisma.workImage.deleteMany({});
  await prisma.song.deleteMany({});
  await prisma.book.deleteMany({});
  await prisma.work.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.proyecto.deleteMany({});

  const author = await prisma.author.upsert({
    where: { slug: "ekaitzaren-bertsolariak" },
    update: {},
    create: {
      name: "Ekaitzaren Bertsolariak",
      slug: "ekaitzaren-bertsolariak",
      bio: "Autor-compositor de letras, canciones y libros. Rock, punk-rock y ska-punk.",
    },
  });

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "tormenta" },
      update: {},
      create: { name: "tormenta", slug: "tormenta" },
    }),
    prisma.tag.upsert({
      where: { slug: "resistencia" },
      update: {},
      create: { name: "resistencia", slug: "resistencia" },
    }),
    prisma.tag.upsert({
      where: { slug: "verdad" },
      update: {},
      create: { name: "verdad", slug: "verdad" },
    }),
    prisma.tag.upsert({
      where: { slug: "dignidad" },
      update: {},
      create: { name: "dignidad", slug: "dignidad" },
    }),
    prisma.tag.upsert({
      where: { slug: "libro" },
      update: {},
      create: { name: "libro", slug: "libro" },
    }),
  ]);
  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t.id]));

  const proyecto = await prisma.proyecto.upsert({
    where: { slug: "kaos-ekaitza" },
    update: {},
    create: {
      name: "Kaos Ekaitza",
      slug: "kaos-ekaitza",
      order: 1,
    },
  });

  const project1 = await prisma.project.upsert({
    where: { slug: "gritos-en-la-tormenta" },
    update: { proyectoId: proyecto.id },
    create: {
      name: "Gritos en la Tormenta",
      slug: "gritos-en-la-tormenta",
      description: "Álbum de Kaos Ekaitza. 10 canciones.",
      year: 2024,
      order: 1,
      proyectoId: proyecto.id,
    },
  });

  const project2 = await prisma.project.upsert({
    where: { slug: "revienta-el-silencio" },
    update: { proyectoId: proyecto.id },
    create: {
      name: "Revienta el Silencio",
      slug: "revienta-el-silencio",
      description: "Álbum de Kaos Ekaitza. 10 canciones.",
      year: 2025,
      order: 2,
      proyectoId: proyecto.id,
    },
  });

  const now = new Date();

  const albums = [
    {
      path: path.join(
        CONTENT_DIR,
        "kaos_ekaitza",
        "album1_gritos_en_la_tormenta",
      ),
      project: project1,
      orderOffset: 0,
    },
    {
      path: path.join(
        CONTENT_DIR,
        "kaos_ekaitza",
        "album2_revienta_el_silencio",
      ),
      project: project2,
      orderOffset: 10,
    },
  ];

  let totalSongs = 0;
  for (const album of albums) {
    const songs = importSongsFromAlbum(album.path);
    for (const song of songs) {
      const excerpt =
        song.content.split("\n").slice(0, 3).join(" ").slice(0, 150) + "...";
      const work = await prisma.work.upsert({
        where: { slug: song.slug },
        update: {
          title: song.title,
          content: song.content,
          excerpt,
          order: album.orderOffset + song.track,
        },
        create: {
          title: song.title,
          slug: song.slug,
          excerpt,
          content: song.content,
          type: "SONG",
          featured: song.track <= 2,
          order: album.orderOffset + song.track,
          authorId: author.id,
          projectId: album.project.id,
          publishedAt: now,
        },
      });

      await prisma.song.upsert({
        where: { workId: work.id },
        update: {},
        create: { workId: work.id },
      });
      totalSongs++;
    }
  }

  const bookWork = await prisma.work.upsert({
    where: { slug: "cuando-habla-la-tormenta" },
    update: {},
    create: {
      title: "Cuando habla la tormenta",
      slug: "cuando-habla-la-tormenta",
      excerpt: "Libro que narra la historia de una tormenta.",
      type: "BOOK",
      featured: false,
      order: 100,
      authorId: author.id,
      publishedAt: now,
    },
  });

  await prisma.book.upsert({
    where: { workId: bookWork.id },
    update: {},
    create: {
      workId: bookWork.id,
      embedUrl: process.env.CANVA_BOOK_URL || "",
    },
  });

  await prisma.workTag.upsert({
    where: {
      workId_tagId: {
        workId: bookWork.id,
        tagId: tagMap.libro,
      },
    },
    update: {},
    create: {
      workId: bookWork.id,
      tagId: tagMap.libro,
    },
  });

  console.log(`Seed completado: ${totalSongs} canciones, 1 libro.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
