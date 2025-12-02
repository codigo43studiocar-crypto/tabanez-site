// src/app/admin/imprensa/page.jsx
"use client";

import { useEffect, useState } from "react";

const CATEGORIAS = ["Ação social", "Reunião", "Fiscalização", "Evento", "Outros"];

function novoRelease() {
  return {
    id: Date.now(),
    data: "",
    titulo: "",
    categoria: "",
    resumo: "",
    textoCompleto: "",
    destaque: false,
  };
}

export default function AdminImprensaPage() {
  const [releases, setReleases] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const res = await fetch("/api/imprensa", { cache: "no-store" });
        const json = await res.json();
        setReleases(json.releases || []);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar releases de imprensa.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function atualizarRelease(index, campo, valor) {
    setReleases((prev) => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [campo]: valor };
      return copia;
    });
  }

  function adicionarRelease() {
    setReleases((prev) => [...prev, novoRelease()]);
  }

  function removerRelease(index) {
    if (!window.confirm("Remover este release?")) return;
    setReleases((prev) => prev.filter((_, i) => i !== index));
  }

  async function salvarTudo() {
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const res = await fetch("/api/imprensa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ releases }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Erro ao salvar releases.");
        return;
      }

      setSucesso("Releases salvos com sucesso.");
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
          Imprensa
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold">Releases de imprensa</h1>
        <p className="text-sm text-neutral-300 max-w-2xl">
          Cadastre materiais oficiais da campanha com imagem, texto completo,
          categoria, vídeo, destaque e, se quiser, link para o Instagram.
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

        {carregando ? (
          <p className="text-sm text-neutral-200">Carregando releases...</p>
        ) : (
          <div className="space-y-4">
            {releases.map((r, index) => (
              <div
                key={r.id || index}
                className="bg-white rounded-xl border border-neutral-200 px-4 py-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-700">
                    Release {index + 1}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-neutral-700">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={!!r.destaque}
                        onChange={(e) =>
                          atualizarRelease(index, "destaque", e.target.checked)
                        }
                      />
                      Destaque
                    </label>
                    <button
                      type="button"
                      onClick={() => removerRelease(index)}
                      className="text-red-500 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-3 text-xs md:text-sm">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600">
                      Data
                    </label>
                    <input
                      type="date"
                      value={r.data || ""}
                      onChange={(e) =>
                        atualizarRelease(index, "data", e.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-neutral-600">
                      Título
                    </label>
                    <input
                      type="text"
                      value={r.titulo || ""}
                      onChange={(e) =>
                        atualizarRelease(index, "titulo", e.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600">
                      Categoria
                    </label>
                    <select
                      value={r.categoria || ""}
                      onChange={(e) =>
                        atualizarRelease(index, "categoria", e.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white"
                    >
                      <option value="">Selecione...</option>
                      {CATEGORIAS.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600">
                    Resumo (aparece no card)
                  </label>
                  <textarea
                    rows={2}
                    value={r.resumo || ""}
                    onChange={(e) =>
                      atualizarRelease(index, "resumo", e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600">
                    Texto completo (aparece no pop-up)
                  </label>
                  <textarea
                    rows={4}
                    value={r.textoCompleto || ""}
                    onChange={(e) =>
                      atualizarRelease(index, "textoCompleto", e.target.value)
                    }
                    className="mt-1 w-full rounded-md border border-neutral-300 px-2 py-2 bg-white text-xs"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={adicionarRelease}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400"
            >
              + Novo release
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={salvarTudo}
                disabled={salvando}
                className="px-5 py-2 rounded-full bg-amber-400 text-neutral-900 text-sm font-semibold hover:bg-amber-300 disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar todos os releases"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}