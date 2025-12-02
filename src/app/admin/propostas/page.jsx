"use client";

import { useEffect, useMemo, useState } from "react";

const CATEGORIAS_PADRAO = [
  "Saúde",
  "Educação",
  "Segurança",
  "Mobilidade",
  "Infraestrutura",
  "Ação Social",
  "Juventude",
  "Emprego e Renda",
  "Outros",
];

const PRIORIDADES = ["Alta", "Média", "Baixa"];

export default function AdminPropostasPage() {
  const [propostas, setPropostas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [dragId, setDragId] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/propostas", { cache: "no-store" });
        const json = await res.json();
        setPropostas(json.propostas || []);
      } catch {
        setErro("Erro ao carregar propostas.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function atualizarProposta(id, campo, valor) {
    setPropostas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)),
    );
  }

  function adicionarProposta() {
    const id =
      Date.now().toString(16) + Math.random().toString(16).slice(2, 8);
    setPropostas((prev) => [
      ...prev,
      {
        id,
        categoria: "Outros",
        titulo: "",
        subtitulo: "",
        bullets: [],
        prioridade: "Média",
        destaque: false,
        publicado: true,
        ordem: (prev.length || 0) + 1,
      },
    ]);
  }

  function removerProposta(id) {
    setPropostas((prev) => prev.filter((p) => p.id !== id));
  }

  function duplicarProposta(id) {
    setPropostas((prev) => {
      const lista = [...prev];
      const original = lista.find((p) => p.id === id);
      if (!original) return prev;
      const novoId =
        Date.now().toString(16) + Math.random().toString(16).slice(2, 8);
      const copia = {
        ...original,
        id: novoId,
        titulo: original.titulo
          ? original.titulo + " (cópia)"
          : "Proposta (cópia)",
        destaque: false,
        ordem: original.ordem + 0.1,
      };
      lista.push(copia);
      return lista;
    });
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      // Reordena por categoria + ordem
      const ordenadas = propostas
        .slice()
        .sort((a, b) => {
          if (a.categoria < b.categoria) return -1;
          if (a.categoria > b.categoria) return 1;
          return (a.ordem || 0) - (b.ordem || 0);
        })
        .map((p, index) => ({ ...p, ordem: index + 1 }));

      const res = await fetch("/api/propostas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propostas: ordenadas }),
      });

      if (!res.ok) throw new Error();
      const json = await res.json();
      setPropostas(json.propostas || []);
      setSucesso("Propostas salvas com sucesso.");
    } catch {
      setErro("Erro ao salvar propostas.");
    } finally {
      setSalvando(false);
    }
  }

  function handleDragStart(id) {
    setDragId(id);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(idDestino) {
    if (!dragId || dragId === idDestino) return;

    setPropostas((prev) => {
      const lista = [...prev];
      const origemIndex = lista.findIndex((p) => p.id === dragId);
      const destinoIndex = lista.findIndex((p) => p.id === idDestino);
      if (origemIndex === -1 || destinoIndex === -1) return prev;

      const [removido] = lista.splice(origemIndex, 1);
      lista.splice(destinoIndex, 0, removido);
      return lista;
    });
    setDragId(null);
  }

  function mover(id, direcao) {
    setPropostas((prev) => {
      const lista = [...prev];
      const index = lista.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const novoIndex = index + direcao;
      if (novoIndex < 0 || novoIndex >= lista.length) return prev;
      const [item] = lista.splice(index, 1);
      lista.splice(novoIndex, 0, item);
      return lista;
    });
  }

  const propostasFiltradas = useMemo(() => {
    let lista = [...propostas];

    if (categoriaFiltro !== "Todas") {
      lista = lista.filter((p) => p.categoria === categoriaFiltro);
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      lista = lista.filter(
        (p) =>
          (p.titulo || "").toLowerCase().includes(termo) ||
          (p.subtitulo || "").toLowerCase().includes(termo),
      );
    }

    // Destaques primeiro dentro da categoria
    lista.sort((a, b) => {
      if (a.categoria < b.categoria) return -1;
      if (a.categoria > b.categoria) return 1;
      if (a.destaque && !b.destaque) return -1;
      if (!a.destaque && b.destaque) return 1;
      return (a.ordem || 0) - (b.ordem || 0);
    });

    return lista;
  }, [propostas, busca, categoriaFiltro]);

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-600">Carregando propostas...</p>
      </div>
    );
  }

  const categoriasExistentes = Array.from(
    new Set(propostas.map((p) => p.categoria || "Outros")),
  );

  return (
    <div className="p-6">
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <header className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-dark">
              Propostas
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-dark">
              Propostas de Carlos Tabanez
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl">
              Organize as propostas por categoria, prioridade e destaque. Os
              tópicos são exibidos como lista de itens na página pública.
            </p>
          </div>

          <button
            type="button"
            onClick={adicionarProposta}
            className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
          >
            + Nova proposta
          </button>
        </header>

        {erro && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {erro}
          </p>
        )}

        {sucesso && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">
            {sucesso}
          </p>
        )}

        {/* Filtros do painel */}
        <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 grid gap-3 md:grid-cols-3 text-sm">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Buscar propostas (título ou subtítulo)
            </label>
            <input
              type="text"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option value="Todas">Todas</option>
              {categoriasExistentes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={salvar} className="space-y-4">
          {propostasFiltradas.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhuma proposta cadastrada ainda. Clique em &quot;Nova
              proposta&quot; para adicionar a primeira.
            </p>
          )}

          <div className="space-y-4">
            {propostasFiltradas.map((p, index) => (
              <div
                key={p.id}
                className="bg-white rounded-card shadow-card border border-gray-100 p-4 space-y-3"
                draggable
                onDragStart={() => handleDragStart(p.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(p.id)}
              >
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="cursor-move text-gray-400 text-lg">
                      ☰
                    </span>
                    <p className="text-xs font-semibold text-gray-500">
                      Proposta {index + 1}
                    </p>
                    {p.publicado ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold">
                        Publicada
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 font-semibold">
                        Rascunho
                      </span>
                    )}
                    {p.destaque && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                        Em destaque
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-[11px] text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!p.publicado}
                        onChange={(e) =>
                          atualizarProposta(p.id, "publicado", e.target.checked)
                        }
                      />
                      Publicado
                    </label>
                    <label className="flex items-center gap-1 text-[11px] text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!p.destaque}
                        onChange={(e) =>
                          atualizarProposta(p.id, "destaque", e.target.checked)
                        }
                      />
                      Destaque
                    </label>
                    <button
                      type="button"
                      onClick={() => mover(p.id, -1)}
                      className="text-xs text-gray-500 hover:text-gray-800"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => mover(p.id, 1)}
                      className="text-xs text-gray-500 hover:text-gray-800"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicarProposta(p.id)}
                      className="text-xs text-primary hover:underline"
                    >
                      Duplicar
                    </button>
                    <button
                      type="button"
                      onClick={() => removerProposta(p.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                {/* Categoria + prioridade */}
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <select
                      value={p.categoria || "Outros"}
                      onChange={(e) =>
                        atualizarProposta(p.id, "categoria", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
                    >
                      {CATEGORIAS_PADRAO.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Prioridade
                    </label>
                    <select
                      value={p.prioridade || "Média"}
                      onChange={(e) =>
                        atualizarProposta(p.id, "prioridade", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
                    >
                      {PRIORIDADES.map((pr) => (
                        <option key={pr} value={pr}>
                          {pr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ordem (opcional)
                    </label>
                    <input
                      type="number"
                      value={p.ordem ?? ""}
                      onChange={(e) =>
                        atualizarProposta(
                          p.id,
                          "ordem",
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>
                </div>

                {/* Título + subtítulo */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Título da proposta
                    </label>
                    <input
                      type="text"
                      value={p.titulo || ""}
                      onChange={(e) =>
                        atualizarProposta(p.id, "titulo", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Subtítulo (texto abaixo do título)
                    </label>
                    <textarea
                      rows={2}
                      value={p.subtitulo || ""}
                      onChange={(e) =>
                        atualizarProposta(p.id, "subtitulo", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* Bullets */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Itens da proposta (um por linha)
                  </label>
                  <textarea
                    rows={4}
                    value={(p.bullets || []).join("\n")}
                    onChange={(e) =>
                      atualizarProposta(
                        p.id,
                        "bullets",
                        e.target.value
                          .split("\n")
                          .map((b) => b.trim())
                          .filter((b) => b.length > 0),
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Exemplo:
• Criar programa de atendimento...
• Ampliar número de vagas..."
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Na página pública, cada linha será exibida como um item da
                    lista com marcador.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={salvando}
              className="px-5 py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Salvar propostas"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
