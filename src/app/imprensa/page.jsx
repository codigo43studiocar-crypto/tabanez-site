"use client";

import { useEffect, useState } from "react";

const CATEGORIAS = [
  "Todos",
  "Ação social",
  "Reunião",
  "Fiscalização",
  "Evento",
  "Outros",
];

const ITENS_POR_PAGINA = 6;

function formatarData(iso) {
  if (!iso) return "";
  try {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
  } catch {
    return iso;
  }
}

function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    return null;
  } catch {
    return null;
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
    ${
      release.categoria
        ? ` · ${release.categoria}`
        : ""
    }
    ${
      release.destaque
        ? `<span class="badge">Em destaque</span>`
        : ""
    }
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

export default function ImprensaPage() {
  const [releases, setReleases] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [selecionado, setSelecionado] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [anoFiltro, setAnoFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/imprensa", { cache: "no-store" });
        const json = await res.json();
        setReleases(json.releases || []);
      } catch {
        setReleases([]);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  async function abrirRelease(r) {
    setSelecionado(r);
    try {
      const res = await fetch("/api/imprensa/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id }),
      });
      if (!res.ok) return;
      const json = await res.json();
      if (typeof json.views === "number") {
        setReleases((prev) =>
          prev.map((item) =>
            item.id === r.id ? { ...item, views: json.views, destaque: item.destaque } : item
          )
        );
        setSelecionado((prev) =>
          prev && prev.id === r.id ? { ...prev, views: json.views } : prev
        );
      }
    } catch {
      // ignora erro de contagem de view
    }
  }

  // ordena por destaque (true primeiro) e depois por data desc
  const releasesOrdenados = releases
    .slice()
    .sort((a, b) => {
      const da = a.destaque ? 1 : 0;
      const db = b.destaque ? 1 : 0;
      if (db !== da) return db - da;
      return (b.data || "").localeCompare(a.data || "");
    });

  const anos = Array.from(
    new Set(
      releasesOrdenados
        .map((r) => (r.data || "").slice(0, 4))
        .filter((a) => a && a.length === 4)
    )
  ).sort((a, b) => b.localeCompare(a));

  let filtrados = releasesOrdenados;

  if (categoriaFiltro !== "Todos") {
    filtrados = filtrados.filter(
      (r) => (r.categoria || "Outros") === categoriaFiltro
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

  const totalPaginas = Math.max(
    1,
    Math.ceil(filtrados.length / ITENS_POR_PAGINA)
  );

  const paginaSegura = Math.min(Math.max(pagina, 1), totalPaginas);
  const inicio = (paginaSegura - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const releasesPagina = filtrados.slice(inicio, fim);

  function irParaPagina(n) {
    if (n < 1 || n > totalPaginas) return;
    setPagina(n);
    setSelecionado(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-10 md:py-14">
        <div className="section">
          <h1 className="text-3xl md:text-5xl font-extrabold">Imprensa</h1>
          <p className="text-base md:text-lg mt-2 text-green-50 max-w-2xl">
            Releases oficiais, ações recentes e materiais de imprensa sobre
            Carlos Tabanez no Distrito Federal.
          </p>
        </div>
      </section>

      {/* FILTROS E BUSCA */}
      <section className="section pt-8 md:pt-10 pb-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar matérias por título ou resumo..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <select
              value={categoriaFiltro}
              onChange={(e) => {
                setCategoriaFiltro(e.target.value);
                setPagina(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c === "Todos" ? "Todas as categorias" : c}
                </option>
              ))}
            </select>

            <select
              value={anoFiltro}
              onChange={(e) => {
                setAnoFiltro(e.target.value);
                setPagina(1);
              }}
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

      {/* GRID DE RELEASES */}
      <section className="section pb-10 md:pb-14">
        {carregando ? (
          <p className="text-sm text-gray-600">Carregando releases...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-gray-600 text-sm md:text-base">
            Nenhum release encontrado com os filtros atuais.
          </p>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {releasesPagina.map((r) => (
                <article
                  key={r.id}
                  className="bg-white rounded-card shadow-card border border-gray-100 overflow-hidden cursor-pointer flex flex-col hover:-translate-y-1 hover:shadow-lg transition"
                  onClick={() => abrirRelease(r)}
                >
                  {r.imagem ? (
                    <div className="w-full h-40 md:h-44 overflow-hidden">
                      <img
                        src={r.imagem}
                        alt={r.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 md:h-44 bg-gradient-to-br from-primary to-primary-dark" />
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {r.data && (
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
                            {formatarData(r.data)}
                          </p>
                        )}
                        {r.categoria && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                            {r.categoria}
                          </span>
                        )}
                      </div>
                      {r.destaque && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                          Em destaque
                        </span>
                      )}
                    </div>
                    <h2 className="text-sm md:text-base font-bold text-gray-900 mb-2">
                      {r.titulo || "Sem título"}
                    </h2>
                    {r.resumo && (
                      <p className="text-xs md:text-sm text-gray-700 line-clamp-4">
                        {r.resumo}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                      <span className="font-semibold text-primary">
                        Ler mais
                      </span>
                      <span>
                        👁{" "}
                        {typeof r.views === "number" && r.views >= 0
                          ? r.views
                          : 0}{" "}
                        views
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINAÇÃO */}
            {totalPaginas > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 text-sm flex-wrap">
                <button
                  type="button"
                  onClick={() => irParaPagina(paginaSegura - 1)}
                  disabled={paginaSegura === 1}
                  className="px-3 py-1.5 rounded-md border border-gray-300 disabled:opacity-40"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPaginas }).map((_, i) => {
                  const n = i + 1;
                  const ativo = n === paginaSegura;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => irParaPagina(n)}
                      className={`px-3 py-1.5 rounded-md border text-sm ${
                        ativo
                          ? "bg-primary text-white border-primary"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => irParaPagina(paginaSegura + 1)}
                  disabled={paginaSegura === totalPaginas}
                  className="px-3 py-1.5 rounded-md border border-gray-300 disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* MODAL / POP-UP */}
      {selecionado && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-3">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {selecionado.data && (
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
                      {formatarData(selecionado.data)}
                    </p>
                  )}
                  {selecionado.categoria && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      {selecionado.categoria}
                    </span>
                  )}
                  {selecionado.destaque && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                      Em destaque
                    </span>
                  )}
                </div>
                <h2 className="text-sm md:text-lg font-bold text-gray-900">
                  {selecionado.titulo}
                </h2>
                <p className="text-[11px] text-gray-500">
                  👁{" "}
                  {typeof selecionado.views === "number" &&
                  selecionado.views >= 0
                    ? selecionado.views
                    : 0}{" "}
                  visualizações
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportarPDF(selecionado)}
                  className="hidden md:inline-flex px-3 py-1.5 rounded-md border border-gray-300 text-[11px] font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Exportar PDF
                </button>
                <button
                  onClick={() => setSelecionado(null)}
                  className="text-gray-500 hover:text-gray-800 text-xl leading-none px-2"
                  aria-label="Fechar"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Conteúdo com scroll */}
            <div className="flex-1 overflow-y-auto">
              {/* Vídeo, se houver */}
              {(() => {
                const videoUrl = selecionado.video || "";
                const embedUrl = getYoutubeEmbedUrl(videoUrl);
                if (embedUrl) {
                  return (
                    <div className="w-full bg-black">
                      <div className="relative pb-[56.25%]">
                        <iframe
                          src={embedUrl}
                          title="Vídeo"
                          className="absolute inset-0 w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  );
                }
                if (videoUrl && videoUrl.endsWith(".mp4")) {
                  return (
                    <div className="w-full bg-black">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full max-h-80"
                      />
                    </div>
                  );
                }
                return null;
              })()}

              {/* Imagem, se houver */}
              {selecionado.imagem && (
                <div className="w-full max-h-64 overflow-hidden">
                  <img
                    src={selecionado.imagem}
                    alt={selecionado.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="px-4 md:px-6 py-4 space-y-3">
                {selecionado.resumo && (
                  <p className="text-sm md:text-base text-gray-800 font-semibold">
                    {selecionado.resumo}
                  </p>
                )}
                {selecionado.conteudo && (
                  <p className="text-sm md:text-base text-gray-700 whitespace-pre-line">
                    {selecionado.conteudo}
                  </p>
                )}

                {selecionado.instagram && (
                  <a
                    href={selecionado.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex mt-2 text-xs md:text-sm font-semibold text-primary hover:text-primary-dark"
                  >
                    Ver publicação no Instagram
                  </a>
                )}
              </div>
            </div>

            {/* Rodapé no mobile (botões) */}
            <div className="px-4 py-3 border-t border-gray-200 flex justify-between md:justify-end gap-2 md:hidden">
              <button
                onClick={() => exportarPDF(selecionado)}
                className="px-4 py-1.5 rounded-md border border-gray-300 text-xs font-semibold text-gray-700"
              >
                Exportar PDF
              </button>
              <button
                onClick={() => setSelecionado(null)}
                className="px-4 py-1.5 rounded-md bg-neutral-900 text-white text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
