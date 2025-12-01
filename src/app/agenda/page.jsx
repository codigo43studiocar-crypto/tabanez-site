"use client";

import { useEffect, useState } from "react";

export default function AgendaPublica() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch("/api/agenda");
        if (!res.ok) {
          throw new Error("Falha ao carregar eventos");
        }
        const dados = await res.json();
        setEventos(dados || []);
      } catch (e) {
        console.error(e);
        setErro("Não foi possível carregar a agenda neste momento.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  return (
    <div className="w-full">
      {/* HERO DA AGENDA */}
      <section className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-10 md:py-14">
        <div className="section">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Agenda de Tabanez
          </h1>
          <p className="mt-3 text-sm md:text-base max-w-2xl text-gray-100">
            Acompanhe os próximos compromissos, visitas e ações de Tabanez em todo o Distrito Federal.
          </p>
        </div>
      </section>

      {/* LISTA DE EVENTOS */}
      <section className="section py-10 md:py-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Próximos compromissos
        </h2>

        {carregando && (
          <p className="text-sm text-gray-600">Carregando agenda...</p>
        )}

        {erro && !carregando && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded mb-4">
            {erro}
          </p>
        )}

        {!carregando && !erro && eventos.length === 0 && (
          <p className="text-sm text-gray-600">
            Nenhum compromisso cadastrado no momento. A agenda será atualizada em breve.
          </p>
        )}

        {!carregando && !erro && eventos.length > 0 && (
          <div className="space-y-4">
            {eventos
              .slice()
              .sort((a, b) => (a.data || "").localeCompare(b.data || ""))
              .map((evento) => (
                <article
                  key={evento.id}
                  className="bg-white rounded-card shadow-card border border-gray-100 p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {evento.titulo}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {evento.data}{" "}
                      {evento.hora && `às ${evento.hora}`} •{" "}
                      {evento.local || "Local a definir"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {evento.categoria && `Categoria: ${evento.categoria} • `}
                      Status: {evento.status || "Agendado"}
                    </p>
                    {evento.descricao && (
                      <p className="text-xs text-gray-700 mt-2">
                        {evento.descricao}
                      </p>
                    )}
                  </div>
                </article>
              ))}
          </div>
        )}

        <div className="mt-10 bg-green-50 border border-primary/20 rounded-card px-5 py-4 md:px-6">
          <p className="text-sm md:text-base text-gray-800">
            A agenda é atualizada diretamente pela equipe de Tabanez. Novos compromissos podem ser incluídos a qualquer momento conforme a demanda das comunidades do Distrito Federal.
          </p>
        </div>
      </section>
    </div>
  );
}
