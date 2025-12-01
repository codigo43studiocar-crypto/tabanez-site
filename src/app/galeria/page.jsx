"use client";

import { useEffect, useMemo, useState } from "react";

function criarDataObj(dataStr) {
  if (!dataStr) return null;
  const d = new Date(`${dataStr}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

function formatarData(dataStr) {
  if (!dataStr) return "";
  const [y, m, d] = dataStr.split("-");
  return `${d}/${m}/${y}`;
}

function youtubeEmbed(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export default function Galeria() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [ano, setAno] = useState("Todos");
  const [modal, setModal] = useState(null);
  const [soDestaque, setSoDestaque] = useState(false);

  // ========================
  // Carregar galeria
  // ========================
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/galeria", { cache: "no-store" });
        const json = await res.json();
        const lista = (json.itens || []).filter((i) => i.publicado);
        setItens(lista);
      } catch {
        setItens([]);
      } finally {
        setCarregando(false);
      }
    }
    load();
  }, []);

  // ========================
  // Registrar visualização
  // ========================
  async function abrir(item) {
    setModal(item);
    try {
      const res = await fetch("/api/galeria/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });

      if (!res.ok) return;

      const json = await res.json();
      if (typeof json.views === "number") {
        setItens((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, views: json.views } : i))
        );
        setModal((prev) =>
          prev && prev.id === item.id ? { ...prev, views: json.views } : prev
        );
      }
    } catch {
      // Ignora erros silenciosamente
    }
  }

  // ========================
  // Anos disponíveis
  // ========================
  const anos = useMemo(() => {
    const s = new Set(
      itens.map((i) => (i.data || "").slice(0, 4)).filter((a) => a && a.length === 4)
    );
    return Array.from(s).sort((a, b) => b.localeCompare(a));
  }, [itens]);

  // ========================
  // Categorias disponíveis
  // ========================
  const categorias = useMemo(() => {
    const s = new Set(itens.map((i) => i.categoria || "Outros"));
    return Array.from(s).sort();
  }, [itens]);

  // ========================
  // FILTROS
  // ========================
  const filtrados = useMemo(() => {
    let lista = itens.slice();

    if (soDestaque) lista = lista.filter((i) => i.destaque);

    if (categoria !== "Todas") lista = lista.filter((i) => i.categoria === categoria);

    if (ano !== "Todos") lista = lista.filter((i) => (i.data || "").startsWith(ano));

    if (busca.trim()) {
      const t = busca.toLowerCase();
      lista = lista.filter(
        (i) =>
          i.titulo.toLowerCase().includes(t) ||
          (i.descricaoCurta || "").toLowerCase().includes(t) ||
          (i.descricaoLonga || "").toLowerCase().includes(t)
      );
    }

    // Ordenação: destaque primeiro → data desc → ordem ASC
    return lista.sort((a, b) => {
      if (a.destaque && !b.destaque) return -1;
      if (!a.destaque && b.destaque) return 1;

      const da = criarDataObj(a.data);
      const db = criarDataObj(b.data);

      const ta = da ? da.getTime() : 0;
      const tb = db ? db.getTime() : 0;

      if (ta !== tb) return tb - ta;

      return (a.ordem || 0) - (b.ordem || 0);
    });
  }, [itens, busca, categoria, ano, soDestaque]);

  // ========================
  // MODAL DE MÍDIA
  // ========================
  function renderMidia(item) {
    const embed = youtubeEmbed(item.video);

    if (embed)
      return (
        <div className="relative pb-[56.25%] bg-black">
          <iframe
            src={embed}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          />
        </div>
      );

    if (item.video && item.video.endsWith(".mp4"))
      return (
        <video src={item.video} controls className="w-full max-h-[70vh] bg-black" />
      );

    if (item.imagem)
      return (
        <img
          src={item.imagem}
          alt={item.titulo}
          className="max-h-[70vh] w-full object-contain bg-black"
        />
      );

    return null;
  }

  return (
    <div className="w-full">
      {/* ============================
          HERO
      ============================ */}
      <section className="w-full bg-neutral-900 text-white py-10 md:py-14">
        <div className="section">
          <h1 className="text-3xl md:text-5xl font-extrabold">Galeria</h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mt-2">
            Fotos e vídeos das ações, visitas, eventos e fiscalizações do Tabanez pelo DF.
          </p>
        </div>
      </section>

      {/* ============================
          FILTROS
      ============================ */}
      <section className="section pt-8 pb-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <input
            type="text"
            placeholder="Buscar na galeria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option>Todas</option>
            {categorias.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option>Todos</option>
            {anos.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={soDestaque}
              onChange={(e) => setSoDestaque(e.target.checked)}
            />
            Destaques
          </label>
        </div>

        {/* GRID */}
        {carregando ? (
          <p className="text-gray-500 text-sm">Carregando...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-gray-600 text-sm">Nenhum item encontrado.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtrados.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => abrir(item)}
                className="group bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-primary hover:shadow-md hover:-translate-y-1 transition"
              >
                <div className="relative w-full pt-[70%]">
                  <img
                    src={item.imagem}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  {item.video && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white/90 rounded-full w-10 h-10 flex items-center justify-center text-black text-sm font-bold">
                        ▶
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-dark">
                    {item.categoria} {item.data ? "· " + formatarData(item.data) : ""}
                  </p>
                  <h3 className="text-sm font-semibold text-gray-100 mt-1 line-clamp-2">
                    {item.titulo}
                  </h3>
                  {item.descricaoCurta && (
                    <p className="text-[11px] text-gray-300 mt-1 line-clamp-3">
                      {item.descricaoCurta}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ============================
          MODAL
      ============================ */}
      {modal && (
        <div className="fixed inset-0 z-30 bg-black/70 flex items-center justify-center px-3">
          <div className="bg-neutral-950 text-gray-100 max-w-4xl w-full rounded-xl overflow-hidden border border-neutral-700 flex flex-col">
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-primary-light font-semibold">
                  {modal.categoria}
                  {modal.data ? " · " + formatarData(modal.data) : ""}
                </p>
                <h2 className="text-lg font-bold">{modal.titulo}</h2>
                <p className="text-[11px] text-neutral-400">
                  👁 {modal.views || 0} visualizações
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="text-neutral-400 hover:text-white text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* MÍDIA */}
            <div className="bg-black">{renderMidia(modal)}</div>

            {/* TEXTO */}
            <div className="px-5 py-4 max-h-[40vh] overflow-y-auto">
              <p className="whitespace-pre-line text-sm text-gray-200">
                {modal.descricaoLonga || modal.descricaoCurta}
              </p>
            </div>

            <div className="px-5 py-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-1.5 bg-neutral-100 text-neutral-900 rounded-md text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
