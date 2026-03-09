import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch {
    // JWT decryption failed (e.g. NEXTAUTH_SECRET changed or invalid) → treat as no session
    session = null;
  }
  return (
    <div className="min-h-screen bg-charcoal">
      {session ? (
        <div className="flex">
          <aside className="w-56 border-r border-border min-h-screen py-8 px-4">
            <Link href="/admin" className="font-display text-sm text-white-broken block mb-8">
              Admin
            </Link>
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="block text-xs uppercase tracking-wider text-grey-muted hover:text-white-muted py-2"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/proyectos"
                className="block text-xs uppercase tracking-wider text-grey-muted hover:text-white-muted py-2"
              >
                Proyectos
              </Link>
              <Link
                href="/admin/albumes"
                className="block text-xs uppercase tracking-wider text-grey-muted hover:text-white-muted py-2"
              >
                Álbumes
              </Link>
              <Link
                href="/admin/obras"
                className="block text-xs uppercase tracking-wider text-grey-muted hover:text-white-muted py-2"
              >
                Obras
              </Link>
              <Link
                href="/"
                className="block text-xs uppercase tracking-wider text-grey-muted hover:text-white-muted py-2 mt-8"
              >
                ← Ver web
              </Link>
            </nav>
          </aside>
          <main className="flex-1 py-12 px-8">{children}</main>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
