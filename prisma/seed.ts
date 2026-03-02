import prisma from "../src/lib/prisma";

async function main() {
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
    prisma.tag.upsert({ where: { slug: "tormenta" }, update: {}, create: { name: "tormenta", slug: "tormenta" } }),
    prisma.tag.upsert({ where: { slug: "resistencia" }, update: {}, create: { name: "resistencia", slug: "resistencia" } }),
    prisma.tag.upsert({ where: { slug: "verdad" }, update: {}, create: { name: "verdad", slug: "verdad" } }),
    prisma.tag.upsert({ where: { slug: "luz" }, update: {}, create: { name: "luz", slug: "luz" } }),
    prisma.tag.upsert({ where: { slug: "dignidad" }, update: {}, create: { name: "dignidad", slug: "dignidad" } }),
    prisma.tag.upsert({ where: { slug: "antologia" }, update: {}, create: { name: "antología", slug: "antologia" } }),
    prisma.tag.upsert({ where: { slug: "libro" }, update: {}, create: { name: "libro", slug: "libro" } }),
  ]);
  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t.id]));

  const project1 = await prisma.project.upsert({
    where: { slug: "ekaitza-ep" },
    update: {},
    create: {
      name: "Ekaitza EP",
      slug: "ekaitza-ep",
      description: "Primer trabajo. La tormenta empieza aquí.",
      year: 2024,
      order: 1,
    },
  });

  const now = new Date();

  const worksData = [
    {
      slug: "ekaitza",
      title: "Ekaitza",
      subtitle: "La tormenta que nos nombra",
      excerpt: "Cuando el cielo se rompe en mil pedazos y la lluvia cae como memoria, somos la voz que el silencio no pudo callar.",
      content: `Cuando el cielo se rompe en mil pedazos
y la lluvia cae como memoria,
somos la voz que el silencio no pudo callar.

No somos uno. Somos muchos.
La tormenta tiene mil bocas
y cada gota canta tu nombre.

En la calle, en la noche,
donde la luz se apaga y renace,
ahí estamos. Siempre ahí.

Ekaitza. La tormenta.
No es destrucción. Es verdad.`,
      type: "SONG" as const,
      featured: true,
      order: 1,
      tagSlugs: ["tormenta", "resistencia"],
      soundcloudId: "example",
      projectSlug: "ekaitza-ep",
    },
    {
      slug: "relampagos",
      title: "Relámpagos",
      subtitle: "Fragmentos de verdad",
      excerpt: "Un instante de luz en la oscuridad. Eso es todo lo que a veces necesitamos para seguir caminando.",
      type: "SONG" as const,
      featured: true,
      order: 2,
      tagSlugs: ["verdad", "luz"],
      soundcloudId: "example",
      projectSlug: "ekaitza-ep",
    },
    {
      slug: "dignidad",
      title: "Dignidad",
      subtitle: "Lo que no se puede comprar",
      excerpt: "Hay cosas que el dinero no toca. La dignidad es una de ellas.",
      type: "SONG" as const,
      featured: false,
      order: 3,
      tagSlugs: ["dignidad", "resistencia"],
      projectSlug: null,
    },
    {
      slug: "primer-libro",
      title: "Primer libro",
      subtitle: "Antología 2018-2024",
      excerpt: "Una recopilación de letras y poemas escritos a lo largo de seis años.",
      type: "BOOK" as const,
      featured: true,
      order: 4,
      tagSlugs: ["antologia", "libro"],
    },
  ];

  for (const w of worksData) {
    const { tagSlugs, soundcloudId, projectSlug, ...workData } = w;
    const projectId = projectSlug ? (await prisma.project.findUnique({ where: { slug: projectSlug } }))?.id : null;
    const work = await prisma.work.upsert({
      where: { slug: w.slug },
      update: { projectId },
      create: {
        ...workData,
        authorId: author.id,
        publishedAt: now,
        projectId,
      },
    });

    if (soundcloudId) {
      await prisma.song.upsert({
        where: { workId: work.id },
        update: { soundcloudId },
        create: { workId: work.id, soundcloudId },
      });
    }

    if (tagSlugs?.length) {
      await prisma.workTag.deleteMany({ where: { workId: work.id } });
      await prisma.workTag.createMany({
        data: tagSlugs.map((slug) => ({ workId: work.id, tagId: tagMap[slug] })),
      });
    }
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
