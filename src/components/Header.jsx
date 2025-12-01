"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/", label: "Início" },
  { href: "/biografia", label: "Biografia" },
  { href: "/propostas", label: "Propostas" },
  { href: "/agenda", label: "Agenda" },
  { href: "/noticias", label: "Notícias" },
  { href: "/imprensa", label: "Imprensa" },
  { href: "/fale-comigo", label: "Fale comigo" },
];

export default function Header() {
  const pathname = usePathname();
  const ativo = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) && href !== "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-neutral-dark text-white shadow-md">
      <div className="section flex items-center justify-between h-16 md:h-18 gap-4">
        {/* LOGO / NOME */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-[0.3em] text-accent-yellow">
              Tabanez Pelo Distrito Federal
            </span>
            <span className="text-xs text-gray-300">
              Presença constante nas ruas ao lado da população.
            </span>
          </Link>
        </div>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 text-xs">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition hover:text-accent-yellow ${
                ativo(item.href)
                  ? "font-semibold text-accent-yellow"
                  : "text-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* REDES SOCIAIS NO TOPO */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="https://instagram.com/tabanezdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            aria-label="Instagram"
          >
            <span className="text-base">📸</span>
          </a>
          <a
            href="https://facebook.com/tabanezdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            aria-label="Facebook"
          >
            <span className="text-base">📘</span>
          </a>
          <a
            href="https://youtube.com/tabanezdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            aria-label="YouTube"
          >
            <span className="text-base">▶️</span>
          </a>
        </div>

        {/* MENU MOBILE SIMPLES */}
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer select-none flex items-center justify-center w-9 h-9 rounded-md bg-white/10 hover:bg-white/20">
            ☰
          </summary>
          <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-sm ${
                  ativo(item.href)
                    ? "text-accent-yellow font-semibold"
                    : "text-gray-100 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-neutral-700 mt-1 pt-2 px-4 flex items-center gap-2">
              <a
                href="https://instagram.com/tabanezdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                aria-label="Instagram"
              >
                <span className="text-sm">📸</span>
              </a>
              <a
                href="https://facebook.com/tabanezdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                aria-label="Facebook"
              >
                <span className="text-sm">📘</span>
              </a>
              <a
                href="https://youtube.com/tabanezdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                aria-label="YouTube"
              >
                <span className="text-sm">▶️</span>
              </a>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
