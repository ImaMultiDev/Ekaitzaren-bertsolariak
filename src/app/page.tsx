import Link from "next/link";
import { getWorks } from "@/lib/works";

export default async function HomePage() {
  const featuredWorks = await getWorks({ featured: true });

  return (
    <div>
      {/* Hero - Manifiesto poético */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Efecto sutil de tormenta - overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, var(--red) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.15em] text-white mb-6 animate-fade-in-up opacity-0">
            EKAITZA
          </h1>
          <p className="font-display text-2xl sm:text-3xl tracking-[0.3em] text-red mb-8 animate-fade-in-up opacity-0 stagger-1">
            BERTSOLARIAK
          </p>

          <div className="max-w-2xl mx-auto mt-12 animate-fade-in-up opacity-0 stagger-2">
            <p className="font-heading text-xl sm:text-2xl text-white-broken leading-relaxed italic">
              La tormenta no calla. La tormenta canta.
            </p>
            <p className="font-body text-stone mt-6 text-lg">
              Cuando el cielo se parte en dos y la lluvia cae como memoria,
              somos la voz que el silencio nunca pudo apagar. Poesía y música.
              Palabra y fuego.
            </p>
          </div>

          <Link
            href="/obras"
            className="inline-block mt-16 px-8 py-4 border-2 border-red text-red font-display text-sm tracking-[0.2em] uppercase hover:bg-red hover:text-white transition-all duration-300 animate-fade-in-up opacity-0 stagger-3"
          >
            Descubrir obras
          </Link>
        </div>
      </section>

      {/* Obras destacadas */}
      <section className="border-t border-border py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16">
            <div className="line-accent mb-4" />
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white">
              Obras destacadas
            </h2>
            <p className="mt-4 text-stone max-w-xl">
              Fragmentos de la tormenta. Letras, canciones y poemas que nacen
              de la calle y vuelven a ella.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {featuredWorks.map((work, index) => (
              <article
                key={work.id}
                className="group border border-border p-6 hover:border-red/30 transition-colors duration-300 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <span className="text-xs tracking-widest uppercase text-red">
                  {work.type === "SONG" ? "Canción" : work.type === "BOOK" ? "Libro" : "Poema"}
                </span>
                <h3 className="font-heading text-2xl font-semibold text-white mt-2 group-hover:text-red transition-colors">
                  {work.title}
                </h3>
                {work.subtitle && (
                  <p className="text-stone text-sm mt-1 italic">{work.subtitle}</p>
                )}
                <p className="text-white-broken mt-4 line-clamp-3">{work.excerpt}</p>
                <Link
                  href={`/obras/${work.slug}`}
                  className="inline-block mt-6 text-sm tracking-widest uppercase text-red hover:underline"
                >
                  Leer más →
                </Link>
              </article>
            ))}
          </div>

          {featuredWorks.length === 0 && (
            <p className="text-stone text-center py-12">
              No hay obras destacadas aún.
            </p>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/obras"
              className="text-stone hover:text-white transition-colors text-sm tracking-widest uppercase"
            >
              Ver todas las obras
            </Link>
          </div>
        </div>
      </section>

      {/* Cierre poético */}
      <section className="border-t border-border py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-2xl sm:text-3xl text-white-broken italic leading-relaxed">
            La palabra escrita y la música como pilares iguales.
            <br />
            <span className="text-red">Pocas páginas. Alto impacto.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
