import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [proyectosCount, albumsCount, worksCount] = await Promise.all([
    prisma.proyecto.count(),
    prisma.project.count(),
    prisma.work.count(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-white-broken mb-8">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        <Link
          href="/admin/proyectos"
          className="block p-6 border border-border hover:border-white-broken/30 transition-colors"
        >
          <p className="text-3xl font-display text-white-broken">{proyectosCount}</p>
          <p className="text-sm text-grey-muted mt-1">Proyectos</p>
        </Link>
        <Link
          href="/admin/albumes"
          className="block p-6 border border-border hover:border-white-broken/30 transition-colors"
        >
          <p className="text-3xl font-display text-white-broken">{albumsCount}</p>
          <p className="text-sm text-grey-muted mt-1">Álbumes</p>
        </Link>
        <Link
          href="/admin/obras"
          className="block p-6 border border-border hover:border-white-broken/30 transition-colors"
        >
          <p className="text-3xl font-display text-white-broken">{worksCount}</p>
          <p className="text-sm text-grey-muted mt-1">Obras</p>
        </Link>
      </div>
    </div>
  );
}
