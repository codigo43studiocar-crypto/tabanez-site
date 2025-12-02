"use client";

import { useEffect, useState } from "react";

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function NewsClient() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/noticias");
        if (!res.ok) {
          setNews([]);
          return;
        }
        const data = await res.json();
        setNews(Array.isArray(data) ? data : []);
      } catch (e) {
        setNews([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Carregando notícias...</p>;
  }

  if (!loading && news.length === 0) {
    return (
      <p className="text-gray-600">
        Nenhuma notícia carregada no momento.
      </p>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <button
            key={item.link}
            type="button"
            onClick={() => setSelected(item)}
            className="text-left bg-white rounded-card shadow-card border border-gray-200 p-4 hover:shadow-lg hover:border-primary/60 transition"
          >
            <p className="text-xs text-gray-500 mb-1">
              {formatDate(item.date)}
            </p>
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {item.title}
            </h2>
            <p className="text-sm text-gray-700 line-clamp-3">
              {item.description}
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
            >
              Fechar
            </button>

            <p className="text-xs text-gray-500 mb-1">
              {formatDate(selected.date)}
            </p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {selected.title}
            </h2>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {selected.description}
            </p>

            {selected.link && (
              <a
                href={selected.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Ver matéria completa no G1
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}