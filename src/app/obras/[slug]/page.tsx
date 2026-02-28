import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getWorkBySlug, getWorkSlugs } from "@/lib/works";
import SoundCloudEmbed from "@/components/SoundCloudEmbed";

export async function generateStaticParams() {
  const slugs = await getWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const typeLabel =
    work.type === "SONG"
      ? "Canción"
      : work.type === "BOOK"
        ? "Libro"
        : work.type === "POEM"
          ? "Poema"
          : "Obra";

  return (
    <article className="min-h-screen">
      {/* Cabecera */}
      <header className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/obras"
            className="text-sm tracking-widest uppercase text-stone hover:text-white transition-colors"
          >
            ← Volver a obras
          </Link>
          <span className="block mt-4 text-xs tracking-widest uppercase text-red">
            {typeLabel}
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-semibold text-white mt-2">
            {work.title}
          </h1>
          {work.subtitle && (
            <p className="text-stone text-xl mt-2 italic">{work.subtitle}</p>
          )}
        </div>
      </header>

      {/* Contenido - maquetación centrada en lectura */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Reproductor SoundCloud (si aplica) */}
          {work.type === "SONG" && work.soundcloudId && (
            <div className="mb-12">
              <SoundCloudEmbed trackId={work.soundcloudId} />
            </div>
          )}

          {/* Letra como poema */}
          {work.content ? (
            <div className="poem-line font-body text-lg leading-relaxed">
              <div
                className="whitespace-pre-wrap text-white-broken"
                dangerouslySetInnerHTML={{
                  __html: work.content.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          ) : (
            <div className="poem-line font-body text-lg leading-relaxed text-white-broken">
              <p className="mb-6">{work.excerpt}</p>
              <p className="italic text-stone">
                [Contenido completo próximamente]
              </p>
            </div>
          )}

          {/* Imágenes (cuando haya Cloudinary) */}
          {work.images && work.images.length > 0 && (
            <div className="mt-16 space-y-8">
              {work.images.map((img, i) => (
                <figure key={i} className="space-y-2">
                  <Image
                    src={img.url}
                    alt={img.alt || ""}
                    width={800}
                    height={600}
                    className="w-full object-cover"
                  />
                  {img.caption && (
                    <figcaption className="text-sm text-stone italic">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {/* Etiquetas */}
          {work.tags && work.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border">
              <p className="text-xs tracking-widest uppercase text-stone mb-2">
                Temáticas
              </p>
              <div className="flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm border border-border text-stone"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
