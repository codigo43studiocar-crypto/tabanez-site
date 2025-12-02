"use client";

import { useEffect, useState } from "react";

export default function AdminConteudoPage() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/conteudo", { cache: "no-store" });
        if (!res.ok) throw new Error();

        const json = await res.json();
        setDados(json || {});
      } catch {
        setErro("Erro ao carregar conteúdos.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function handleChange(secao, campo, valor) {
    setDados((prev) => ({
      ...prev,
      [secao]: {
        ...(prev?.[secao] || {}),
        [campo]: valor,
      },
    }));
  }

  async function salvar(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const res = await fetch("/api/conteudo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!res.ok) throw new Error();
      setSucesso("Conteúdo atualizado com sucesso!");
    } catch {
      setErro("Erro ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-200 p-6">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* TÍTULO DA PÁGINA */}
        <header>
          <h1 className="text-3xl font-bold mb-1">Editar textos principais</h1>
          <p className="text-gray-300">
            Ajuste os textos exibidos na página inicial, biografia e seções fixas.
          </p>
        </header>

        {/* FORMULÁRIO */}
        <form
          onSubmit={salvar}
          className="bg-neutral-800 border border-neutral-700 shadow-lg rounded-lg p-6 space-y-10"
        >

          {/* HERO */}
          <section>
            <h2 className="text-lg font-semibold text-accent-yellow mb-4">
              Hero – Página Inicial
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm">Título</label>
                <input
                  type="text"
                  value={dados?.home?.titulo || ""}
                  onChange={(e) =>
                    handleChange("home", "titulo", e.target.value)
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-neutral-100"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Subtítulo</label>
                <textarea
                  rows={3}
                  value={dados?.home?.subtitulo || ""}
                  onChange={(e) =>
                    handleChange("home", "subtitulo", e.target.value)
                  }
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-neutral-100"
                />
              </div>
            </div>
          </section>

          {/* BIOGRAFIA INTRO */}
          <section>
            <h2 className="text-lg font-semibold text-accent-yellow mb-4">
              Biografia – Introdução
            </h2>

            <textarea
              rows={3}
              value={dados?.biografia?.intro || ""}
              onChange={(e) =>
                handleChange("biografia", "intro", e.target.value)
              }
              className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-neutral-100"
            />
          </section>

          {/* BIO COMPLETA */}
          <section>
            <h2 className="text-lg font-semibold text-accent-yellow mb-4">
              Biografia Completa
            </h2>

            <textarea
              rows={6}
              value={dados?.biografia?.completa || ""}
              onChange={(e) =>
                handleChange("biografia", "completa", e.target.value)
              }
              className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-neutral-100"
            />
          </section>

          {/* MENSAGENS */}
          {erro && (
            <p className="text-red-400 bg-red-950 border border-red-800 px-3 py-2 rounded">
              {erro}
            </p>
          )}
          {sucesso && (
            <p className="text-green-400 bg-green-950 border border-green-800 px-3 py-2 rounded">
              {sucesso}
            </p>
          )}

          {/* BOTÃO SALVAR */}
          <button
            type="submit"
            disabled={salvando}
            className="px-6 py-2 bg-accent-yellow text-black font-semibold rounded-md hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}