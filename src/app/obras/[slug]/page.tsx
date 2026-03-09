import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getWorkBySlug, getWorkSlugs } from "@/lib/works";
import AudioPlayer from "@/components/AudioPlayer";

export const dynamic = "force-dynamic";

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

  const typeLabel = work.type === "SONG" ? "Canción" : "Libro";

  return (
    <article className="min-h-screen">
      {/* Cabecera editorial */}
      <header className={`pt-20 px-6 sm:px-12 lg:px-24 ${work.type === "SONG" && work.soundcloudId ? "pb-8" : "pb-20"}`}>
        <div className="max-w-2xl mx-auto">
          <Link
            href="/obras"
            className="text-xs tracking-[0.2em] uppercase text-grey-muted hover:text-white-muted transition-colors duration-300"
          >
            ← Volver a obras
          </Link>
          <p className="mt-8 text-grey-muted text-xs tracking-wider uppercase">
            {typeLabel}
            {work.project &&
              (work.project.proyecto
                ? ` · ${work.project.proyecto.name} · ${work.project.name}`
                : ` · ${work.project.name}`)}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-white-broken mt-4 leading-tight">
            {work.title}
          </h1>
          {work.subtitle && (
            <p className="text-grey-muted text-lg mt-4 italic">{work.subtitle}</p>
          )}
          {work.type === "SONG" && work.soundcloudId && (
            <div className="mt-8">
              <AudioPlayer cloudflareId={work.soundcloudId} />
            </div>
          )}
        </div>
      </header>

      {/* Contenido - tratamiento editorial extremo */}
      <div className={`px-6 sm:px-12 lg:px-24 ${work.type === "SONG" && work.soundcloudId ? "pt-8 pb-16" : "py-16"}`}>
        <div className="max-w-2xl mx-auto">
          {/* Libro: enlace externo (Canva u otra URL) */}
          {work.type === "BOOK" && work.embedUrl && work.embedUrl.length > 0 ? (
            <div className="poem-line font-body text-xl leading-[2.2] text-white-broken">
              {work.excerpt && <p className="mb-8">{work.excerpt}</p>}
              <a
                href={work.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-white-broken text-sm tracking-[0.2em] uppercase border-b border-white-broken/30 pb-1 hover:border-white-broken/60 transition-colors duration-300"
              >
                Abrir libro →
              </a>
            </div>
          ) : work.content ? (
            <div className="poem-line font-body text-xl leading-[2.2] text-white-broken">
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: work.content.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          ) : (
            <div className="poem-line font-body text-xl leading-[2.2] text-white-broken">
              <p className="mb-8">{work.excerpt}</p>
              <p className="italic text-grey-muted text-sm">
                [Contenido completo próximamente]
              </p>
            </div>
          )}

          {/* Imágenes */}
          {work.images && work.images.length > 0 && (
            <div className="mt-24 space-y-12">
              {work.images.map((img, i) => (
                <figure key={i} className="space-y-2">
                  <Image
                    src={img.url}
                    alt={img.alt || ""}
                    width={800}
                    height={600}
                    className="w-full object-cover opacity-90"
                  />
                  {img.caption && (
                    <figcaption className="text-sm text-grey-muted italic">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {/* Etiquetas - discretas */}
          {work.tags && work.tags.length > 0 && (
            <div className="mt-24 pt-12 border-t border-border">
              <p className="text-grey-muted text-xs tracking-wider uppercase mb-4">
                Temáticas
              </p>
              <div className="flex flex-wrap gap-4">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-white-muted"
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
