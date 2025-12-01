import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "public", "galeria");

export async function POST(req) {
  const form = await req.formData();
  const file = form.get("file");

  if (!file || typeof file === "string")
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });

  fs.mkdirSync(DIR, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const name = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

  fs.writeFileSync(path.join(DIR, name), bytes);

  return NextResponse.json({ url: `/galeria/${name}` });
}
