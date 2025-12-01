import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "imprensa.json");

function lerImprensaBruto() {
  try {
    if (!fs.existsSync(DATA_PATH)) return [];
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function salvarImprensa(lista) {
  try {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(lista, null, 2), "utf-8");
  } catch (e) {
    console.error("Erro ao salvar imprensa.json (views):", e);
  }
}

export async function POST(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório." },
        { status: 400 }
      );
    }

    const lista = lerImprensaBruto();
    const idx = lista.findIndex((r) => r.id === id);
    if (idx === -1) {
      return NextResponse.json({ views: 0 });
    }

    const atual = { ...(lista[idx] || {}) };
    const viewsAtuais =
      typeof atual.views === "number" && atual.views >= 0 ? atual.views : 0;
    atual.views = viewsAtuais + 1;
    lista[idx] = atual;
    salvarImprensa(lista);

    return NextResponse.json({ views: atual.views });
  } catch (e) {
    console.error("Erro ao registrar view:", e);
    return NextResponse.json(
      { error: "Erro ao registrar visualização." },
      { status: 500 }
    );
  }
}
