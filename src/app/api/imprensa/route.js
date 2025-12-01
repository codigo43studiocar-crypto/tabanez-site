import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "imprensa.json");

const PADRAO = [
  {
    id: "1",
    data: "2025-01-10",
    titulo: "Mutirão social leva atendimento a famílias em Ceilândia",
    resumo:
      "Tabanez participou de ação social com atendimento de saúde, orientação jurídica e distribuição de cestas básicas para famílias em situação de vulnerabilidade.",
    conteudo:
      "A ação social realizada em Ceilândia contou com equipes de saúde, orientação jurídica e assistência social. Tabanez esteve presente durante todo o evento, ouvindo as famílias, acompanhando o trabalho dos voluntários e reforçando seu compromisso com as comunidades mais simples do Distrito Federal.\n\nForam realizados atendimentos médicos, aferição de pressão e glicemia, orientações sobre programas sociais e encaminhamentos para serviços públicos. A iniciativa teve a participação de voluntários, profissionais de diversas áreas e lideranças comunitárias.",
    imagem: "/imprensa/acao-social-ceilandia.jpg",
    instagram: "https://www.instagram.com/",
    categoria: "Ação social",
    video: "",
    views: 0,
    destaque: false,
  },
  {
    id: "2",
    data: "2025-01-08",
    titulo: "Reunião com lideranças discute segurança pública nas cidades",
    resumo:
      "Lideranças de várias regiões administrativas se reuniram com Tabanez para tratar de segurança, iluminação pública e apoio às forças policiais.",
    conteudo:
      "Em reunião com lideranças de várias regiões administrativas, Tabanez ouviu relatos sobre problemas de segurança, falta de iluminação pública e necessidade de presença mais constante das forças policiais.\n\nDurante o encontro, foram coletadas demandas específicas de cada região, que serão encaminhadas aos órgãos competentes. Tabanez reforçou sua defesa da segurança pública como prioridade e colocou seu mandato à disposição para cobrar ações concretas.",
    imagem: "/imprensa/reuniao-liderancas.jpg",
    instagram: "",
    categoria: "Reunião",
    video: "",
    views: 0,
    destaque: false,
  },
];

function lerImprensa() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
      fs.writeFileSync(DATA_PATH, JSON.stringify(PADRAO, null, 2), "utf-8");
      return PADRAO;
    }

    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw || "[]");
    if (!Array.isArray(data)) return PADRAO;

    // garante campos novos nos registros antigos
    return data.map((r, index) => ({
      id:
        r.id ||
        String(Date.now() + index) + Math.random().toString(16).slice(2),
      data: r.data || "",
      titulo: r.titulo || "",
      resumo: r.resumo || "",
      conteudo: r.conteudo || "",
      imagem: r.imagem || "",
      instagram: r.instagram || "",
      categoria: r.categoria || "Outros",
      video: r.video || "",
      views: typeof r.views === "number" ? r.views : 0,
      destaque: typeof r.destaque === "boolean" ? r.destaque : false,
    }));
  } catch (e) {
    console.error("Erro ao ler imprensa.json:", e);
    return PADRAO;
  }
}

function salvarImprensa(lista) {
  try {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(lista, null, 2), "utf-8");
  } catch (e) {
    console.error("Erro ao salvar imprensa.json:", e);
  }
}

export async function GET() {
  const releases = lerImprensa();
  return NextResponse.json({ releases });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const lista = Array.isArray(body.releases) ? body.releases : [];
    const normalizado = lista.map((r, index) => ({
      id:
        r.id ||
        String(Date.now() + index) + Math.random().toString(16).slice(2),
      data: r.data || "",
      titulo: r.titulo || "",
      resumo: r.resumo || "",
      conteudo: r.conteudo || "",
      imagem: r.imagem || "",
      instagram: r.instagram || "",
      categoria: r.categoria || "Outros",
      video: r.video || "",
      views: typeof r.views === "number" ? r.views : 0,
      destaque: typeof r.destaque === "boolean" ? r.destaque : false,
    }));

    salvarImprensa(normalizado);
    return NextResponse.json({ releases: normalizado });
  } catch (e) {
    console.error("Erro no PUT /api/imprensa:", e);
    return NextResponse.json(
      { error: "Erro ao salvar releases." },
      { status: 500 }
    );
  }
}
