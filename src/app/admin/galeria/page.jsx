"use client";

import { useEffect, useState } from "react";

const TIPOS_MIDIA = ["foto", "video"];

export default function AdminGaleriaPage() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    tipo: "foto", // foto ou video
    categoria: "",
    data: "",
    urlMidia: "",
    descricao: "",
    destaque: false,
    publicado: true,
  });

  async function carregar() {
    setCarregando(true);
    try {
      const res = await fetch("/api/galeria");
      const dados = await res.json();
      setItens(dados || []);
    } catch {
      setErro("Erro ao carregar galeria.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function limpar() {
    setEditandoId(null);
    setForm({
      titulo: "",
      tipo: "foto",
      categoria: "",
      data: "",
      urlMidia: "",
      descricao: "",
      destaque: false,
      publicado: true,
    });
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const metodo = editandoId ? "PUT" : "POST";
      const body = { ...form, id: editandoId };

      const res = await fetch("/api/galeria", {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErro(d.error || "Erro ao salvar item da galeria.");
        return;
      }

      await carregar();
      limpar();
    } catch {
      setErro("Erro ao comunicar com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  function editar(item) {
    setEditandoId(item.id);
    setForm({
      titulo: item.titulo || "",
      tipo: item.tipo || "foto",
      categoria: item.categoria || "",
      data: item.data || "",
      urlMidia: item.urlMidia || item.url || "",
      descricao: item.descricao || "",
      destaque: item.destaque || false,
      publicado: item.publicado !== false,
    });
  }

  async function excluir(id) {
    if (!window.confirm("Excluir este item da galeria?")) return;

    try {
      const res = await fetch("/api/galeria", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setItens((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      setErro("Erro ao excluir item.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* TÍTULO */}
        <header>
          <h1 className="text-3xl font-bold">Galeria – Administração</h1>
          <p className="text-gray-300 mt-1">
            Gerencie as fotos e vídeos que aparecem na galeria do site.
          </p>
        </header>

        {/* FORMULÁRIO */}
        <section className="bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editandoId ? "Editar item da galeria" : "Novo item da galeria"}
          </h2>

          {erro && (
            <p className="text-sm bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded mb-3">
              {erro}
            </p>
          )}

          <form onSubmit={salvar} className="grid gap-4 md:grid-cols-2">
            {/* TÍTULO */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Título</label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* TIPO */}
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              >
                {TIPOS_MIDIA.map((t) => (
                  <option key={t} value={t}>
                    {t === "foto" ? "Foto" : "Vídeo"}
                  </option>
                ))}
              </select>
            </div>

            {/* CATEGORIA */}
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <input
                type="text"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="Evento, Ação social..."
              />
            </div>

            {/* DATA */}
            <div>
              <label className="text-sm font-medium">Data</label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* PUBLICADO */}
            <div>
              <label className="text-sm font-medium">Publicado</label>
              <input
                type="checkbox"
                name="publicado"
                checked={form.publicado}
                onChange={handleChange}
                className="ml-2"
              />
            </div>

            {/* DESTAQUE */}
            <div>
              <label className="text-sm font-medium">Destaque</label>
              <input
                type="checkbox"
                name="destaque"
                checked={form.destaque}
                onChange={handleChange}
                className="ml-2"
              />
            </div>

            {/* URL MÍDIA */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">
                URL da mídia (imagem ou vídeo)
              </label>
              <input
                type="text"
                name="urlMidia"
                value={form.urlMidia}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://..."
              />
            </div>

            {/* DESCRIÇÃO */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Descrição (opcional)</label>
              <textarea
                name="descricao"
                rows={3}
                value={form.descricao}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* BOTÕES */}
            <div className="md:col-span-2 flex gap-3 mt-4">
              <button
                type="submit"
                disabled={salvando}
                className="px-4 py-2 bg-primary text-white rounded-md font-semibold"
              >
                {salvando
                  ? "Salvando..."
                  : editandoId
                  ? "Salvar alterações"
                  : "Adicionar item"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  onClick={limpar}
                  className="px-4 py-2 border border-gray-400 rounded-md"
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LISTA */}
        <section className="bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Itens cadastrados</h2>

          {carregando ? (
            <p className="text-neutral-700">Carregando...</p>
          ) : itens.length === 0 ? (
            <p className="text-neutral-700">Nenhum item na galeria ainda.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {itens.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 bg-white rounded-lg p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {item.titulo}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {item.categoria} {item.data && `• ${item.data}`}
                      </p>
                    </div>
                    {item.destaque && (
                      <span className="text-[10px] px-2 py-1 rounded bg-yellow-200 text-yellow-800 font-semibold">
                        Destaque
                      </span>
                    )}
                  </div>

                  {item.urlMidia || item.url ? (
                    <div className="mt-1">
                      {item.tipo === "video" ? (
                        <p className="text-xs text-neutral-600 break-all">
                          🎥 Vídeo: {item.urlMidia || item.url}
                        </p>
                      ) : (
                        <img
                          src={item.urlMidia || item.url}
                          alt={item.titulo}
                          className="w-full h-32 object-cover rounded-md border border-gray-200"
                        />
                      )}
                    </div>
                  ) : null}

                  {item.descricao && (
                    <p className="text-xs text-neutral-700 line-clamp-3">
                      {item.descricao}
                    </p>
                  )}

                  <div className="flex gap-2 text-xs mt-2">
                    <button
                      onClick={() => editar(item)}
                      className="px-3 py-1 border border-primary text-primary rounded-md hover:bg-primary/10"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluir(item.id)}
                      className="px-3 py-1 border border-red-500 text-red-600 rounded-md hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}