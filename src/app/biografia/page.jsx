import fs from "fs";
import path from "path";

const DATA_PATH_BIO = path.join(process.cwd(), "data", "conteudo.json");

function lerConteudoBiografia() {
  const PADRAO = {
    titulo: "Quem é Carlos Tabanez",
    introducao:
      "Carlos Alberto Rodrigues Tabanez é brasiliense, empresário, ex-deputado distrital, Policial Civil aposentado e referência em ações sociais e fiscalização no Distrito Federal. Com mais de 30 anos de atuação pública, comunitária, empresarial e policial, construiu uma trajetória marcada por coragem, disciplina e compromisso com a população.",
    secoes: [],
  };

  try {
    if (!fs.existsSync(DATA_PATH_BIO)) {
      return PADRAO;
    }
    const raw = fs.readFileSync(DATA_PATH_BIO, "utf-8");
    const data = JSON.parse(raw || "{}");
    const bio = data.biografia || {};

    return {
      titulo: bio.titulo || PADRAO.titulo,
      introducao: bio.introducao || PADRAO.introducao,
      secoes: bio.secoes || PADRAO.secoes,
    };
  } catch {
    return PADRAO;
  }
}

export default function Biografia() {
  const bio = lerConteudoBiografia();

  return (
    <section className="section py-10 md:py-14 space-y-8">
      {/* CABEÇALHO */}
      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.25em] text-accent-yellow uppercase">
          Biografia
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">
          {bio.titulo}
        </h1>
        <p className="text-sm md:text-base text-gray-700 max-w-3xl">
          {bio.introducao}
        </p>
      </header>

      {/* LAYOUT PRINCIPAL: TEXTO + BOX LATERAL */}
      <section className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
        <div className="space-y-6 text-sm md:text-base text-gray-700">
          {bio.secoes && bio.secoes.length > 0 ? (
            bio.secoes.map((secao) => (
              <div key={secao.id || secao.titulo} className="space-y-2">
                {secao.titulo && (
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {secao.titulo}
                  </h2>
                )}
                {secao.texto && <p>{secao.texto}</p>}
              </div>
            ))
          ) : (
            <p>
              Biografia em atualização. Em breve, mais detalhes sobre a
              trajetória de Carlos Tabanez.
            </p>
          )}
        </div>

        <aside className="bg-white rounded-card shadow-card p-5 space-y-3">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Em poucas palavras
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Policial Civil aposentado, com atuação na DOE.</li>
            <li>Treinou milhares de operadores de segurança.</li>
            <li>Atuação em projetos sociais e Instituto INCIDE.</li>
            <li>Já recebeu milhares de votos nas eleições distritais.</li>
            <li>Conhecido como “O Incansável Tabanez”.</li>
          </ul>
        </aside>
      </section>
    </section>
  );
}
