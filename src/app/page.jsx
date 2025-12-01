import fs from "fs";
import path from "path";

const DATA_CONTEUDO_PATH = path.join(process.cwd(), "data", "conteudo.json");
const DATA_AGENDA_PATH = path.join(process.cwd(), "data", "agenda.json");
const DATA_PROPOSTAS_PATH = path.join(process.cwd(), "data", "propostas.json");

// ---------- HOME (HERO, TRAJETÓRIA, AÇÕES) ----------
function lerConteudoHome() {
  const PADRAO_HOME = {
    badge: "Carlos Alberto Tabanez",
    titulo: "TABANEZ",
    subtitulo:
      "Trabalho incansável pelo Distrito Federal. Segurança pública, projetos sociais e presença constante nas ruas ao lado da população.",
    trajetoria: {
      titulo: "Uma trajetória construída com trabalho",
      cards: [
        {
          titulo: "Segurança pública",
          texto:
            "Policial Civil aposentado, atuou na Divisão de Operações Especiais (DOE), treinou milhares de operadores e recebeu diversas condecorações.",
        },
        {
          titulo: "Projetos sociais",
          texto:
            "À frente de ações sociais e iniciativas como o atendimento a famílias vulneráveis e projetos comunitários em várias regiões do DF.",
        },
        {
          titulo: "O Incansável Tabanez",
          texto:
            "Reconhecido pelo ritmo intenso de visitas, agendas lotadas e presença constante nas ruas, ouvindo de perto as demandas da população.",
        },
      ],
    },
    acoes: {
      titulo: "Últimas ações",
      cards: [
        {
          titulo: "Fiscalização na saúde",
          texto:
            "Visitas em hospitais e UPAs para ouvir profissionais e pacientes.",
        },
        {
          titulo: "Defesa das comunidades",
          texto:
            "Articulação com lideranças locais para destravar melhorias nas cidades.",
        },
        {
          titulo: "Atenção às famílias",
          texto:
            "Apoio direto a famílias em vulnerabilidade e ações sociais contínuas.",
        },
      ],
    },
  };

  try {
    if (!fs.existsSync(DATA_CONTEUDO_PATH)) {
      return PADRAO_HOME;
    }

    const raw = fs.readFileSync(DATA_CONTEUDO_PATH, "utf-8");
    const data = JSON.parse(raw || "{}");
    const home = data.home || {};

    return {
      badge: home.badge || PADRAO_HOME.badge,
      titulo: home.titulo || PADRAO_HOME.titulo,
      subtitulo: home.subtitulo || PADRAO_HOME.subtitulo,
      trajetoria: {
        ...PADRAO_HOME.trajetoria,
        ...(home.trajetoria || {}),
        cards: home.trajetoria?.cards || PADRAO_HOME.trajetoria.cards,
      },
      acoes: {
        ...PADRAO_HOME.acoes,
        ...(home.acoes || {}),
        cards: home.acoes?.cards || PADRAO_HOME.acoes.cards,
      },
    };
  } catch {
    return PADRAO_HOME;
  }
}

// ---------- AJUDANTES AGENDA / PROPOSTAS ----------
function criarDateObj(data, hora) {
  if (!data) return null;
  const h = hora && hora.length >= 4 ? hora : "00:00";
  const iso = `${data}T${h}:00`;
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return null;
  return dt;
}

function formatarDataHora(data, hora) {
  if (!data) return "";
  try {
    const [ano, mes, dia] = data.split("-");
    const base = `${dia}/${mes}/${ano}`;
    if (hora) return `${base} · ${hora}`;
    return base;
  } catch {
    return data;
  }
}

// ---------- AGENDA NA HOME (3 PRÓXIMOS EVENTOS) ----------
function lerProximosEventosHome() {
  try {
    if (!fs.existsSync(DATA_AGENDA_PATH)) {
      return [];
    }

    const raw = fs.readFileSync(DATA_AGENDA_PATH, "utf-8");
    const lista = JSON.parse(raw || "[]");
    if (!Array.isArray(lista)) return [];

    const agora = new Date();

    const filtrados = lista
      .filter((e) => e && e.publicado !== false)
      .filter((e) => {
        // Regra C: override manual de "realizado"
        if (e.realizado) return false; // realizados não entram na home
        const dt = criarDateObj(e.data, e.hora);
        if (!dt) return false;
        return dt.getTime() >= agora.getTime();
      })
      .sort((a, b) => {
        const da = criarDateObj(a.data, a.hora);
        const db = criarDateObj(b.data, b.hora);
        const ta = da ? da.getTime() : 0;
        const tb = db ? db.getTime() : 0;
        return ta - tb;
      })
      .slice(0, 3);

    return filtrados;
  } catch {
    return [];
  }
}

