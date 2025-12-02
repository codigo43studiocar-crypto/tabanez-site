import Link from "next/link";

export const metadata = {
  title: "Painel Administrativo – Tabanez",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* BARRA SUPERIOR */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-slate-100">
              Painel Administrativo
            </h1>
            <p className="text-xs text-slate-400">
              Gestão de agenda, propostas, notícias e conteúdos.
            </p>
          </div>

          {/* MENU RÁPIDO */}
          <nav className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/agenda"
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              Agenda
            </Link>
            <Link
              href="/admin/propostas"
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              Propostas
            </Link>
            <Link
              href="/admin/imprensa"
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              Imprensa
            </Link>
            <Link
              href="/admin/galeria"
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              Galeria
            </Link>
            <Link
              href="/admin/conteudo"
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              Conteúdo
            </Link>

            {/* Logout sempre no canto */}
            <Link
              href="/admin/logout"
              className="px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition"
            >
              Sair
            </Link>
          </nav>
        </div>
      </header>

      {/* CONTEÚDO DAS PÁGINAS DO ADMIN */}
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}