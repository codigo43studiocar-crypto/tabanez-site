// src/app/admin/page.jsx
"use client";

import Link from "next/link";

const CARDS = [
  {
    title: "Agenda",
    desc: "Gerencie os compromissos oficiais, reuniões e visitas.",
    href: "/admin/agenda",
    status: "ATIVO",
  },
  {
    title: "Propostas",
    desc: "Cadastre, edite e organize as propostas por tema e prioridade.",
    href: "/admin/propostas",
    status: "ATIVO",
  },
  {
    title: "Imprensa",
    desc: "Cadastre releases, marque destaques, filtre por ano e acompanhe visualizações.",
    href: "/admin/imprensa",
    status: "ATIVO",
  },
  {
    title: "Galeria",
    desc: "Envie fotos, organize por álbuns e destaque ações importantes.",
    href: "/admin/galeria",
    status: "ATIVO",
  },
  {
    title: "Conteúdo do site",
    desc: "Ajuste textos da home, biografia e seções fixas sem precisar de código.",
    href: "/admin/conteudo",
    status: "ATIVO",
  },
  {
    title: "Configurações",
    desc: "Ajustes avançados (em breve): usuários, permissões e integrações.",
    href: "#",
    status: "EM BREVE",
  },
];

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
          Painel ▸ Início
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-50">
          Início do painel administrativo
        </h1>
        <p className="text-sm text-neutral-300 max-w-2xl">
          Use os atalhos abaixo para atualizar o site sem depender de código.
          Agenda, propostas, imprensa, galeria e textos principais estão
          centralizados aqui.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-950 p-4 md:p-5 flex flex-col justify-between shadow-lg shadow-black/40"
          >
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                {card.title}
              </p>
              <p className="text-sm md:text-base text-neutral-100 font-medium">
                {card.desc}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span
                className={[
                  "px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide",
                  card.status === "ATIVO"
                    ? "bg-amber-300/90 text-neutral-900"
                    : "bg-neutral-700 text-neutral-100",
                ].join(" ")}
              >
                {card.status}
              </span>

              {card.href !== "#" && (
                <Link
                  href={card.href}
                  className="px-4 py-1.5 rounded-full text-xs bg-emerald-500 text-white font-semibold hover:bg-emerald-400 shadow-md shadow-emerald-500/40"
                >
                  Acessar
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}