import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* CABEÇALHO */}
        <header>
          <h1 className="text-3xl font-bold mb-1">Painel Administrativo</h1>
          <p className="text-gray-300 text-sm md:text-base">
            Bem-vindo(a)! Use os atalhos abaixo para gerenciar o site do Tabanez.
          </p>
        </header>

        {/* GRID DE ATALHOS */}
        <section className="grid md:grid-cols-2 gap-4">
          {/* AGENDA */}
          <Link
            href="/admin/agenda"
            className="block bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-5 hover:shadow-md hover:-translate-y-[1px] transition"
          >
            <h2 className="font-semibold text-lg mb-1">Agenda</h2>
            <p className="text-sm text-neutral-700">
              Adicione, edite e exclua os compromissos do Tabanez.
            </p>
          </Link>

          {/* PROPOSTAS */}
          <Link
            href="/admin/propostas"
            className="block bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-5 hover:shadow-md hover:-translate-y-[1px] transition"
          >
            <h2 className="font-semibold text-lg mb-1">Propostas</h2>
            <p className="text-sm text-neutral-700">
              Gerencie as propostas em destaque que aparecem no site.
            </p>
          </Link>

          {/* IMPRENSA */}
          <Link
            href="/admin/imprensa"
            className="block bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-5 hover:shadow-md hover:-translate-y-[1px] transition"
          >
            <h2 className="font-semibold text-lg mb-1">Imprensa</h2>
            <p className="text-sm text-neutral-700">
              Cadastre releases oficiais, matérias e comunicados.
            </p>
          </Link>

          {/* GALERIA */}
          <Link
            href="/admin/galeria"
            className="block bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-5 hover:shadow-md hover:-translate-y-[1px] transition"
          >
            <h2 className="font-semibold text-lg mb-1">Galeria</h2>
            <p className="text-sm text-neutral-700">
              Gerencie fotos e vídeos que aparecem na galeria do site.
            </p>
          </Link>

          {/* CONTEÚDO FIXO */}
          <Link
            href="/admin/conteudo"
            className="block bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-5 hover:shadow-md hover:-translate-y-[1px] transition"
          >
            <h2 className="font-semibold text-lg mb-1">Textos do site</h2>
            <p className="text-sm text-neutral-700">
              Edite os textos principais da home e da biografia.
            </p>
          </Link>

          {/* BACKUP / APOIO (OPCIONAL) */}
          <Link
            href="/admin/backup"
            className="block bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-5 hover:shadow-md hover:-translate-y-[1px] transition"
          >
            <h2 className="font-semibold text-lg mb-1">Backup / Consultas</h2>
            <p className="text-sm text-neutral-700">
              Área de apoio para consultas ou funções internas (se você estiver usando).
            </p>
          </Link>
        </section>
      </div>
    </div>
  );
}