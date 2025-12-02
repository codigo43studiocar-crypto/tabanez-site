// src/app/admin/galeria/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";

const CATEGORIAS = [
  "Ação social",
  "Fiscalização",
  "Eventos",
  "Reuniões",
  "Comunidade",
  "Segurança pública",
  "Esporte e Juventude",
  "Educação e Saúde",
  "Projetos do Mandato",
  "Outros",
];

function novoItem() {
  return {
    id: Date.now(),
    titulo: "",
    descricao: "",
    ano: "",
    categoria: "",
    imagemUrl: "",
  };
}

export default function AdminGaleriaPage() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [anoFiltro, setAnoFiltro] = useState("Todos");
  const [modo, setModo] = useState("grade"); // "grade" | "lista"

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const res = await fetch("/api/galeria", { cache: "no-store" });
        const json = await res.json();
        setItens(json.itens || []);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar a galeria.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const anos = useMemo(() => {
    const set = new Set();
    itens.forEach((i) => i.ano && set.add(i.ano));
    return Array.from(set).sort();
  }, [itens]);

  function atualizarItem(id, campo, valor) {
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, [campo]: valor } : i)));
  }

  function adicionarItem() {
    setItens((prev) => [...prev, novoItem()]);
  }

  function removerItem(id) {
    if (!window.confirm("Remover este item da galeria?")) return;
    setItens((prev) => prev.filter((i) => i.id !== id));
  }

  const itensFiltrados = itens.filter((i) => {
    if (
      busca &&
      !`${i.titulo} ${i.descricao}`.toLowerCase().includes(busca.toLowerCase())
    ) {
      return false;
    }
    if (categoriaFiltro !== "Todas" && i.categoria !== categoriaFiltro) {
      return false;
    }
    if (anoFiltro !== "Todos" && i.ano !== anoFiltro) {
      return false;
    }
    return true;
  });

  async function salvarTudo() {
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const res = await fetch("/api/galeria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itens }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Erro ao salvar galeria.");
        return;
      }

      setSucesso("Galeria salva com sucesso.");
    } catch (e) {
      console.error(e);
      setErro("Erro de comunicação com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-6 text-neutral-50">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
          Galeria
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Gerenciar Galeria (Fotos e Vídeos)
        </h1>
        <p className="text-sm text-neutral-300 max-w-2xl">
          Atualize a galeria de fotos com título, descrição, categorias, anos e
          imagens.
        </p>
      </header>

      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6 text-neutral-900">
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

        <div className="flex flex-col md:flex-row gap-3 mb-4 text-xs md:text-sm">
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 bg-white"
          />
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="w-full md:w-48 rounded-md border border-neutral-300 px-3 py-2 bg-white"
          >
            <option>Todas</option>
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={anoFiltro}
            onChange={(e) => setAnoFiltro(e.target.value)}
            className="w-full md:w-32 rounded-md border border-neutral-300 px-3 py-2 bg-white"
          >
            <option>Todos</option>
            {anos.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModo("grade")}
              className={`px-3 py-1 rounded-full border text-xs ${
                modo === "grade"
                  ? "bg-neutral-900 text-white border-neutral-800"
                  : "bg-white border-neutral-300"
              }`}
            >
              Grade
            </button>
            <button
              type="button"
              onClick={() => setModo("lista")}
              className={`px-3 py-1 rounded-full border text-xs ${
                modo === "lista"
                  ? "bg-neutral-900 text-white border-neutral-800"
                  : "bg-white border-neutral-300"
              }`}
            >
              Lista
            </button>
          </div>
        </div>

        {carregando ? (
          <p className="text-sm text-neutral-200">Carregando galeria...</p>
        ) : (
          <div className="space-y-4">
            {modo === "grade" ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {itensFiltrados.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-neutral-200 p-3 space-y-2"
                  >
                    <input
                      type="text"
                      placeholder="Título"
                      value={item.titulo || ""}
                      onChange={(e) =>
                        atualizarItem(item.id, "titulo", e.target.value)
                      }
                      className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs bg-white"
                    />
                    <textarea
                      rows={2}
                      placeholder="Descrição curta"
                      value={item.descricao || ""}
                      onChange={(e) =>
                        atualizarItem(item.id, "descricao", e.target.value)
                      }
                      className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="URL da imagem"
                      value={item.imagemUrl || ""}
                      onChange={(e) =>
                        atualizarItem(item.id, "imagemUrl", e.target.value)
                      }
                      className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs bg-white"
                    />
                    <div className="flex items-center gap-2 text-[11px]">
                      <select
                        value={item.categoria || ""}
                        onChange={(e) =>
                          atualizarItem(item.id, "categoria", e.target.value)
                        }
                        className="flex-1 rounded-md border border-neutral-300 px-2 py-1.5 bg-white"
                      >
                        <option value="">Categoria...</option>
                        {CATEGORIAS.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Ano"
                        value={item.ano || ""}
                        onChange={(e) =>
                          atualizarItem(item.id, "ano", e.target.value)
                        }
                        className="w-20 rounded-md border border-neutral-300 px-2 py-1.5 bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removerItem(item.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {itensFiltrados.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-neutral-200 px-4 py-3 space-y-2"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Título"
                        value={item.titulo || ""}
                        onChange={(e) =>
                          atualizarItem(item.id, "titulo", e.target.value)
                        }
                        className="flex-1 rounded-md border border-neutral-300 px-2 py-1.5 bg-white"
                      />
                      <div className="flex items-center gap-2">
                        <select
                          value={item.categoria || ""}
                          onChange={(e) =>
                            atualizarItem(item.id, "categoria", e.target.value)
                          }
                          className="rounded-md border border-neutral-300 px-2 py-1.5 bg-white"
                        >
                          <option value="">Categoria...</option>
                          {CATEGORIAS.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Ano"
                          value={item.ano || ""}
                          onChange={(e) =>
                            atualizarItem(item.id, "ano", e.target.value)
                          }
                          className="w-20 rounded-md border border-neutral-300 px-2 py-1.5 bg-white"
                        />
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Descrição"
                      value={item.descricao || ""}
                      onChange={(e) =>
                        atualizarItem(item.id, "descricao", e.target.value)
                      }
                      className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="URL da imagem"
                      value={item.imagemUrl || ""}
                      onChange={(e) =>
                        atualizarItem(item.id, "imagemUrl", e.target.value)
                      }
                      className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removerItem(item.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={adicionarItem}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400"
            >
              + Novo item
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={salvarTudo}
                disabled={salvando}
                className="px-5 py-2 rounded-full bg-amber-400 text-neutral-900 text-sm font-semibold hover:bg-amber-300 disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar galeria"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}