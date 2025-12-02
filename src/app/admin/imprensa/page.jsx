"use client";

import { useEffect, useState } from "react";

const CATEGORIAS = [
  "Ação social",
  "Reunião",
  "Fiscalização",
  "Evento",
  "Outros",
];

export default function AdminImprensaPage() {
  const [releases, setReleases] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/imprensa", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const json = await res.json();
        setReleases(json.releases || []);
      } catch {
        setErro("Erro ao carregar releases de imprensa.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function atualizarRelease(index, campo, valor) {
    setReleases((prev) => {
      const lista = [...prev];
      const atual = { ...(lista[index] || {}) };
      atual[campo] = valor;
      lista[index] = atual;
      return lista;
    });
  }

  function adicionarRelease() {
    setReleases((prev) => [
      ...prev,
      {
        id: "",
        data: new Date().toISOString().slice(0, 10),
        titulo: "",
        resumo: "",
        conteudo: "",
        imagem: "",
        instagram: "",
        categoria: "Outros",
        video: "",
        views: 0,
        destaque: false,
      },
    ]);
  }

  function removerRelease(index) {
    setReleases((prev) => prev.filter((_, i) => i !== index));
  }

  function duplicarRelease(index) {
    setReleases((prev) => {
      const lista = [...prev];
      const base = lista[index];
      if (!base) return prev;
      const copia = {
        ...base,
        id: "",
        titulo: base.titulo + " (cópia)",
        views: 0,
      };
      lista.splice(index + 1, 0, copia);
      return lista;
    });
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const res = await fetch("/api/imprensa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ releases }),
      });

      if (!res.ok) throw new Error();

      const json = await res.json();
      setReleases(json.releases || []);
      setSucesso("Releases salvos com sucesso.");
    } catch {
      setErro("Erro ao salvar releases.");
    } finally {
      setSalvando(false);
    }
  }

  async function fazerUploadImagem(index, file) {
    if (!file) return;

    setErro("");
    setSucesso("");
    setUploadingIndex(index);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-imprensa", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      const json = await res.json();

      if (!json.url) throw new Error();

      setReleases((prev) => {
        const lista = [...prev];
        const atual = { ...(lista[index] || {}) };
        atual.imagem = json.url;
        lista[index] = atual;
        return lista;
      });

      setSucesso("Imagem enviada com sucesso.");
    } catch (e) {
      console.error(e);
      setErro("Erro ao enviar imagem. Tente novamente.");
    } finally {
      setUploadingIndex(null);
    }
  }

  function dispararInputArquivo(index) {
    const input = document.getElementById(`upload-imprensa-${index}`);
    if (input) {
      input.click();
    }
  }

  async function buscarThumbnailInstagram(index, url) {
    const trimmed = (url || "").trim();
    if (!trimmed) return;

    const atual = releases[index];
    if (atual && atual.imagem) return;

    try {
      const res = await fetch("/api/instagram-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      if (json.thumbnailUrl) {
        setReleases((prev) => {
          const lista = [...prev];
          const r = { ...(lista[index] || {}) };
          r.imagem = json.thumbnailUrl;
          lista[index] = r;
          return lista;
        });
        setSucesso("Thumbnail do Instagram carregada automaticamente.");
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Drag & Drop
  function handleDragStart(index) {
    setDragIndex(index);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(indexDestino) {
    if (dragIndex === null || dragIndex === indexDestino) return;
    setReleases((prev) => {
      const lista = [...prev];
      const [removido] = lista.splice(dragIndex, 1);
      lista.splice(indexDestino, 0, removido);
      return lista;
    });
    setDragIndex(null);
  }

  function moverRelease(index, direcao) {
    setReleases((prev) => {
      const lista = [...prev];
      const novoIndex = index + direcao;
      if (novoIndex < 0 || novoIndex >= lista.length) return prev;
      const [item] = lista.splice(index, 1);
      lista.splice(novoIndex, 0, item);
      return lista;
    });
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-600">Carregando releases...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <header className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-dark">
              Imprensa
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-dark">
              Releases de imprensa
            </h1>
            <p className="text-sm text-gray-200 max-w-2xl">
              Cadastre matérias oficiais da campanha com imagem, texto completo,
              categoria, vídeo, destaque e, se quiser, link para o Instagram.
            </p>
          </div>

          <button
            type="button"
            onClick={adicionarRelease}
            className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
          >
            + Novo release
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

        <form onSubmit={salvar} className="space-y-4">
          {releases.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhum release cadastrado ainda. Clique em &quot;Novo release&quot;
              para adicionar o primeiro.
            </p>
          )}

          <div className="space-y-4">
            {releases.map((r, index) => (
              <div
                key={r.id || index}
                className="bg-white rounded-card shadow-card border border-gray-100 p-4 space-y-3"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <span className="cursor-move text-gray-400 text-lg">
                      ☰
                    </span>
                    <p className="text-xs font-semibold text-gray-500">
                      Release {index + 1}
                    </p>
                    <span className="text-[11px] text-gray-400">
                      {r.views && r.views > 0
                        ? `${r.views} visualizações`
                        : "0 visualizações"}
                    </span>
                    {r.destaque && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                        Em destaque
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-[11px] text-gray-700">
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
                      onClick={() => moverRelease(index, -1)}
                      className="text-xs text-gray-500 hover:text-gray-800"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moverRelease(index, 1)}
                      className="text-xs text-gray-500 hover:text-gray-800"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicarRelease(index)}
                      className="text-xs text-primary hover:underline"
                    >
                      Duplicar
                    </button>
                    <button
                      type="button"
                      onClick={() => removerRelease(index)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-[140px,minmax(0,1fr)] gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Data
                    </label>
                    <input
                      type="date"
                      value={r.data || ""}
                      onChange={(e) =>
                        atualizarRelease(index, "data", e.target.value)
                      }
                      className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Título
                      </label>
                      <input
                        type="text"
                        value={r.titulo || ""}
                        onChange={(e) =>
                          atualizarRelease(index, "titulo", e.target.value)
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Categoria
                      </label>
                      <select
                        value={r.categoria || "Outros"}
                        onChange={(e) =>
                          atualizarRelease(index, "categoria", e.target.value)
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
                      >
                        {CATEGORIAS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Resumo (aparece no card)
                  </label>
                  <textarea
                    rows={3}
                    value={r.resumo || ""}
                    onChange={(e) =>
                      atualizarRelease(index, "resumo", e.target.value)
                    }
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Texto completo (aparece no pop-up)
                  </label>
                  <textarea
                    rows={6}
                    value={r.conteudo || ""}
                    onChange={(e) =>
                      atualizarRelease(index, "conteudo", e.target.value)
                    }
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Imagem do release
                    </label>

                    <input
                      id={`upload-imprensa-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        fazerUploadImagem(
                          index,
                          e.target.files && e.target.files[0]
                        )
                      }
                    />

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => dispararInputArquivo(index)}
                        className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary-dark disabled:opacity-60"
                        disabled={uploadingIndex === index}
                      >
                        {uploadingIndex === index
                          ? "Enviando..."
                          : "Enviar imagem"}
                      </button>
                      {r.imagem && (
                        <span className="text-[11px] text-gray-600 truncate max-w-[160px]">
                          {r.imagem}
                        </span>
                      )}
                    </div>

                    <label className="block text-xs font-medium text-gray-700 mt-3">
                      URL da imagem (opcional para ajuste fino)
                    </label>
                    <input
                      type="text"
                      placeholder="/imprensa/arquivo.jpg ou https://..."
                      value={r.imagem || ""}
                      onChange={(e) =>
                        atualizarRelease(index, "imagem", e.target.value)
                      }
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Link do Instagram (opcional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.instagram.com/p/..."
                      value={r.instagram || ""}
                      onChange={(e) =>
                        atualizarRelease(index, "instagram", e.target.value)
                      }
                      onBlur={(e) =>
                        buscarThumbnailInstagram(index, e.target.value)
                      }
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Se preencher e não houver imagem, o sistema tenta buscar a
                      thumbnail automaticamente. No pop-up, aparece um botão
                      &quot;Ver publicação no Instagram&quot;.
                    </p>

                    <label className="block text-xs font-medium text-gray-700 mt-3">
                      Vídeo (YouTube ou MP4)
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=... ou https://.../video.mp4"
                      value={r.video || ""}
                      onChange={(e) =>
                        atualizarRelease(index, "video", e.target.value)
                      }
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Cole o link de um vídeo do YouTube ou de um arquivo MP4
                      hospedado. Ele será exibido acima do texto no pop-up.
                    </p>
                  </div>
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
              {salvando ? "Salvando..." : "Salvar releases"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
