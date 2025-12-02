import NewsClient from "./NewsClient";

export const dynamic = "force-dynamic"; // garante que não quebra no Render

export default function NoticiasPage() {
  return (
    <section className="section py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">
        Notícias Automáticas
      </h1>

      {/* Componente cliente que faz o fetch e mostra o modal */}
      <NewsClient />
    </section>
  );
}