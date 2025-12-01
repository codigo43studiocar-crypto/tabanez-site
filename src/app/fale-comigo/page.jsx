"use client";

import { useState } from "react";

export default function FaleComigoPage() {
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setOk(false);

    // Aqui no futuro podemos chamar uma API para enviar e-mail ou gravar em banco
    await new Promise((r) => setTimeout(r, 800));

    setEnviando(false);
    setOk(true);
    e.target.reset();
  }

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="w-full bg-neutral-900 text-white py-10 md:py-14">
        <div className="section">
          <h1 className="text-3xl md:text-5xl font-extrabold">Fale comigo</h1>
          <p className="text-base md:text-lg mt-2 text-gray-200 max-w-2xl">
            Envie sua mensagem, sugestão ou demanda. A equipe do Tabanez lê
            todas as mensagens com atenção.
          </p>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section className="section py-8 md:py-10">
        <div className="grid md:grid-cols-[minmax(0,3fr),minmax(0,2fr)] gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-card shadow-card border border-gray-100 p-5 space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  name="nome"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  WhatsApp / Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  name="assunto"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                name="mensagem"
                rows={5}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="submit"
                disabled={enviando}
                className="px-6 py-2.5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60"
              >
                {enviando ? "Enviando..." : "Enviar mensagem"}
              </button>

              {ok && (
                <p className="text-xs text-green-700">
                  Mensagem enviada com sucesso! Obrigado pelo contato.
                </p>
              )}
            </div>
          </form>

          {/* LADO DIREITO: CONTATOS RÁPIDOS */}
          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-white rounded-card shadow-card border border-gray-100 p-4">
              <h2 className="text-base font-semibold text-neutral-900 mb-2">
                Canais oficiais
              </h2>
              <p className="text-sm text-gray-700 mb-2">
                Você também pode falar com a equipe pelos canais abaixo:
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  📱 WhatsApp:{" "}
                  <span className="font-semibold">(61)99281-5222</span>
                </li>
                <li>
                  📧 E-mail:{" "}
                  <span className="font-semibold">contato@tabanez.com.br</span>
                </li>
                <li>
                  📸 Instagram:{" "}
                  <a
                    href="https://instagram.com/tabanezdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @tabanezdf
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-card shadow-card border border-gray-100 p-4">
              <h2 className="text-base font-semibold text-neutral-900 mb-2">
                Como a equipe usa suas mensagens
              </h2>
              <p className="text-sm text-gray-700">
                As mensagens recebidas ajudam a equipe do Tabanez a mapear
                demandas, sugestões e problemas nas cidades, contribuindo para
                organizar visitas, ações sociais e propostas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
