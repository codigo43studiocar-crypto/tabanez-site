import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-gray-700">
            Bem-vindo! Use os atalhos abaixo para gerenciar o site do Tabanez.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-4">
          {/* Agenda */}
          <Link
            href="/admin/agenda"
            className="block bg-white rounded-card shadow-card border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Agenda</h2>
            <p className="text-sm text-gray-700">
              Adicione, edite e exclua os compromissos do Tabanez.
            </p>
          </Link>

          {/* Conteúdo */}
          <Link
            href="/admin/conteudo"
            className="block bg-white rounded-card shadow-card border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Conteúdo</h2>
            <p className="text-sm text-gray-700">
              Edite textos da home e da biografia.
            </p>
          </Link>

          {/* Propostas */}
          <Link
            href="/admin/propostas"
            className="block bg-white rounded-card shadow-card border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Propostas</h2>
            <p className="text-sm text-gray-700">
              Gerencie as propostas por categoria, prioridade e destaque.
            </p>
          </Link>

          {/* Notícias */}
          <Link
            href="/admin/noticias"
            className="block bg-white rounded-card shadow-card border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Notícias</h2>
            <p className="text-sm text-gray-700">
              Gerencie as notícias publicadas no site.
            </p>
          </Link>

          {/* Imprensa */}
          <Link
            href="/admin/imprensa"
            className="block bg-white rounded-card shadow-card border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <h2 className="font-semibold text-lg mb-1">Imprensa</h2>
            <p className="text-sm text-gray-700">
              Cadastre releases com foto e link para o Instagram.
            </p>
          </Link>
        </section>
      </div>
    </div>
  );
}