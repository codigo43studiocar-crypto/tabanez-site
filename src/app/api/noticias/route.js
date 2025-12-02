import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rssURL = "https://g1.globo.com/rss/g1/politica/";
    const response = await fetch(rssURL, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json([]);
    }

    const xml = await response.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => {
      const block = match[1];

      const getTag = (tag) => {
        const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
        const r = block.match(regex);
        return r ? r[1].replace("<![CDATA[", "").replace("]]>", "").trim() : "";
      };

      return {
        id: Math.random().toString(36).substring(2, 9),
        titulo: getTag("title"),
        link: getTag("link"),
        resumo: getTag("description"),
      };
    });

    return NextResponse.json(items.slice(0, 12));
  } catch (err) {
    console.error("Erro RSS:", err);
    return NextResponse.json([]);
  }
}