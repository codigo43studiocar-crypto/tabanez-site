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

export default function AdminGaleria() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [modo, setModo] = useState("grade"); // grade | lista

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [anoFiltro, setAnoFiltro] = useState("Todos");

  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [dragId, setDragId] = useState(null);

  // ==========================
  // Carregar galeria
  // ==========================
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/galeria", { cache: "no-store" });
        const json = await res.json();
        setItens(json.itens || []);
      } catch {
        setErro("Erro ao carregar a galeria.");
      } finally {
        setCarregando(false);
      }
    }
    load();
  }, []);

  // ==========================
  // Atualizar campos
  // ==========================
  function atualizar(id, campo, valor) {
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, [campo]: valor } : i)));
  }

  // ==========================
  // Adicionar novo item
  // ==========================
  function adicionarItem() {
    const id = Date.now().toString(16) + Math.random().toString(16).slice(2);

    setItens((prev) => [
      ...prev,
      {
        id,
        categoria: "Outros",
        titulo: "",
        descricaoCurta: "",
        descricaoLonga: "",
        data: new Date().toISOString().slice(0, 10),
        imagem: "",
        video: "",
        destaque: false,
        publicado: true,
        views: 0,
        ordem: (prev.length || 0) + 1,
      },
    ]);
  }

  // ==========================
  // Remover item
  // ==========================
  function removerItem(id) {
    setItens((prev) => prev.filter((i) => i.id !== id));
  }

  // ==========================
  // Duplicar item
  // ==========================
  function duplicarItem(id) {
    setItens((prev) => {
      const original = prev.find((i) => i.id === id);
      if (!original) return prev;

      const copia = {
        ...original,
        id: Date.now().toString(16) + Math.random().toString(16).slice(2),
        titulo: original.titulo + " (cópia)",
        destaque: false,
        views: 0,
        ordem: (original.ordem || 0) + 0.1,
      };
      return [...prev, copia];
    });
  }

  // ==========================
  // Drag & Drop
  // ==========================
  function handleDragStart(id) {
    setDragId(id);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(idDestino) {
    if (!dragId || dragId === idDestino) return;

    setItens((prev) => {
      const lista = [...prev];
      const origemIndex = lista.findIndex((i) => i.id === dragId);
      const destinoIndex = lista.findIndex((i) => i.id === idDestino);
      if (origemIndex === -1 || destinoIndex === -1) return prev;

      const [item] = lista.splice(origemIndex, 1);
      lista.splice(destinoIndex, 0, item);

      return lista;
    });

    setDragId(null);
  }

  // ==========================
  // Upload (imagem ou vídeo)
  // ==========================
  async function uploadArquivo(index, file) {
    if (!file) return;

    setUploadingIndex(index);
    setErro("");
    setSucesso("");

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload-galeria", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error();
      const json = await res.json();

      setItens((prev) => {
        const lista = [...prev];
        lista[index].imagem = json.url;
        return lista;
      });

      setSucesso("Arquivo enviado com sucesso.");
    } catch {
      setErro("Erro ao enviar arquivo.");
    } finally {
      setUploadingIndex(null);
    }
  }

  function abrirUpload(index) {
    const input = document.getElementById(`galeria-upload-${index}`);
    if (input) input.click();
  }

  // ==========================
  // Salvar alterações
  // ==========================
  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const ordenados = itens
      .slice()
      .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
      .map((i, idx) => ({ ...i, ordem: idx + 1 }));

    try {
      const res = await fetch("/api/galeria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itens: ordenados }),
      });

      if (!res.ok) throw new Error();

      const json = await res.json();
      setItens(json.itens || []);

      setSucesso("Galeria salva com sucesso.");
    } catch {
      setErro("Erro ao salvar as alterações.");
    }
  }

  // ==========================
  // Filtros do painel
  // ==========================
  const itensFiltrados = useMemo(() => {
    let lista = [...itens];

    if (categoriaFiltro !== "Todas") {
      lista = lista.filter((i) => i.categoria === categoriaFiltro);
    }

    if (anoFiltro !== "Todos") {
      lista = lista.filter((i) => (i.data || "").startsWith(anoFiltro));
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      lista = lista.filter(
        (i) =>
          (i.titulo || "").toLowerCase().includes(termo) ||
          (i.descricaoCurta || "").toLowerCase().includes(termo)
      );
    }

    return lista.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  }, [itens, busca, categoriaFiltro, anoFiltro]);

  const anos = useMemo(() => {
    const s = new Set(
      itens
        .map((i) => (i.data || "").slice(0, 4))
        .filter((a) => a && a.length === 4)
    );
    return Array.from(s).sort((a, b) => b.localeCompare(a));
  }, [itens]);

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-600">Carregando...</p>
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary-dark font-semibold">
              Galeria
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark">
              Gerenciar Galeria (Fotos e Vídeos)
            </h1>
            <p className="text-sm text-neutral-200 max-w-2xl">
              Atualize a galeria do Tabanez com fotos, vídeos e descrições de ações, eventos, visitas e fiscalizações.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setModo("grade")}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                modo === "grade"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-neutral-700 border-neutral-300"
              }`}
            >
              Grade
            </button>

            <button
              type="button"
              onClick={() => setModo("lista")}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                modo === "lista"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-neutral-700 border-neutral-300"
              }`}
            >
              Lista
            </button>

            <button
              type="button"
              onClick={adicionarItem}
              className="px-4 py-2 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-dark"
            >
              + Novo item
            </button>
          </div>
        </div>

        {/* ALERTAS */}
        {erro && (
          <p className="text-sm text-red-700 bg-red-100 px-3 py-2 rounded border border-red-300">
            {erro}
          </p>
        )}

        {sucesso && (
          <p className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded border border-green-300">
            {sucesso}
          </p>
        )}

        {/* FILTROS */}
        <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Buscar</label>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por título ou descrição..."
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Categoria</label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option value="Todas">Todas</option>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Ano</label>
            <select
              value={anoFiltro}
              onChange={(e) => setAnoFiltro(e.target.value)}
              className="w-full mt-1 border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option value="Todos">Todos</option>
              {anos.map((ano) => (
                <option key={ano}>{ano}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ============================
            MODO GRADE
        ============================= */}
        {modo === "grade" && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {itensFiltrados.map((item) => {
              const realIndex = itens.findIndex((i) => i.id === item.id);
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(item.id)}
                  className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden group"
                >
                  {/* IMAGEM / VÍDEO */}
                  <div className="relative w-full pt-[65%] bg-neutral-900 overflow-hidden">
                    {item.imagem ? (
                      <img
                        src={item.imagem}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-800" />
                    )}

                    {item.video && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="text-white text-xl font-bold bg-black/70 px-3 py-1 rounded-md">
                          ▶
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CAMPOS */}
                  <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary-dark font-semibold uppercase tracking-wide">
                        {item.categoria}
                      </span>

                      <label className="text-[10px] flex items-center gap-1 text-gray-700">
                        <input
                          type="checkbox"
                          checked={item.publicado}
                          onChange={(e) =>
                            atualizar(item.id, "publicado", e.target.checked)
                          }
                        />
                        Publicado
                      </label>
                    </div>

                    <input
                      type="text"
                      value={item.titulo}
                      onChange={(e) => atualizar(item.id, "titulo", e.target.value)}
                      placeholder="Título"
                      className="w-full border border-gray-300 px-2 py-1.5 text-sm rounded-md"
                    />

                    <textarea
                      rows={2}
                      value={item.descricaoCurta}
                      onChange={(e) =>
                        atualizar(item.id, "descricaoCurta", e.target.value)
                      }
                      className="w-full border border-gray-300 px-2 py-1.5 text-sm rounded-md"
                      placeholder="Descrição curta"
                    />

                    {/* Upload */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-600">Imagem</label>

                      <input
                        type="file"
                        id={`galeria-upload-${realIndex}`}
                        className="hidden"
                        onChange={(e) =>
                          uploadArquivo(realIndex, e.target.files[0])
                        }
                      />

                      <button
                        type="button"
                        onClick={() => abrirUpload(realIndex)}
                        className="px-3 py-1.5 rounded-md bg-primary text-white text-xs"
                      >
                        {uploadingIndex === realIndex
                          ? "Enviando..."
                          : "Enviar imagem"}
                      </button>

                      <input
                        type="text"
                        value={item.imagem}
                        onChange={(e) =>
                          atualizar(item.id, "imagem", e.target.value)
                        }
                        placeholder="/galeria/arquivo.jpg"
                        className="w-full border border-gray-300 px-2 py-1.5 text-sm rounded-md"
                      />
                    </div>

                    {/* Video */}
                    <div>
                      <label className="text-xs text-gray-600">Vídeo (opcional)</label>
                      <input
                        type="text"
                        value={item.video}
                        onChange={(e) =>
                          atualizar(item.id, "video", e.target.value)
                        }
                        placeholder="URL do YouTube ou .mp4"
                        className="w-full border border-gray-300 px-2 py-1.5 text-sm rounded-md"
                      />
                    </div>

                    {/* AÇÕES */}
                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => duplicarItem(item.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        Duplicar
                      </button>

                      <button
                        type="button"
                        onClick={() => removerItem(item.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================
            MODO LISTA (tabela)
        ============================= */}
        {modo === "lista" && (
          <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-100 border-b">
                <tr>
                  <th className="px-3 py-2 text-left">Ordem</th>
                  <th className="px-3 py-2 text-left">Miniatura</th>
                  <th className="px-3 py-2 text-left">Título</th>
                  <th className="px-3 py-2 text-left">Categoria</th>
                  <th className="px-3 py-2 text-left">Data</th>
                  <th className="px-3 py-2 text-left">Publicado</th>
                  <th className="px-3 py-2 text-left">Ações</th>
                </tr>
              </thead>

              <tbody>
                {itensFiltrados.map((item) => {
                  const realIndex = itens.findIndex((i) => i.id === item.id);
                  return (
                    <tr
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(item.id)}
                      className="border-b hover:bg-neutral-50"
                    >
                      <td className="px-3 py-2">{item.ordem}</td>

                      <td className="px-3 py-2">
                        {item.imagem ? (
                          <img
                            src={item.imagem}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-neutral-300 rounded" />
                        )}
                      </td>

                      <td className="px-3 py-2">{item.titulo}</td>

                      <td className="px-3 py-2">{item.categoria}</td>

                      <td className="px-3 py-2">{item.data}</td>

                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={item.publicado}
                          onChange={(e) =>
                            atualizar(item.id, "publicado", e.target.checked)
                          }
                        />
                      </td>

                      <td className="px-3 py-2 space-x-3">
                        <button
                          onClick={() => duplicarItem(item.id)}
                          className="text-primary text-xs hover:underline"
                        >
                          Duplicar
                        </button>

                        <button
                          onClick={() => removerItem(item.id)}
                          className="text-red-600 text-xs hover:underline"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* BOTÃO SALVAR */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={salvar}
            className="px-5 py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark"
          >
            Salvar galeria
          </button>
        </div>
      </div>
    </div>
  );
}
