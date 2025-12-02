"use client";

import { useEffect, useState } from "react";

export default function AdminImprensaPage() {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    subtitulo: "",
    categoria: "",
    data: "",
    publicado: true,
    imagem: "",
    texto: "",
  });

  async function carregar() {
    setCarregando(true);
    try {
      const res = await fetch("/api/imprensa");
      const dados = await res.json();
      setLista(dados || []);
    } catch {
      setErro("Erro ao carregar releases.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function limpar() {
    setEditandoId(null);
    setForm({
      titulo: "",
      subtitulo: "",
      categoria: "",
      data: "",
      publicado: true,
      imagem: "",
      texto: "",
    });
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const metodo = editandoId ? "PUT" : "POST";
      const body = { ...form, id: editandoId };

      const res = await fetch("/api/imprensa", {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErro(d.error || "Erro ao salvar.");
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
      subtitulo: item.subtitulo || "",
      categoria: item.categoria || "",
      data: item.data || "",
      publicado: item.publicado !== false,
      imagem: item.imagem || "",
      texto: item.texto || "",
    });
  }

  async function excluir(id) {
    if (!window.confirm("Excluir este release?")) return;

    try {
      const res = await fetch("/api/imprensa", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setLista((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      setErro("Erro ao excluir.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* TÍTULO */}
        <header>
          <h1 className="text-3xl font-bold">Imprensa – Administração</h1>
          <p className="text-gray-300 mt-1">
            Cadastre releases oficiais, matérias e comunicados.
          </p>
        </header>

        {/* FORM */}
        <section className="bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editandoId ? "Editar Release" : "Novo Release"}
          </h2>

          {erro && (
            <p className="text-sm bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded mb-3">
              {erro}
            </p>
          )}

          <form onSubmit={salvar} className="grid gap-4 md:grid-cols-2">

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

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Subtítulo</label>
              <input
                type="text"
                name="subtitulo"
                value={form.subtitulo}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Categoria</label>
              <input
                type="text"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ação social, Evento..."
              />
            </div>

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

            <div>
              <label className="text-sm font-medium">Imagem (URL)</label>
              <input
                type="text"
                name="imagem"
                value={form.imagem}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Texto da matéria</label>
              <textarea
                name="texto"
                value={form.texto}
                onChange={handleChange}
                rows={5}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="Digite a matéria completa aqui..."
              />
            </div>

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
                  : "Adicionar release"}
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
          <h2 className="text-xl font-semibold mb-4">Releases cadastrados</h2>

          {carregando ? (
            <p className="text-neutral-700">Carregando...</p>
          ) : lista.length === 0 ? (
            <p className="text-neutral-700">Nenhum release cadastrado.</p>
          ) : (
            <div className="space-y-3">
              {lista.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 bg-white rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-neutral-900">{item.titulo}</p>
                    <p className="text-xs text-neutral-600">{item.categoria}</p>

                    {item.data && (
                      <p className="text-xs text-neutral-600">📅 {item.data}</p>
                    )}
                  </div>

                  <div className="flex gap-2 text-xs mt-3 md:mt-0">
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