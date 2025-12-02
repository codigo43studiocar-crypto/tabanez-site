import Link from "next/link";

export const metadata = {
  title: "Painel Administrativo - Tabanez",
};

const cards = [
  {
    titulo: "Agenda",
    descricao: "Gerencie os compromissos oficiais, reuniões e visitas.",
    href: "/admin/agenda",
    badge: "Ativo",
  },
  {
    titulo: "Propostas",
    descricao: "Cadastre, edite e organize as propostas por tema e prioridade.",
    href: "/admin/propostas",
    badge: "Ativo",
  },
  {
    titulo: "Imprensa",
    descricao:
      "Cadastre releases, marque destaques, filtre por ano e acompanhe visualizações.",
    href: "/admin/imprensa",
    badge: "Ativo",
  },
  {
    titulo: "Galeria",
    descricao:
      "Envie fotos, organize por álbuns e destaque ações importantes.",
    href: "/admin/galeria",
    badge: "Ativo",
  },
  {
    titulo: "Conteúdo do site",
    descricao:
      "Ajuste textos da home, biografia e seções fixas sem precisar de código.",
    href: "/admin/conteudo",
    badge: "Ativo",
  },
  {
    titulo: "Configurações",
    descricao:
      "Ajustes avançados (em breve): usuários, permissões e integrações.",
    href: "#",
    badge: "Em breve",
    disabled: true,
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100">
      {/* topo simples do painel */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent-yellow">
              Painel Administrativo
            </p>
            <h1 className="text-xl md:text-2xl font-bold mt-1">
              Tabanez Pelo Distrito Federal
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs md:text-sm text-gray-300 hover:text-white underline"
          >
            Ver site público
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* resumo / intro */}
        <section className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 md:p-5">
          <h2 className="text-lg font-semibold mb-1">
            Bem-vindo ao painel do Tabanez
          </h2>
          <p className="text-sm text-gray-300">
            Use os atalhos abaixo para atualizar o site sem depender de código.
            Agenda, propostas, imprensa, galeria e textos principais estão
            centralizados aqui.
          </p>
        </section>

        {/* grid de cards */}
        <section className="grid md:grid-cols-2 gap-4 md:gap-5">
          {cards.map((card) => {
            const content = (
              <div
                className={[
                  "w-full h-full rounded-xl border p-4 md:p-5 flex flex-col justify-between transition",
                  card.disabled
                    ? "border-neutral-800 bg-neutral-900/60 cursor-not-allowed opacity-60"
                    : "border-neutral-700 bg-neutral-900/80 hover:border-accent-yellow hover:-translate-y-0.5 hover:shadow-lg cursor-pointer",
                ].join(" ")}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-base md:text-lg font-semibold">
                      {card.titulo}
                    </h3>
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        card.disabled
                          ? "bg-neutral-700 text-gray-300"
                          : "bg-accent-yellow text-neutral-900",
                      ].join(" ")}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{card.descricao}</p>
                </div>

                {!card.disabled && (
                  <div className="mt-4 flex justify-end">
                    <span className="text-xs font-semibold text-accent-yellow">
                      Acessar
                    </span>
                  </div>
                )}
              </div>
            );

            if (card.disabled || !card.href || card.href === "#") {
              return (
                <div key={card.titulo} className="h-full">
                  {content}
                </div>
              );
            }

            return (
              <Link key={card.titulo} href={card.href} className="h-full">
                {content}
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
