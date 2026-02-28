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
      where: { slug: "poesia" },
      update: {},
      create: { name: "poesía", slug: "poesia" },
    }),
    prisma.tag.upsert({
      where: { slug: "urbano" },
      update: {},
      create: { name: "urbano", slug: "urbano" },
    }),
    prisma.tag.upsert({
      where: { slug: "verdad" },
      update: {},
      create: { name: "verdad", slug: "verdad" },
    }),
    prisma.tag.upsert({
      where: { slug: "luz" },
      update: {},
      create: { name: "luz", slug: "luz" },
    }),
    prisma.tag.upsert({
      where: { slug: "dignidad" },
      update: {},
      create: { name: "dignidad", slug: "dignidad" },
    }),
    prisma.tag.upsert({
      where: { slug: "antologia" },
      update: {},
      create: { name: "antología", slug: "antologia" },
    }),
    prisma.tag.upsert({
      where: { slug: "libro" },
      update: {},
      create: { name: "libro", slug: "libro" },
    }),
  ]);

  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t.id]));
  const now = new Date();

  const worksData = [
    {
      slug: "ekaitza",
      title: "Ekaitza",
      subtitle: "La tormenta que nos nombra",
      excerpt:
        "Cuando el cielo se rompe en mil pedazos y la lluvia cae como memoria, somos la voz que el silencio no pudo callar.",
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
    },
    {
      slug: "tinta-y-lluvia",
      title: "Tinta y lluvia",
      subtitle: "Poemas de la calle",
      excerpt:
        "Las palabras que escribimos bajo la lluvia son las que más tarde recordamos. Porque la tinta se mezcla con el agua y algo nuevo nace.",
      type: "POEM" as const,
      featured: true,
      order: 2,
      tagSlugs: ["poesia", "urbano"],
    },
    {
      slug: "relampagos",
      title: "Relámpagos",
      subtitle: "Fragmentos de verdad",
      excerpt:
        "Un instante de luz en la oscuridad. Eso es todo lo que a veces necesitamos para seguir caminando.",
      type: "SONG" as const,
      featured: true,
      order: 3,
      tagSlugs: ["verdad", "luz"],
      soundcloudId: "example",
    },
    {
      slug: "dignidad",
      title: "Dignidad",
      subtitle: "Lo que no se puede comprar",
      excerpt: "Hay cosas que el dinero no toca. La dignidad es una de ellas.",
      type: "SONG" as const,
      featured: false,
      order: 4,
      tagSlugs: ["dignidad", "resistencia"],
    },
    {
      slug: "primer-libro",
      title: "Primer libro",
      subtitle: "Antología 2018-2024",
      excerpt:
        "Una recopilación de letras y poemas escritos a lo largo de seis años.",
      type: "BOOK" as const,
      featured: false,
      order: 5,
      tagSlugs: ["antologia", "libro"],
    },
  ];

  for (const w of worksData) {
    const { tagSlugs, soundcloudId, ...workData } = w;
    const work = await prisma.work.upsert({
      where: { slug: w.slug },
      update: {},
      create: {
        ...workData,
        authorId: author.id,
        publishedAt: now,
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
        data: tagSlugs.map((slug) => ({
          workId: work.id,
          tagId: tagMap[slug],
        })),
      });
    }
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
