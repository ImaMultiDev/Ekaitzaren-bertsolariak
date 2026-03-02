import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getProjectSlugs } from "@/lib/works";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);

  if (!result) {
    notFound();
  }

  const { project, works } = result;

  return (
    <div className="min-h-screen">
      <header className="py-24 px-6 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/proyectos"
            className="text-xs tracking-[0.2em] uppercase text-grey-muted hover:text-white-muted transition-colors duration-300"
          >
            ← Volver a proyectos
          </Link>
          <p className="mt-8 text-grey-muted text-xs tracking-wider uppercase">
            {project.year ? `${project.year}` : "Proyecto"}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-white-broken mt-4">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-white-muted text-lg mt-6 max-w-xl">{project.description}</p>
          )}
        </div>
      </header>

      <section className="py-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-grey-muted text-xs tracking-[0.2em] uppercase mb-12">
            Canciones ({works.length})
          </p>

          {works.length === 0 ? (
            <p className="text-grey-muted text-sm">No hay canciones publicadas.</p>
          ) : (
            <div className="space-y-16">
              {works.map((work) => (
                <Link
                  key={work.id}
                  href={`/obras/${work.slug}`}
                  className="block group"
                >
                  <p className="text-white-broken font-display text-xl group-hover:text-white-muted transition-colors duration-300">
                    {work.title}
                  </p>
                  {work.subtitle && (
                    <p className="text-grey-muted text-sm mt-1 italic">{work.subtitle}</p>
                  )}
                  {work.excerpt && (
                    <p className="text-white-muted text-sm mt-4 line-clamp-2 max-w-xl">
                      {work.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
