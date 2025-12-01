import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rssURL = "https://g1.globo.com/rss/g1/politica/";
    const response = await fetch(rssURL);
    const xml = await response.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
      const block = match[1];
      const getTag = (tag) => {
        const r = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
        const m = block.match(r);
        return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
      };
      return {
        title: getTag("title"),
        link: getTag("link"),
        date: getTag("pubDate"),
        description: getTag("description"),
      };
    });

    return NextResponse.json(items.slice(0, 12));
  } catch (e) {
    console.error("Erro ao buscar RSS", e);
    return NextResponse.json([]);
  }
}
