async function getNews() {
  const res = await fetch("http://localhost:3000/api/noticias", {
    next: { revalidate: 120 },
  });
  return res.json();
}

export default async function Noticias() {
  const news = await getNews();

  return (
    <section className="section py-10 md:py-14">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">
        Notícias Automáticas
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <article
            key={item.link}
            className="bg-white rounded-card shadow-card border border-gray-100 flex flex-col"
          >
            <div className="p-5 flex-1 flex flex-col">
              <h2 className="font-semibold text-base md:text-lg text-gray-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm text-gray-700 max-h-32 overflow-hidden">
                {item.description.replace(/<[^>]+>/g, "")}
              </p>
              <p className="mt-3 text-xs text-gray-500">{item.date}</p>
              <a
                href={item.link}
                target="_blank"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light transition"
              >
                Ler Completa →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
