export const dynamic = "force-dynamic";

async function getNews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/noticias`, {
      cache: "no-store"
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (e) {
    return [];
  }
}

export default async function Noticias() {
  const news = await getNews();

  return (
    <section className="section py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">
        Notícias Automáticas
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length === 0 && (
          <p className="text-gray-500">Nenhuma notícia disponível no momento.</p>
        )}

        {news.map((item) => (
          <article key={item.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{item.titulo}</h2>
            <p className="text-gray-700">{item.resumo}</p>
          </article>
        ))}
      </div>
    </section>
  );
}