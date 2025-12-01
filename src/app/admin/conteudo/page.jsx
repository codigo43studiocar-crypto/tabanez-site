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
        setDados(json);
      } catch {
        setErro("Erro ao carregar conteúdo.");
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

  function handleHomeChange(campo, valor) {
    setDados((prev) => ({
      ...prev,
      home: {
        ...(prev?.home || {}),
        [campo]: valor,
      },
    }));
  }

  function handleCardChange(bloco, index, campo, valor) {
    setDados((prev) => {
      const anterior = prev || {};
      const home = anterior.home || {};
      const secao = home[bloco] || {};
      const cardsOrig = secao.cards || [];
      const cards = [...cardsOrig];

      while (cards.length < 3) cards.push({ titulo: "", texto: "" });

      const cardAtual = { ...(cards[index] || {}) };
      cardAtual[campo] = valor;
      cards[index] = cardAtual;

      return {
        ...anterior,
        home: {
          ...home,
          [bloco]: {
            ...secao,
            cards,
          },
        },
      };
    });
  }

  function handleBioSecaoChange(index, campo, valor) {
    setDados((prev) => {
      const anterior = prev || {};
      const bio = anterior.biografia || {};
      const secoesOrig = bio.secoes || [];
      const secoes = [...secoesOrig];

      while (secoes.length <= index) {
        secoes.push({ id: `secao-${secoes.length + 1}`, titulo: "", texto: "" });
      }

      const secaoAtual = { ...(secoes[index] || {}) };
      secaoAtual[campo] = valor;
      secoes[index] = secaoAtual;

      return {
        ...anterior,
        biografia: {
          ...bio,
          secoes,
        },
      };
    });
  }

  function handlePropostaSecaoChange(index, campo, valor) {
    setDados((prev) => {
      const anterior = prev || {};
      const props = anterior.propostas || {};
      const secoesOrig = props.secoes || [];
      const secoes = [...secoesOrig];

      while (secoes.length <= index) {
        secoes.push({
          id: `secao-${secoes.length + 1}`,
          titulo: "",
          intro: "",
        });
      }

      const secaoAtual = { ...(secoes[index] || {}) };
      secaoAtual[campo] = valor;
      secoes[index] = secaoAtual;

      return {
        ...anterior,
        propostas: {
          ...props,
          secoes,
        },
      };
    });
  }

  async function salvar(e) {
    e.preventDefault();
    if (!dados) return;

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

      const json = await res.json();
      setDados(json);
      setSucesso("Conteúdo atualizado com sucesso.");
    } catch {
      setErro("Erro ao salvar conteúdo.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-600">Carregando conteúdo...</p>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-600">
          Não foi possível carregar os dados.
        </p>
      </div>
    );
  }

  const trajetoria = dados.home?.trajetoria || {};
  const trajetoriaCards = trajetoria.cards || [];
  const acoes = dados.home?.acoes || {};
  const acoesCards = acoes.cards || [];
  const bioSecoes = dados.biografia?.secoes || [];
  const propostasSecoes = dados.propostas?.secoes || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-dark">
            Conteúdo do site
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-dark">
            Editar textos principais
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl">
            Ajuste os textos exibidos na página inicial, biografia e propostas
            sem precisar alterar o código.
          </p>
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

        <form onSubmit={salvar} className="space-y-6">
          {/* HOME - HERO */}
          <section className="bg-white rounded-card shadow-card border border-gray-100 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold">
                Página inicial (hero)
              </h2>
              <span className="text-xs text-gray-500">/ (topo do site)</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Linha pequena (acima do título)
                </label>
                <input
                  type="text"
                  value={dados.home?.badge || ""}
                  onChange={(e) => handleHomeChange("badge", e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título principal
                </label>
                <input
                  type="text"
                  value={dados.home?.titulo || ""}
                  onChange={(e) => handleHomeChange("titulo", e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subtítulo
              </label>
              <textarea
                value={dados.home?.subtitulo || ""}
                onChange={(e) =>
                  handleHomeChange("subtitulo", e.target.value)
                }
                rows={3}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </section>

          {/* HOME - BLOCO TRAJETÓRIA */}
          <section className="bg-white rounded-card shadow-card border border-gray-100 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold">
                Home – Bloco "Uma trajetória..."
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título do bloco
              </label>
              <input
                type="text"
                value={trajetoria.titulo || ""}
                onChange={(e) =>
                  handleHomeChange("trajetoria", {
                    ...trajetoria,
                    titulo: e.target.value,
                  })
                }
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => {
                const card = trajetoriaCards[index] || {};
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-3 space-y-2"
                  >
                    <p className="text-xs font-semibold text-gray-500">
                      Card {index + 1}
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Título
                      </label>
                      <input
                        type="text"
                        value={card.titulo || ""}
                        onChange={(e) =>
                          handleCardChange(
                            "trajetoria",
                            index,
                            "titulo",
                            e.target.value
                          )
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Texto
                      </label>
                      <textarea
                        rows={3}
                        value={card.texto || ""}
                        onChange={(e) =>
                          handleCardChange(
                            "trajetoria",
                            index,
                            "texto",
                            e.target.value
                          )
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* HOME - BLOCO ÚLTIMAS AÇÕES */}
          <section className="bg-white rounded-card shadow-card border border-gray-100 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold">
                Home – Bloco "Últimas ações"
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título do bloco
              </label>
              <input
                type="text"
                value={acoes.titulo || ""}
                onChange={(e) =>
                  handleHomeChange("acoes", {
                    ...acoes,
                    titulo: e.target.value,
                  })
                }
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => {
                const card = acoesCards[index] || {};
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-3 space-y-2"
                  >
                    <p className="text-xs font-semibold text-gray-500">
                      Card {index + 1}
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Título
                      </label>
                      <input
                        type="text"
                        value={card.titulo || ""}
                        onChange={(e) =>
                          handleCardChange(
                            "acoes",
                            index,
                            "titulo",
                            e.target.value
                          )
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Texto
                      </label>
                      <textarea
                        rows={3}
                        value={card.texto || ""}
                        onChange={(e) =>
                          handleCardChange(
                            "acoes",
                            index,
                            "texto",
                            e.target.value
                          )
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* BIOGRAFIA – CABEÇALHO */}
          <section className="bg-white rounded-card shadow-card border border-gray-100 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold">Biografia</h2>
              <span className="text-xs text-gray-500">/biografia</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título da página
                </label>
                <input
                  type="text"
                  value={dados.biografia?.titulo || ""}
                  onChange={(e) =>
                    handleChange("biografia", "titulo", e.target.value)
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Introdução (parágrafo inicial)
                </label>
                <textarea
                  value={dados.biografia?.introducao || ""}
                  onChange={(e) =>
                    handleChange("biografia", "introducao", e.target.value)
                  }
                  rows={4}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          {/* BIOGRAFIA – CAPÍTULOS */}
          <section className="bg-white rounded-card shadow-card border border-gray-100 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold">
                Biografia – capítulos
              </h2>
              <span className="text-xs text-gray-500">
                blocos principais da trajetória
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
                const secao = bioSecoes[index] || {};
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-3 space-y-2"
                  >
                    <p className="text-xs font-semibold text-gray-500">
                      Capítulo {index + 1}
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Título do capítulo
                      </label>
                      <input
                        type="text"
                        value={secao.titulo || ""}
                        onChange={(e) =>
                          handleBioSecaoChange(
                            index,
                            "titulo",
                            e.target.value
                          )
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Texto do capítulo
                      </label>
                      <textarea
                        rows={4}
                        value={secao.texto || ""}
                        onChange={(e) =>
                          handleBioSecaoChange(index, "texto", e.target.value)
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* PROPOSTAS – HERO */}
          <section className="bg-white rounded-card shadow-card border border-gray-100 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold">Propostas</h2>
              <span className="text-xs text-gray-500">/propostas</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título da seção
                </label>
                <input
                  type="text"
                  value={dados.propostas?.titulo || ""}
                  onChange={(e) =>
                    handleChange("propostas", "titulo", e.target.value)
                  }
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subtítulo (texto abaixo do título)
                </label>
                <textarea
                  value={dados.propostas?.subtitulo || ""}
                  onChange={(e) =>
                    handleChange("propostas", "subtitulo", e.target.value)
                  }
                  rows={3}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          {/* PROPOSTAS – CAPÍTULOS */}
          <section className="bg-white rounded-card shadow-card border border-gray-100 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg md:text-xl font-semibold">
                Propostas – capítulos
              </h2>
              <span className="text-xs text-gray-500">
                títulos e textos introdutórios de cada área
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[0, 1, 2, 3, 4, 5, 6].map((index) => {
                const secao = propostasSecoes[index] || {};
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-3 space-y-2"
                  >
                    <p className="text-xs font-semibold text-gray-500">
                      Área {index + 1}
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Título da área
                      </label>
                      <input
                        type="text"
                        value={secao.titulo || ""}
                        onChange={(e) =>
                          handlePropostaSecaoChange(
                            index,
                            "titulo",
                            e.target.value
                          )
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Texto introdutório
                      </label>
                      <textarea
                        rows={4}
                        value={secao.intro || ""}
                        onChange={(e) =>
                          handlePropostaSecaoChange(
                            index,
                            "intro",
                            e.target.value
                          )
                        }
                        className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={salvando}
              className="px-5 py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
