import NewsClient from "./NewsClient";

export const dynamic = "force-dynamic"; // continua impedindo erro de pre-render no Render

async function getNews() {
  const res = await fetch("/api/noticias", {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Noticias() {
  const news = await getNews();

  return <NewsClient news={news} />;
}