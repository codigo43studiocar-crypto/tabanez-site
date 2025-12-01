"use client";

import { useEffect, useMemo, useState } from "react";

const PRIORIDADE_BADGE = {
  Alta: { texto: "Alta prioridade", classe: "bg-red-100 text-red-800" },
  Média: { texto: "Prioridade média", classe: "bg-yellow-100 text-yellow-800" },
  Baixa: { texto: "Prioridade baixa", classe: "bg-gray-200 text-gray-700" },
};

export default function PropostasPage() {
  const [propostas, setPropostas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/propostas", { cache: "no-store" });
        const json = await res.json();
        const lista = (json.propostas || []).filter((p) => p.publicado !== false);
        setPropostas(lista);
      } catch {
        setPropostas([]);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const categorias = useMemo(() => {
    const set = new Set(
      propostas.map((p) => p.categoria || "Outros"),
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [propostas]);

  const agrupadas = useMemo(() => {
    let lista = [...propostas];

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      lista = lista.filter(
        (p) =>
          (p.titulo || "").toLowerCase().includes(termo) ||
          (p.subtitulo || "").toLowerCase().includes(termo) ||
          (p.bullets || [])
            .join(" ")
            .toLowerCase()
            .includes(termo),
      );
    }

    if (categoriaFiltro !== "Todas") {
      lista = lista.filter((p) => p.categoria === categoriaFiltro);
    }

    // Destaques primeiro, depois prioridade, depois ordem
    lista.sort((a, b) => {
      if (a.categoria < b.categoria) return -1;
      if (a.categoria > b.categoria) return 1;
      if (a.destaque && !b.destaque) return -1;
      if (!a.destaque && b.destaque) return 1;
      const pa = a.prioridade || "Média";
      const pb = b.prioridade || "Média";
      const peso = { Alta: 1, Média: 2, Baixa: 3 };
      if (peso[pa] !== peso[pb]) return peso[pa] - peso[pb];
      return (a.ordem || 0) - (b.ordem || 0);
    });

    const mapa = new Map();
    for (const p of lista) {
      const cat = p.categoria || "Outros";
      if (!mapa.has(cat)) mapa.set(cat, []);
      mapa.get(cat).push(p);
    }
    return mapa;
  }, [propostas, busca, categoriaFiltro]);

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="w-full bg-neutral-900 text-white py-10 md:py-14">
        <div className="section">
          <h1 className="text-3xl md:text-5xl font-extrabold">Propostas</h1>
          <p className="text-base md:text-lg mt-2 text-gray-200 max-w-2xl">
            Conheça as principais propostas de Carlos Tabanez para o Distrito
            Federal, organizadas por áreas de atuação.
          </p>
        </div>
      </section>

      {/* BUSCA + FILTRO */}
      <section className="section pt-8 md:pt-10 pb-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Buscar propostas
            </label>
            <input
              type="text"
              placeholder="Buscar por palavra-chave..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Filtrar por categoria
            </label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
            >
              <option value="Todas">Todas as categorias</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* LISTA DE PROPOSTAS AGRUPADAS */}
      <section className="section pb-10 md:pb-14 space-y-8">
        {carregando ? (
          <p className="text-sm text-gray-600">Carregando propostas...</p>
        ) : agrupadas.size === 0 ? (
          <p className="text-gray-600 text-sm">
            Nenhuma proposta encontrada com os filtros atuais.
          </p>
        ) : (
          Array.from(agrupadas.entries()).map(([categoria, itens]) => (
            <div key={categoria} className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-lg md:text-xl font-bold text-neutral-900">
                  {categoria}
                </h2>
                <p className="text-xs text-gray-500">
                  {itens.length} proposta
                  {itens.length > 1 ? "s" : ""} nesta categoria
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {itens.map((p) => {
                  const prioridadeInfo =
                    PRIORIDADE_BADGE[p.prioridade || "Média"];
                  return (
                    <article
                      key={p.id}
                      className="bg-white rounded-card shadow-card border border-gray-100 p-4 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {prioridadeInfo && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${prioridadeInfo.classe}`}
                            >
                              {prioridadeInfo.texto}
                            </span>
                          )}
                          {p.destaque && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                              Em destaque
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-neutral-900">
                        {p.titulo || "Proposta"}
                      </h3>

                      {p.subtitulo && (
                        <p className="text-xs md:text-sm text-gray-700">
                          {p.subtitulo}
                        </p>
                      )}

                      {Array.isArray(p.bullets) && p.bullets.length > 0 && (
                        <ul className="mt-2 list-disc list-inside text-xs md:text-sm text-gray-800 space-y-1">
                          {p.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
