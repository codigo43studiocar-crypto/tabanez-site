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
      <div className="min-h-screen bg-[#0b0f19] text-white p-6">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* TÍTULO */}
        <header>
          <h1 className="text-3xl font-bold mb-1">Textos principais do site</h1>
          <p className="text-gray-300 text-sm md:text-base">
            Ajuste aqui os textos da página inicial e da biografia que aparecem para o público.
          </p>
        </header>

        {/* FORM GERAL */}
        <section className="bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Conteúdos fixos
          </h2>

          {erro && (
            <p className="text-sm mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {erro}
            </p>
          )}
          {sucesso && (
            <p className="text-sm mb-3 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded">
              {sucesso}
            </p>
          )}

          <form onSubmit={salvar} className="space-y-8">
            {/* HERO HOME */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Hero – Página inicial
              </h3>

              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Título principal
                </label>
                <input
                  type="text"
                  value={dados?.home?.titulo || ""}
                  onChange={(e) =>
                    handleChange("home", "titulo", e.target.value)
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ex.: TABANEZ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Subtítulo (frase de impacto)
                </label>
                <textarea
                  rows={3}
                  value={dados?.home?.subtitulo || ""}
                  onChange={(e) =>
                    handleChange("home", "subtitulo", e.target.value)
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ex.: Trabalho incansável pelo Distrito Federal..."
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* BIOGRAFIA INTRO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Biografia – Introdução
              </h3>

              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Parágrafo inicial da biografia
                </label>
                <textarea
                  rows={4}
                  value={dados?.biografia?.intro || ""}
                  onChange={(e) =>
                    handleChange("biografia", "intro", e.target.value)
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Resumo inicial sobre quem é o Tabanez..."
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* BIO COMPLETA */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Biografia – Texto completo
              </h3>

              <div>
                <label className="block text-sm font-medium text-neutral-800">
                  Biografia completa
                </label>
                <textarea
                  rows={8}
                  value={dados?.biografia?.completa || ""}
                  onChange={(e) =>
                    handleChange("biografia", "completa", e.target.value)
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Texto longo com a trajetória, história, conquistas..."
                />
              </div>
            </div>

            {/* BOTÃO SALVAR */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={salvando}
                className="px-5 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}