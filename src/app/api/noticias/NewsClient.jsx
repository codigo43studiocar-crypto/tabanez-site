"use client";

import { useState } from "react";

export default function NewsClient({ news }) {
  const [selected, setSelected] = useState(null);

  if (!news || news.length === 0) {
    return (
      <section className="section py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Notícias Automáticas
        </h1>
        <p className="text-sm text-gray-600">
          Nenhuma notícia carregada no momento.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="section py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Notícias Automáticas
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, idx) => (
            <article
              key={item.id || idx}
              className="bg-white rounded-card shadow-card border border-gray-100 p-4 flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-lg transition"
              onClick={() => setSelected(item)}
            >
              {item.date && (
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-dark mb-1">
                  {item.date}
                </p>
              )}

              <h2 className="text-base font-semibold text-gray-900 mb-2 line-clamp-3">
                {item.title}
              </h2>

              <p className="text-sm text-gray-700 line-clamp-5">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
            >
              ×
            </button>

            {selected.date && (
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-dark mb-1">
                {selected.date}
              </p>
            )}

            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {selected.title}
            </h2>

            <p className="text-sm text-gray-800 whitespace-pre-line">
              {selected.description}
            </p>

            {selected.link && (
              <div className="mt-4 flex justify-end">
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-accent-yellow px-4 py-2 text-xs font-semibold text-neutral-dark hover:bg-yellow-300 transition"
                >
                  Ver matéria completa no G1
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}