// ---------- PROPOSTAS NA HOME (DESTAQUES) ----------
function lerPropostasDestaqueHome() {
  try {
    if (!fs.existsSync(DATA_PROPOSTAS_PATH)) {
      return [];
    }

    const raw = fs.readFileSync(DATA_PROPOSTAS_PATH, "utf-8");
    const lista = JSON.parse(raw || "[]");
    if (!Array.isArray(lista)) return [];

    const pesoPrioridade = { Alta: 1, Média: 2, Baixa: 3 };

    const publicados = lista
      .filter((p) => p && p.publicado !== false)
      .sort((a, b) => {
        if (a.destaque && !b.destaque) return -1;
        if (!a.destaque && b.destaque) return 1;
        const pa = a.prioridade || "Média";
        const pb = b.prioridade || "Média";
        const wa = pesoPrioridade[pa] || 99;
        const wb = pesoPrioridade[pb] || 99;
        if (wa !== wb) return wa - wb;
        return (a.ordem || 0) - (b.ordem || 0);
      });

    return publicados.slice(0, 3);
  } catch {
    return [];
  }
}

// ---------- COMPONENTE DA HOME ----------
export default function Home() {
  const home = lerConteudoHome();
  const proximosEventos = lerProximosEventosHome();
  const propostasDestaque = lerPropostasDestaqueHome();

  return (
    <div className="w-full">
      {/* HERO COM FUNDO MAPA DF */}
      <section className="relative w-full text-white bg-[url('/hero-mapa-df.jpg')] bg-cover bg-center">
        {/* camada escura pra leitura */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/40" />

        <div className="section relative z-10 py-10 md:py-16 grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 items-center">
          {/* TEXTO PRINCIPAL */}
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-accent-yellow">
              {home.badge}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
              {home.titulo}
            </h1>
            <p className="mt-3 text-sm md:text-base max-w-xl text-gray-100">
              {home.subtitulo}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/propostas"
                className="inline-flex items-center rounded-md bg-accent-yellow px-5 py-2.5 text-xs md:text-sm font-semibold text-neutral-dark hover:bg-yellow-300 transition"
              >
                Ver propostas
              </a>
              <a
                href="/noticias"
                className="inline-flex items-center rounded-md border border-white/70 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Notícias automáticas
              </a>
              <a
                href="/biografia"
                className="inline-flex items-center rounded-md border border-white/40 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-white/5 transition"
              >
                Conheça a história
              </a>
            </div>
          </div>

          {/* FOTO DO TABANEZ */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-52 h-64 md:w-64 md:h-80 rounded-3xl overflow-hidden border-4 border-accent-yellow shadow-2xl bg-neutral-dark/40">
              <img
                src="/tabanez.jpg"
                alt="Carlos Alberto Tabanez"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRÓXIMOS EVENTOS (AGENDA) */}
      <section className="section py-8 md:py-10">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Próximos compromissos
          </h2>
          <a
            href="/agenda"
            className="text-xs md:text-sm font-semibold text-primary hover:underline"
          >
            Ver agenda completa
          </a>
        </div>

        {proximosEventos.length === 0 ? (
          <p className="text-sm text-gray-600">
            Nenhum compromisso futuro cadastrado no momento.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {proximosEventos.map((ev) => (
              <article
                key={ev.id}
                className="bg-white rounded-card shadow-card px-5 py-4 border border-gray-100 flex flex-col"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
                  {formatarDataHora(ev.data, ev.hora)}
                </p>
                <h3 className="mt-1 text-base font-bold text-gray-900">
                  {ev.titulo || "Evento"}
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                  {ev.tipo}
                  {ev.ra ? ` · ${ev.ra}` : ""}
                  {ev.local ? ` · ${ev.local}` : ""}
                </p>
                {ev.descricao && (
                  <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                    {ev.descricao}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* PROPOSTAS EM DESTAQUE */}
      <section className="section pb-8 md:pb-10">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Propostas em destaque
          </h2>
          <a
            href="/propostas"
            className="text-xs md:text-sm font-semibold text-primary hover:underline"
          >
            Ver todas as propostas
          </a>
        </div>

        {propostasDestaque.length === 0 ? (
          <p className="text-sm text-gray-600">
            Nenhuma proposta cadastrada ainda no painel.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {propostasDestaque.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-card shadow-card px-5 py-4 border border-gray-100 flex flex-col gap-2"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
                  {p.categoria || "Proposta"}
                </p>
                <h3 className="text-base font-bold text-gray-900">
                  {p.titulo || "Proposta"}
                </h3>
                {p.subtitulo && (
                  <p className="text-sm text-gray-700">{p.subtitulo}</p>
                )}
                {Array.isArray(p.bullets) && p.bullets.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-gray-800 space-y-1">
                    {p.bullets.slice(0, 4).map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* BLOCO RESUMO DA TRAJETÓRIA */}
      <section className="section pb-8 md:pb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {home.trajetoria?.titulo}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {home.trajetoria?.cards?.map((card, idx) => (
            <article
              key={idx}
              className="bg-white rounded-card shadow-card px-5 py-4 border border-gray-100"
            >
              <h3 className="font-semibold text-base text-gray-900 mb-1">
                {card.titulo}
              </h3>
              <p className="text-sm text-gray-700">{card.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ÚLTIMAS AÇÕES */}
      <section className="section pb-10 md:pb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {home.acoes?.titulo}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {home.acoes?.cards?.map((card, idx) => (
            <article
              key={idx}
              className="bg-white rounded-card shadow-card px-5 py-4 border border-gray-100"
            >
              <h3 className="font-semibold text-base text-gray-900">
                {card.titulo}
              </h3>
              <p className="mt-2 text-sm text-gray-700">{card.texto}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}