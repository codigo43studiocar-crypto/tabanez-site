import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "agenda.json");

function lerEventos() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
      fs.writeFileSync(DATA_PATH, "[]", "utf-8");
    }
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    console.error("Erro ao ler agenda.json:", e);
    return [];
  }
}

function salvarEventos(eventos) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(eventos, null, 2), "utf-8");
}

export async function GET() {
  const eventos = lerEventos();
  return NextResponse.json(eventos);
}

export async function POST(request) {
  const body = await request.json();
  const eventos = lerEventos();

  const novo = {
    id: Date.now(),
    titulo: body.titulo || "",
    data: body.data || "",
    hora: body.hora || "",
    local: body.local || "",
    categoria: body.categoria || "",
    status: body.status || "Agendado",
    descricao: body.descricao || "",
  };

  eventos.push(novo);
  salvarEventos(eventos);

  return NextResponse.json(novo, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  const eventos = lerEventos();
  const index = eventos.findIndex((e) => e.id === body.id);

  if (index === -1) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  }

  eventos[index] = {
    ...eventos[index],
    titulo: body.titulo,
    data: body.data,
    hora: body.hora,
    local: body.local,
    categoria: body.categoria,
    status: body.status,
    descricao: body.descricao,
  };

  salvarEventos(eventos);
  return NextResponse.json(eventos[index]);
}

export async function DELETE(request) {
  const body = await request.json();
  const eventos = lerEventos();
  const filtrado = eventos.filter((e) => e.id !== body.id);

  salvarEventos(filtrado);
  return NextResponse.json({ ok: true });
}
