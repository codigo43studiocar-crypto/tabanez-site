// src/app/admin/agenda/page.jsx
"use client";

import { useEffect, useState } from "react";

const STATUS_OPCOES = ["Agendado", "Concluído", "Cancelado"];

export default function AdminAgendaPage() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    data: "",
    hora: "",
    local: "",
    categoria: "",
    status: "Agendado",
    descricao: "",
  });

  async function carregarEventos() {
    setCarregando(true);
    try {
      const res = await fetch("/api/agenda", { cache: "no-store" });
      const dados = await res.json();
      setEventos(dados || []);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar agenda.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarEventos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function limparForm() {
    setEditandoId(null);
    setForm({
      titulo: "",
      data: "",
      hora: "",
      local: "",
      categoria: "",
      status: "Agendado",
      descricao: "",
    });
  }

  async function salvarEvento(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const metodo = editandoId ? "PUT" : "POST";
      const body = { ...form, id: editandoId };

      const res = await fetch("/api/agenda", {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Erro ao salvar.");
        return;
      }

      await carregarEventos();
      limparForm();
    } catch (e) {
      console.error(e);
      setErro("Erro de comunicação com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  function editarEvento(evt) {
    setEditandoId(evt.id);
    setForm({
      titulo: evt.titulo || "",
      data: evt.data || "",
      hora: evt.hora || "",
      local: evt.local || "",
      categoria: evt.categoria || "",
      status: evt.status || "Agendado",
      descricao: evt.descricao || "",
    });
  }

  async function excluirEvento(id) {
    if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      const res = await fetch("/api/agenda", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setEventos((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (e) {
      console.error(e);
      setErro("Erro ao excluir evento.");
    }
  }

  return (
    <div className="space-y-6 text-neutral-50">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">
          Agenda
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Agenda – Administração
        </h1>
        <p className="text-sm text-neutral-300 max-w-2xl">
          Aqui você pode adicionar, editar e excluir os compromissos de Tabanez.
        </p>
      </header>

      {/* FORMULÁRIO */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-neutral-50">
          {editandoId ? "Editar evento" : "Novo evento"}
        </h2>

        {erro && (
          <p className="mb-3 text-sm text-red-300 bg-red-950/50 border border-red-700 px-3 py-2 rounded-lg">
            {erro}
          </p>
        )}

        <form
          onSubmit={salvarEvento}
          className="grid gap-4 md:grid-cols-2 text-neutral-900"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-800">
              Título
            </label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Data
            </label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Hora
            </label>
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Local
            </label>
            <input
              type="text"
              name="local"
              value={form.local}
              onChange={handleChange}
              className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Categoria
            </label>
            <input
              type="text"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Saúde, Segurança, Social..."
              className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white placeholder:text-neutral-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              {STATUS_OPCOES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-800">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">
            <button
              type="submit"
              disabled={salvando}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md text-sm font-semibold hover:bg-emerald-400 disabled:opacity-60"
            >
              {salvando
                ? "Salvando..."
                : editandoId
                ? "Salvar alterações"
                : "Adicionar evento"}
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={limparForm}
                className="px-4 py-2 border border-neutral-400 text-neutral-100 rounded-md text-sm hover:bg-neutral-800"
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </section>

      {/* LISTA */}
      <section className="bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Eventos cadastrados
        </h2>

        {carregando ? (
          <p className="text-sm text-neutral-300">Carregando eventos...</p>
        ) : eventos.length === 0 ? (
          <p className="text-sm text-neutral-300">Nenhum evento cadastrado.</p>
        ) : (
          <div className="space-y-3">
            {eventos
              .slice()
              .sort((a, b) => (a.data || "").localeCompare(b.data || ""))
              .map((evt) => (
                <div
                  key={evt.id}
                  className="border border-neutral-700 rounded-md px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-neutral-950/80"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-50">
                      {evt.titulo}
                    </p>
                    <p className="text-xs text-neutral-300 mt-1">
                      {evt.data} {evt.hora && `às ${evt.hora}`} •{" "}
                      {evt.local || "Local a definir"}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {evt.categoria && `Categoria: ${evt.categoria} • `}
                      Status: {evt.status}
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => editarEvento(evt)}
                      className="px-3 py-1 border border-emerald-400 text-emerald-300 rounded-md hover:bg-emerald-500/10"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirEvento(evt.id)}
                      className="px-3 py-1 border border-red-500 text-red-400 rounded-md hover:bg-red-500/10"
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
  );
}