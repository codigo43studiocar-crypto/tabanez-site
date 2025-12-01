import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "propostas.json");

const PADRAO = [
  {
    id: "1",
    categoria: "Saúde",
    titulo: "Fortalecer a atenção básica na saúde",
    subtitulo:
      "Levar médico, remédio e estrutura para quem mais precisa nas cidades e regiões mais afastadas.",
    bullets: [
      "Ampliar o horário de funcionamento dos postos de saúde.",
      "Garantir estoque de medicamentos essenciais.",
      "Reforçar equipes de agentes comunitários de saúde.",
    ],
    prioridade: "Alta",
    destaque: true,
    publicado: true,
    ordem: 1,
  },
];

function lerPropostas() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
      fs.writeFileSync(DATA_PATH, JSON.stringify(PADRAO, null, 2), "utf-8");
      return PADRAO;
    }

    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw || "[]");
    if (!Array.isArray(data)) return PADRAO;

    return data.map((p, index) => ({
      id:
        p.id ||
        String(Date.now() + index) + Math.random().toString(16).slice(2),
      categoria: p.categoria || "Outros",
      titulo: p.titulo || "",
      subtitulo: p.subtitulo || "",
      bullets: Array.isArray(p.bullets)
        ? p.bullets.filter((b) => typeof b === "string" && b.trim().length > 0)
        : [],
      prioridade: p.prioridade || "Média",
      destaque: !!p.destaque,
      publicado: p.publicado !== false,
      ordem: typeof p.ordem === "number" ? p.ordem : index + 1,
    }));
  } catch (e) {
    console.error("Erro ao ler propostas.json:", e);
    return PADRAO;
  }
}

function salvarPropostas(lista) {
  try {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(lista, null, 2), "utf-8");
  } catch (e) {
    console.error("Erro ao salvar propostas.json:", e);
  }
}

export async function GET() {
  const propostas = lerPropostas();
  return NextResponse.json({ propostas });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const lista = Array.isArray(body.propostas) ? body.propostas : [];
    const normalizado = lista.map((p, index) => ({
      id:
        p.id ||
        String(Date.now() + index) + Math.random().toString(16).slice(2),
      categoria: p.categoria || "Outros",
      titulo: p.titulo || "",
      subtitulo: p.subtitulo || "",
      bullets: Array.isArray(p.bullets)
        ? p.bullets.filter((b) => typeof b === "string" && b.trim().length > 0)
        : [],
      prioridade: p.prioridade || "Média",
      destaque: !!p.destaque,
      publicado: p.publicado !== false,
      ordem:
        typeof p.ordem === "number"
          ? p.ordem
          : typeof p.ordem === "string"
          ? parseInt(p.ordem, 10) || index + 1
          : index + 1,
    }));

    salvarPropostas(normalizado);
    return NextResponse.json({ propostas: normalizado });
  } catch (e) {
    console.error("Erro no PUT /api/propostas:", e);
    return NextResponse.json(
      { error: "Erro ao salvar propostas." },
      { status: 500 },
    );
  }
}
