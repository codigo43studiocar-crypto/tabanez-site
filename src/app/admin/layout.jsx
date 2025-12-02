export const metadata = {
  title: "Painel Administrativo – Tabanez",
  description: "Área restrita para gerenciamento do site do Tabanez.",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      {/* TOPO DO PAINEL */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent-yellow">
              Área administrativa
            </p>
            <p className="text-xs text-gray-300">
              Acesso exclusivo da equipe do Tabanez.
            </p>
          </div>

          <a
            href="/admin/logout"
            className="text-xs md:text-sm px-3 py-1.5 rounded-md border border-white/30 text-white hover:bg-white/10 transition"
          >
            Sair do painel
          </a>
        </div>
      </header>

      {/* CONTEÚDO DAS PÁGINAS DO ADMIN */}
      <main className="pt-6 pb-10">
        {children}
      </main>
    </div>
  );
}