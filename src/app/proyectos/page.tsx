import Link from "next/link";
import { getProjects } from "@/lib/works";

export default async function ProyectosPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <p className="text-grey-muted text-xs tracking-[0.2em] uppercase mb-4">
            Proyectos
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-white-broken">
            Álbumes y recopilaciones
          </h1>
          <p className="mt-6 text-white-muted max-w-xl">
            Las canciones pueden vivir sueltas o formar parte de un proyecto.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          {projects.length === 0 ? (
            <p className="text-grey-muted text-sm py-24">
              No hay proyectos aún. Las canciones aparecen en Obras.
            </p>
          ) : (
            <div className="space-y-20">
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
                    {project.worksCount !== undefined && ` · ${project.worksCount} canciones`}
                  </p>
                  {project.description && (
                    <p className="text-white-muted text-sm mt-4 line-clamp-2 max-w-xl">
                      {project.description}
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
