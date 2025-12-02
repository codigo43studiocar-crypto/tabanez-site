import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rssURL = "https://g1.globo.com/rss/g1/politica/";
    const response = await fetch(rssURL);
    const xml = await response.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(
      (match, idx) => {
        const block = match[1];

        const getTag = (tag) => {
          const r = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
          const m = block.match(r);
          if (!m) return "";
          // remove CDATA
          return m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
        };

        // descrição vinda do G1, limpando imagens e tags HTML
        let description = getTag("description") || "";
        description = description
          .replace(/<img[^>]*>/gi, " ") // tira imagens
          .replace(/<\/?[^>]+(>|$)/g, " ") // tira o resto das tags
          .replace(/\s+/g, " ") // limpa espaços extras
          .trim();

        // data formatada
        const rawDate = getTag("pubDate");
        let date = "";
        if (rawDate) {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            date = d.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          } else {
            date = rawDate;
          }
        }

        return {
          id: getTag("guid") || getTag("link") || String(idx),
          title: getTag("title"),
          link: getTag("link"),
          date,
          description,
        };
      }
    );

    // traz só as 12 primeiras
    return NextResponse.json(items.slice(0, 12));
  } catch (e) {
    console.error("Erro ao buscar RSS", e);
    return NextResponse.json([]);
  }
}