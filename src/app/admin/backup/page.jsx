import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-gray-700">
            Bem-vindo! Use os atalhos abaixo para gerenciar o site do Tabanez.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-4">
          <Link
            href="/admin/agenda"
            className="block bg-white rounded-card shadow-card border border-gray-100 p-4 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg mb-1">Agenda</h2>
            <p className="text-sm text-gray-700">
              Adicione, edite e exclua os compromissos do Tabanez.
            </p>
          </Link>

          <div className="block bg-white rounded-card shadow-card border border-gray-100 p-4 opacity-60">
            <h2 className="font-semibold text-lg mb-1">Conteúdo (em breve)</h2>
            <p className="text-sm text-gray-700">
              Em breve: gerenciamento de textos da home, propostas e biografia.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
