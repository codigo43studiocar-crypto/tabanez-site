"use client";

import { useEffect, useState } from "react";

export default function AdminConteudoPage() {
  const [conteudo, setConteudo] = useState({
    tituloHero: "",
    subtituloHero: "",
    introducaoBiografia: "",
    biografiaCompleta: "",
  });

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function carregarConteudo() {
    setCarregando(true);
    try {
      const res = await fetch("/api/conteudo");
      const dados = await res.json();
      setConteudo(dados || {});
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar conteúdo.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarConteudo();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setConteudo((prev) => ({ ...prev, [name]: value }));
  }

  async function salvarConteudo(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const res = await fetch("/api/conteudo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(conteudo),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Erro ao salvar conteúdo.");
        return;
      }

      setSucesso("Conteúdo salvo com sucesso!");
    } catch (e) {
      console.error(e);
      setErro("Erro de comunicação com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        <header>
          <h1 className="text-3xl font-bold mb-1">Conteúdo do Site</h1>
          <p className="text-gray-700 text-sm md:text-base">
            Gerencie os textos principais do site (Hero, Biografia etc.).
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          {erro && (
            <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="mb-3 text-sm text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded">
              {sucesso}
            </p>
          )}

          <form onSubmit={salvarConteudo} className="space-y-6">

            {/* HERO */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Hero – Página Inicial</h2>

              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                name="tituloHero"
                value={conteudo.tituloHero}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />

              <label className="block text-sm font-medium text-gray-700 mt-4">
                Subtítulo
              </label>
              <textarea
                name="subtituloHero"
                rows={2}
                value={conteudo.subtituloHero}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* INTRODUÇÃO BIOGRAFIA */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Biografia – Introdução</h2>

              <textarea
                name="introducaoBiografia"
                rows={3}
                value={conteudo.introducaoBiografia}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* BIOGRAFIA COMPLETA */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Biografia Completa</h2>

              <textarea
                name="biografiaCompleta"
                rows={10}
                value={conteudo.biografiaCompleta}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={salvando}
              className="px-5 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Salvar conteúdo"}
            </button>

          </form>
        </section>
      </div>
    </div>
  );
}