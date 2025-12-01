"use client";

import { useEffect, useState } from "react";

const CATEGORIAS_CLIPPING = [
  "Todos",
  "Ação social",
  "Reunião",
  "Fiscalização",
  "Evento",
];

function formatarData(iso) {
  if (!iso) return "";
  try {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
  } catch {
    return iso;
  }
}

function exportarPDF(release) {
  if (typeof window === "undefined" || !release) return;

  const win = window.open("", "_blank");
  if (!win) return;

  const conteudoHtml = (release.conteudo || "").replace(/\n/g, "<br>");
  const resumoHtml = (release.resumo || "").replace(/\n/g, "<br>");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charSet="utf-8" />
  <title>${release.titulo || "Release"}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 40px;
      line-height: 1.6;
      color: #111827;
      font-size: 14px;
    }
    h1 {
      font-size: 22px;
      margin-bottom: 4px;
    }
    .meta {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 16px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      background: #e5f4ea;
      color: #166534;
      font-size: 11px;
      font-weight: 600;
      margin-left: 8px;
    }
    img {
      max-width: 100%;
      margin: 16px 0;
      border-radius: 8px;
    }
    .section-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #4b5563;
      margin-top: 24px;
      margin-bottom: 4px;
    }
    a {
      color: #166534;
    }
  </style>
</head>
<body>
  <h1>${release.titulo || "Release"}</h1>
  <div class="meta">
    ${release.data ? formatarData(release.data) : ""}
    ${release.categoria ? ` · ${release.categoria}` : ""}
    ${release.destaque ? `<span class="badge">Em destaque</span>` : ""}
  </div>

  ${
    resumoHtml
      ? `<div><strong>Resumo:</strong><br>${resumoHtml}</div>`
      : ""
  }

  ${
    release.imagem
      ? `<img src="${release.imagem}" alt="Imagem do release" />`
      : ""
  }

  ${
    conteudoHtml
      ? `<div class="section-label">Texto completo</div><div>${conteudoHtml}</div>`
      : ""
  }

  ${
    release.instagram
      ? `<div class="section-label">Instagram</div><div><a href="${release.instagram}">${release.instagram}</a></div>`
      : ""
  }
</body>
</html>`;

  win.document.open();
  win.document.write(html);
  win.document.close();

  win.focus();
  win.print();
}

export default function ClippingListaPage() {
  const [releases, setReleases] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [anoFiltro, setAnoFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/imprensa", { cache: "no-store" });
        const json = await res.json();
        const lista = (json.releases || []).filter((r) =>
          ["Ação social", "Reunião", "Fiscalização", "Evento"].includes(
            r.categoria || ""
          )
        );
        const ordenados = lista
          .slice()
          .sort((a, b) => {
            const da = a.destaque ? 1 : 0;
            const db = b.destaque ? 1 : 0;
            if (db !== da) return db - da;
            return (b.data || "").localeCompare(a.data || "");
          });
        setReleases(ordenados);
      } catch {
        setReleases([]);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const anos = Array.from(
    new Set(
      releases
        .map((r) => (r.data || "").slice(0, 4))
        .filter((a) => a && a.length === 4)
    )
  ).sort((a, b) => b.localeCompare(a));

  let filtrados = releases;

  if (categoriaFiltro !== "Todos") {
    filtrados = filtrados.filter(
      (r) => (r.categoria || "") === categoriaFiltro
    );
  }

  if (anoFiltro !== "Todos") {
    filtrados = filtrados.filter((r) =>
      (r.data || "").startsWith(anoFiltro)
    );
  }

  if (busca.trim()) {
    const termo = busca.toLowerCase();
    filtrados = filtrados.filter(
      (r) =>
        (r.titulo || "").toLowerCase().includes(termo) ||
        (r.resumo || "").toLowerCase().includes(termo)
    );
  }

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="w-full bg-neutral-900 text-white py-10 md:py-14">
        <div className="section">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Clipping – Modo Lista
          </h1>
          <p className="text-base md:text-lg mt-2 text-gray-200 max-w-2xl">
            Visão em lista das matérias de imprensa de Carlos Tabanez.
          </p>
          <p className="text-xs md:text-sm mt-3 text-gray-300">
            Para modo em cards, acesse{" "}
            <a
              href="/clipping"
              className="underline font-semibold text-green-300"
            >
              /clipping
            </a>
            .
          </p>
        </div>
      </section>

      {/* BUSCA E FILTROS */}
      <section className="section pt-8 pb-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar matérias por título ou resumo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              {CATEGORIAS_CLIPPING.map((c) => (
                <option key={c} value={c}>
                  {c === "Todos" ? "Todas as categorias" : c}
                </option>
              ))}
            </select>

            <select
              value={anoFiltro}
              onChange={(e) => setAnoFiltro(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="Todos">Todos os anos</option>
              {anos.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="section pb-10">
        {carregando ? (
          <p className="text-sm text-gray-600">Carregando clipping...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-gray-600 text-sm md:text-base">
            Nenhum release encontrado com os filtros atuais.
          </p>
        ) : (
          <div className="bg-white rounded-card shadow-card border border-gray-100 divide-y">
            {filtrados.map((r) => (
              <div key={r.id} className="p-3 md:p-4 flex flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    {r.data && (
                      <span className="font-semibold">
                        {formatarData(r.data)}
                      </span>
                    )}
                    {r.categoria && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                        {r.categoria}
                      </span>
                    )}
                    {r.destaque && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                        Em destaque
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => exportarPDF(r)}
                    className="text-[11px] text-primary underline"
                  >
                    Exportar PDF
                  </button>
                </div>

                <h2 className="text-sm md:text-base font-bold text-gray-900">
                  {r.titulo || "Sem título"}
                </h2>

                {r.resumo && (
                  <p className="text-xs md:text-sm text-gray-700">
                    {r.resumo}
                  </p>
                )}

                {typeof r.views === "number" && (
                  <p className="text-[11px] text-gray-400 mt-1">
                    👁 {r.views} visualizações
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
