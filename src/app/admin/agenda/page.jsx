"use client";

import { useEffect, useState } from "react";

const STATUS_OPCOES = ["Agendado", "Concluído", "Cancelado"];

export default function AdminAgendaPage() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    data: "",
    hora: "",
    local: "",
    categoria: "",
    status: "Agendado",
    descricao: "",
  });
  const [erro, setErro] = useState("");

  async function carregarEventos() {
    setCarregando(true);
    try {
      const res = await fetch("/api/agenda");
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
      const body = {
        ...form,
        id: editandoId,
      };

      const res = await fetch("/api/agenda", {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
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

<section className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 md:p-5 mb-4">
  <p className="text-[11px] text-gray-400 mb-1">
    Painel <span className="mx-1">›</span> Agenda
  </p>
  <h1 className="text-lg md:text-xl font-semibold mb-1">
    Agenda oficial
  </h1>
  <p className="text-sm text-gray-300">
    Cadastre, edite e acompanhe os compromissos do Tabanez.
  </p>
</section>

  return (
    
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold mb-1">Agenda – Administração</h1>
          <p className="text-gray-700 text-sm md:text-base">
            Aqui você pode adicionar, editar e excluir os compromissos de Tabanez.
          </p>
        </header>

        {/* FORMULÁRIO */}
        <section className="bg-white rounded-card shadow-card border border-gray-100 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            {editandoId ? "Editar evento" : "Novo evento"}
          </h2>

          {erro && (
            <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {erro}
            </p>
          )}

          <form onSubmit={salvarEvento} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data
              </label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hora
              </label>
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Local
              </label>
              <input
                type="text"
                name="local"
                value={form.local}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <input
                type="text"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                placeholder="Saúde, Segurança, Social..."
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {STATUS_OPCOES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={3}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3 mt-2">
              <button
                type="submit"
                disabled={salvando}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LISTA DE EVENTOS */}
        <section className="bg-white rounded-card shadow-card border border-gray-100 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Eventos cadastrados
          </h2>

          {carregando ? (
            <p className="text-sm text-gray-600">Carregando eventos...</p>
          ) : eventos.length === 0 ? (
            <p className="text-sm text-gray-600">Nenhum evento cadastrado.</p>
          ) : (
            <div className="space-y-3">
              {eventos
                .slice()
                .sort((a, b) => (a.data || "").localeCompare(b.data || ""))
                .map((evt) => (
                  <div
                    key={evt.id}
                    className="border border-gray-200 rounded-md px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {evt.titulo}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {evt.data} {evt.hora && `às ${evt.hora}`} •{" "}
                        {evt.local || "Local a definir"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {evt.categoria && `Categoria: ${evt.categoria} • `}
                        Status: {evt.status}
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => editarEvento(evt)}
                        className="px-3 py-1 border border-primary text-primary rounded-md hover:bg-primary/5"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirEvento(evt.id)}
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
