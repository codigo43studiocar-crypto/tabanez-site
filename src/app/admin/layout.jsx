// src/app/admin/layout.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/propostas", label: "Propostas" },
  { href: "/admin/imprensa", label: "Imprensa" },
  { href: "/admin/galeria", label: "Galeria" },
  { href: "/admin/conteudo", label: "Conteúdo" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* FAIXA SUPERIOR (igual tema antigo) */}
      <header className="border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <p className="text-[10px] tracking-[0.35em] uppercase text-amber-300">
            Painel Administrativo
          </p>
          <p className="text-xs text-neutral-400">
            Gestão de agenda, propostas, imprensa, galeria e conteúdos.
          </p>

          {/* MENU DE ABAS DO PAINEL */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "px-4 py-1.5 rounded-full text-xs md:text-sm border transition",
                    active
                      ? "bg-amber-400 text-neutral-900 border-amber-300 shadow-lg shadow-amber-500/30"
                      : "bg-neutral-900 text-neutral-100 border-neutral-700 hover:bg-neutral-800",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/admin/logout"
              className="ml-auto px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-red-600 text-white border border-red-500 hover:bg-red-500"
            >
              Sair
            </Link>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4">{children}</div>
      </main>
    </div>
  );
}