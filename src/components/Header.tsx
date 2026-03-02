"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/obras", label: "Obras" },
  { href: "/sobre-mi", label: "Sobre mí" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 sm:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-sm tracking-[0.15em] text-white-broken hover:text-white-muted transition-colors duration-300"
        >
          <Image
            src="/ico/logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-auto opacity-90 rounded-md"
          />
          <span className="hidden sm:inline">Ekaitzaren Bertsolariak</span>
        </Link>

        <ul className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                  pathname === item.href
                    ? "text-white-broken"
                    : "text-grey-muted hover:text-white-muted"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-grey-muted hover:text-white-muted transition-colors"
          aria-label="Menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border animate-fade-in">
          <ul className="px-6 py-6 space-y-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-xs tracking-[0.2em] uppercase ${
                    pathname === item.href ? "text-white-broken" : "text-grey-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
