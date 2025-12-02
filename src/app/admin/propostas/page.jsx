"use client";

import { useEffect, useState } from "react";

export default function AdminPropostasPage() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    subtitulo: "",
    categoria: "",
    prioridade: "Média",
    destaque: false,
    publicado: true,
    bullets: [""],
  });

  async function carregar() {
    setLoading(true);
    try {
      const res = await fetch("/api/propostas");
      const dados = await res.json();
      setLista(dados || []);
    } catch {
      setErro("Erro ao carregar propostas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("bullet_")) {
      const index = Number(name.replace("bullet_", ""));
      setForm((prev) => {
        const novos = [...prev.bullets];
        novos[index] = value;
        return { ...prev, bullets: novos };
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function addBullet() {
    setForm((prev) => ({ ...prev, bullets: [...prev.bullets, ""] }));
  }

  function removeBullet(i) {
    setForm((prev) => ({
      ...prev,
      bullets: prev.bullets.filter((_, idx) => idx !== i),
    }));
  }

  function limpar() {
    setEditandoId(null);
    setForm({
      titulo: "",
      subtitulo: "",
      categoria: "",
      prioridade: "Média",
      destaque: false,
      publicado: true,
      bullets: [""],
    });
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const metodo = editandoId ? "PUT" : "POST";
      const body = { ...form, id: editandoId };

      const res = await fetch("/api/propostas", {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Erro ao salvar proposta.");
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
      prioridade: item.prioridade || "Média",
      destaque: item.destaque || false,
      publicado: item.publicado !== false,
      bullets: item.bullets?.length ? item.bullets : [""],
    });
  }

  async function excluir(id) {
    if (!window.confirm("Deseja realmente excluir esta proposta?")) return;

    try {
      const res = await fetch("/api/propostas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setLista((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      setErro("Erro ao excluir proposta.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* TÍTULO */}
        <header>
          <h1 className="text-3xl font-bold">Propostas – Administração</h1>
          <p className="text-gray-300 mt-1">
            Adicione, edite e organize as propostas do Tabanez.
          </p>
        </header>

        {/* FORMULÁRIO */}
        <section className="bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editandoId ? "Editar Proposta" : "Nova Proposta"}
          </h2>

          {erro && (
            <p className="text-sm mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Categoria</label>
              <input
                type="text"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                placeholder="Segurança, Social..."
              />
            </div>

            <div>
              <label className="text-sm font-medium">Prioridade</label>
              <select
                name="prioridade"
                value={form.prioridade}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              >
                <option>Alta</option>
                <option>Média</option>
                <option>Baixa</option>
              </select>
            </div>

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

            {/* BULLETS */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-medium">Tópicos (bullets)</label>

              {form.bullets.map((b, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    name={`bullet_${idx}`}
                    value={b}
                    onChange={handleChange}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    placeholder={`Tópico ${idx + 1}`}
                  />
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removeBullet(idx)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addBullet}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                + Adicionar tópico
              </button>
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
                  : "Adicionar proposta"}
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
          <h2 className="text-xl font-semibold mb-4">Propostas cadastradas</h2>

          {loading ? (
            <p className="text-neutral-700">Carregando...</p>
          ) : lista.length === 0 ? (
            <p className="text-neutral-700">Nenhuma proposta cadastrada.</p>
          ) : (
            <div className="space-y-3">
              {lista.map((p) => (
                <div
                  key={p.id}
                  className="border border-gray-200 rounded-lg bg-white p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{p.titulo}</p>
                    <p className="text-xs text-neutral-600">{p.categoria}</p>
                    {p.destaque && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded mt-1 inline-block">
                        Destaque
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 text-xs mt-2 md:mt-0">
                    <button
                      onClick={() => editar(p)}
                      className="px-3 py-1 border border-primary text-primary rounded-md hover:bg-primary/10"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => excluir(p.id)}
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