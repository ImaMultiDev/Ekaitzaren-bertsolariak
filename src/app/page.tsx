import Link from "next/link";
import Image from "next/image";
import { getWorks, getProjects } from "@/lib/works";

export default async function HomePage() {
  const [featuredWorks, projects] = await Promise.all([
    getWorks({ featured: true }),
    getProjects(),
  ]);

  return (
    <div>
      {/* Hero - editorial, silencioso, composición compacta */}
      <section className="min-h-[85vh] flex flex-col justify-center px-6 sm:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto w-full flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-12">
          <div className="max-w-xl flex-shrink-0">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal text-white-broken leading-tight tracking-tight">
              Ekaitzaren
              <br />
              Bertsolariak
            </h1>
            <p className="mt-16 text-white-muted text-lg leading-relaxed max-w-md">
              Letras y música. La palabra como centro.
            </p>
            <p className="mt-6 text-white-muted text-lg leading-relaxed max-w-md">
              Este espacio reúne mis canciones, letras y otros formatos de escritura.
              Obras nacidas de la tormenta: cuando callar no es una opción
              y la palabra se convierte en compromiso compartido.
            </p>
            <Link
              href="/obras"
              className="inline-block mt-12 text-white-broken text-sm tracking-widest uppercase border-b border-white-broken/30 pb-1 hover:border-white-broken/60 transition-colors duration-300"
            >
              ENTRAR
            </Link>
          </div>
          <div className="flex items-center justify-center lg:justify-center flex-shrink-0 lg:flex-1">
            <div className="hero-image-editorial">
              <Image
                src="/ico/ekaitzarenPlumaOrg.png"
                alt=""
                width={280}
                height={392}
                className="w-48 sm:w-56 lg:w-72 xl:w-100 h-auto opacity-80"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Proyectos */}
      {projects.length > 0 && (
        <section className="py-24 px-6 sm:px-12 lg:px-24 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <p className="text-grey-muted text-xs tracking-[0.2em] uppercase mb-12">
              Proyectos
            </p>
            <div className="space-y-16">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/proyectos/${project.slug}`}
                  className="block group"
                >
                  <p className="text-white-broken font-display text-xl group-hover:text-white-muted transition-colors duration-300">
                    {project.name}
                  </p>
                  <p className="text-grey-muted text-sm mt-1">
                    {project.year ? `${project.year}` : ""}
                    {project.worksCount !== undefined &&
                      ` · ${project.worksCount} canciones`}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Obras destacadas - índice de libro */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-grey-muted text-xs tracking-[0.2em] uppercase mb-12">
            Obras destacadas
          </p>
          <div className="space-y-16">
            {featuredWorks.map((work) => (
              <Link
                key={work.id}
                href={`/obras/${work.slug}`}
                className="block group"
              >
                <p className="text-grey-muted text-xs tracking-wider uppercase">
                  {work.type === "SONG" ? "Canción" : "Libro"}
                  {work.project && ` · ${work.project.name}`}
                </p>
                <p className="text-white-broken font-display text-xl mt-2 group-hover:text-white-muted transition-colors duration-300">
                  {work.title}
                </p>
                {work.subtitle && (
                  <p className="text-grey-muted text-sm mt-1 italic">
                    {work.subtitle}
                  </p>
                )}
                {work.excerpt && (
                  <p className="text-white-muted text-sm mt-4 line-clamp-2 max-w-xl">
                    {work.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {featuredWorks.length === 0 && (
            <p className="text-grey-muted text-sm py-16">
              No hay obras destacadas aún.
            </p>
          )}

          <Link
            href="/obras"
            className="inline-block mt-20 text-white-broken text-sm tracking-widest uppercase border-b border-white-broken/30 pb-1 hover:border-white-broken/60 transition-colors duration-300"
          >
            Ver todas las obras
          </Link>
        </div>
      </section>

      {/* Cierre */}
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white-muted text-lg italic">
            La palabra por encima de todo.
          </p>
        </div>
      </section>
    </div>
  );
}
