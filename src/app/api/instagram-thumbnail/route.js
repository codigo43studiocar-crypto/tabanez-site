import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json(
        { error: "URL é obrigatória." },
        { status: 400 }
      );
    }

    const apiUrl = `https://www.instagram.com/oembed/?url=${encodeURIComponent(
      url
    )}&omitscript=true`;

    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error("Falha ao buscar oEmbed do Instagram");
    }

    const data = await res.json();
    const thumbnailUrl = data.thumbnail_url || "";

    return NextResponse.json({ thumbnailUrl });
  } catch (e) {
    console.error("Erro ao buscar thumbnail do Instagram:", e);
    return NextResponse.json(
      { error: "Não foi possível obter a thumbnail." },
      { status: 500 }
    );
  }
}
