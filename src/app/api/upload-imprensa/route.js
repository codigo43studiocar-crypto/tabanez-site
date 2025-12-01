import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "imprensa");

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Arquivo inválido." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // garante que a pasta existe
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });

    const originalName = file.name || "imagem";
    const partes = originalName.split(".");
    const ext = partes.length > 1 ? partes.pop() : "jpg";

    const fileName =
      Date.now().toString() +
      "-" +
      Math.random().toString(16).slice(2) +
      "." +
      ext;

    const filePath = path.join(UPLOAD_DIR, fileName);

    fs.writeFileSync(filePath, buffer);

    // URL pública para usar no site
    const url = "/imprensa/" + fileName;

    return NextResponse.json({ url });
  } catch (e) {
    console.error("Erro ao fazer upload da imagem de imprensa:", e);
    return NextResponse.json(
      { error: "Erro ao enviar imagem." },
      { status: 500 }
    );
  }
}
