import Link from "next/link";

export const metadata = {
  title: "Painel Administrativo - Tabanez",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100">
      {/* TOPO DO PAINEL */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent-yellow">
              Painel Administrativo
            </p>
            <p className="text-sm text-gray-300">
              Gestão do site Tabanez — agenda, propostas, imprensa e galeria.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs md:text-sm text-gray-300 hover:text-white underline"
            >
              Ver site público
            </Link>

            <Link
              href="/admin/logout"
              className="text-xs md:text-sm rounded-full border border-red-500/70 px-3 py-1.5 text-red-200 hover:bg-red-500/10 transition"
            >
              Sair
            </Link>
          </div>
        </div>
      </header>

      {/* CONTEÚDO DAS PÁGINAS /ADMIN */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {children}
      </main>
    </div>
  );
}