import { NextResponse } from "next/server";

// Remove tags HTML e espaços extras
function stripHtml(html = "") {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET() {
  try {
    const rssURL = "https://g1.globo.com/rss/g1/politica/";
    const response = await fetch(rssURL, { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json([]);
    }

    const xml = await response.text();

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(
      (match, index) => {
        const block = match[1];

        const getTag = (tag) => {
          const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
          const r = block.match(regex);
          if (!r) return "";
          const raw = r[1]
            .replace("<![CDATA[", "")
            .replace("]]>", "")
            .trim();
          return raw;
        };

        const rawTitle = getTag("title");
        const rawDesc = getTag("description");

        const titulo = stripHtml(rawTitle);
        const descLimpa = stripHtml(rawDesc);
        const resumo =
          descLimpa.length > 260
            ? descLimpa.slice(0, 260) + "..."
            : descLimpa;

        return {
          id: index + 1,
          titulo,
          link: getTag("link"),
          resumo,
        };
      }
    );

    return NextResponse.json(items.slice(0, 12));
  } catch (err) {
    console.error("Erro RSS:", err);
    return NextResponse.json([]);
  }
}