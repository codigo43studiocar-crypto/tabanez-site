import NewsClient from "./NewsClient";

export const dynamic = "force-dynamic";

async function getNews() {
  try {
    const res = await fetch("/api/noticias", {
      cache: "no-store",
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (e) {
    return [];
  }
}

export default async function Noticias() {
  const news = await getNews();
  return <NewsClient news={news} />;
}