// src/app/admin/propostas/page.jsx
"use client";

import { useEffect, useState } from "react";

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

function novaProposta() {
  return {
    id: Date.now(),
    categoria: "",
    prioridade: "Média",
    ordem: "",
    titulo: "",
    subtitulo: "",
    itensTexto: "",
    publicado: true,
    destaque: false,
  };
}

export default function AdminPropostasPage() {
  const [propostas, setPropostas] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const res = await fetch("/api/propostas", { cache: "no-store" });
        const json = await res.json();
        setPropostas(json.propostas || []);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar propostas.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function atualizarProposta(id, campo, valor) {
    setPropostas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  }

  function adicionarProposta() {
    setPropostas((prev) => [...prev, novaProposta()]);
  }

  function removerProposta(id) {
    if (!window.confirm("Remover esta proposta?")) return;
    setPropostas((prev) => prev.filter((p) => p.id !== id));
  }

  async function salvarTudo() {
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const res = await fetch("/api/propostas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propostas }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Erro ao salvar propostas.");
        return;
      }

      setSucesso("Propostas salvas com sucesso.");
    } catch (e) {
      console.error(e);
      setErro("Erro de comunicação com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  const propostasFiltradas = propostas.filter((p) => {
    if (
      busca &&
      !`${p.titulo} ${p.subtitulo}`.toLowerCase().includes(busca.toLowerCase())
    ) {
      return false;
    }
    if (categoriaFiltro !== "Todas" && p.categoria !== categoriaFiltro) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-neutral-50">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
          Propostas
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Propostas de Carlos Tabanez
        </h1>
        <p className="text-sm text-neutral-300 max-w-2xl">
          Organize as propostas por categoria, prioridade e destaque. Os tópicos
          são exibidos como lista de itens na página pública.
        </p>
      </header>

      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6 text-neutral-900">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar propostas (título ou subtítulo)"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm bg-white"
          />
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="w-full md:w-48 rounded-md border border-neutral-300 px-3 py-2 text-sm bg-white"
          >
            <option>Todas</option>
            {CATEGORIAS_PADRAO.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {erro && (
          <p className="mb-3 text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {erro}
          </p>
        )}
        {sucesso && (
          <p className="mb-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
            {sucesso}
          </p>
        )}

        {carregando ? (
          <p className="text-sm text-neutral-200">Carregando propostas...</p>
        ) : (
          <div className="space-y-4">
            {propostasFiltradas.map((p, index) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-neutral-200 px-4 py-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-700">
                    Proposta {index + 1}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-neutral-700">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={!!p.publicado}
                        onChange={(e) =>
                          atualizarProposta(p.id, "publicado", e.target.checked)
                        }
                      />
                      Publicado
                    </label>
                    <label className="flex items-center gap-1">
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
                      onClick={() => removerProposta(p.id)}
                      className="text-red-500 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-3 text-xs md:text-sm">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600">
                      Categoria
                    </label>
                    <select
                      value={p.categoria || ""}
                      onChange={(e) =>
                        atualizarProposta(p.id, "categoria", e.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white"
                    >
                      <option value="">Selecione...</option>
                      {CATEGORIAS_PADRAO.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600">
                      Prioridade
                    </label>
                    <select
                      value={p.prioridade || "Média"}
                      onChange={(e) =>
                        atualizarProposta(p.id, "prioridade", e.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white"
                    >
                      {PRIORIDADES.map((pr) => (
                        <option key={pr}>{pr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600">
                      Ordem (opcional)
                    </label>
                    <input
                      type="number"
                      value={p.ordem || ""}
                      onChange={(e) =>
                        atualizarProposta(p.id, "ordem", e.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-xs md:text-sm">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600">
                      Título da proposta
                    </label>
                    <input
                      type="text"
                      value={p.titulo || ""}
                      onChange={(e) =>
                        atualizarProposta(p.id, "titulo", e.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600">
                      Subtítulo (texto abaixo do título)
                    </label>
                    <input
                      type="text"
                      value={p.subtitulo || ""}
                      onChange={(e) =>
                        atualizarProposta(p.id, "subtitulo", e.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600">
                    Itens da proposta (um por linha)
                  </label>
                  <textarea
                    rows={4}
                    value={p.itensTexto || ""}
                    onChange={(e) =>
                      atualizarProposta(p.id, "itensTexto", e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white text-xs"
                  />
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Na página pública, cada linha será exibida como um item da
                    lista com marcador.
                  </p>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={adicionarProposta}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400"
            >
              + Nova proposta
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={salvarTudo}
                disabled={salvando}
                className="px-5 py-2 rounded-full bg-amber-400 text-neutral-900 text-sm font-semibold hover:bg-amber-300 disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar todas as propostas"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}