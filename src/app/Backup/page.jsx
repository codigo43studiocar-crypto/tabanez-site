export default function Home() {
  return (
    <div className="w-full">
    {/* HERO COM FOTO DO TABANEZ */}
<section className="w-full bg-gradient-to-br from-primary to-primary-dark text-white">
  <div className="section py-10 md:py-16 grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 items-center">
    
    {/* TEXTO PRINCIPAL */}
    <div>
      <p className="text-xs font-semibold tracking-[0.25em] uppercase text-accent-yellow">
        Carlos Alberto Tabanez
      </p>
      <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
        TABANEZ
      </h1>
      <p className="mt-3 text-sm md:text-base max-w-xl text-gray-100">
        Trabalho incansável pelo Distrito Federal. Segurança pública,
        projetos sociais e presença constante nas ruas ao lado da população.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/propostas"
          className="inline-flex items-center rounded-md bg-accent-yellow px-5 py-2.5 text-xs md:text-sm font-semibold text-neutral-dark hover:bg-yellow-300 transition"
        >
          Ver propostas
        </a>
        <a
          href="/noticias"
          className="inline-flex items-center rounded-md border border-white/70 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-white/10 transition"
        >
          Notícias automáticas
        </a>
        <a
          href="/biografia"
          className="inline-flex items-center rounded-md border border-white/40 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-white/5 transition"
        >
          Conheça a história
        </a>
      </div>
    </div>

    {/* FOTO DO TABANEZ */}
    <div className="flex justify-center md:justify-end">
      <div className="relative w-52 h-64 md:w-64 md:h-80 rounded-3xl overflow-hidden border-4 border-accent-yellow shadow-2xl bg-neutral-dark/40">
        <img
          src="/tabanez.jpg"
          alt="Carlos Alberto Tabanez"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</section>

      {/* BLOCO RESUMO DA TRAJETÓRIA */}
      <section className="section py-8 md:py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Uma trajetória construída com trabalho
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <article className="bg-white rounded-card shadow-card px-5 py-4 border border-gray-100">
            <h3 className="font-semibold text-base text-gray-900 mb-1">
              Segurança pública
            </h3>
            <p className="text-sm text-gray-700">
              Policial Civil aposentado, atuou na Divisão de Operações Especiais (DOE),
              treinou milhares de operadores e recebeu diversas condecorações.
            </p>
          </article>
          <article className="bg-white rounded-card shadow-card px-5 py-4 border border-gray-100">
            <h3 className="font-semibold text-base text-gray-900 mb-1">
              Projetos sociais
            </h3>
            <p className="text-sm text-gray-700">
              À frente de ações sociais e iniciativas como o atendimento a famílias
              vulneráveis e projetos comunitários em várias regiões do DF.
            </p>
          </article>
          <article className="bg-white rounded-card shadow-card px-5 py-4 border border-gray-100">
            <h3 className="font-semibold text-base text-gray-900 mb-1">
              O Incansável Tabanez
            </h3>
            <p className="text-sm text-gray-700">
              Reconhecido pelo ritmo intenso de visitas, agendas lotadas e presença
              constante nas ruas, ouvindo de perto as demandas da população.
            </p>
          </article>
        </div>
      </section>

      {/* ÚLTIMAS AÇÕES (ESTÁTICO, PODEMOS TROCAR DEPOIS) */}
      <section className="section pb-10 md:pb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Últimas ações
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Fiscalização na saúde",
              text: "Visitas em hospitais e UPAs para ouvir profissionais e pacientes.",
            },
            {
              title: "Defesa das comunidades",
              text: "Articulação com lideranças locais para destravar melhorias nas cidades.",
            },
            {
              title: "Atenção às famílias",
              text: "Apoio direto a famílias em vulnerabilidade e ações sociais contínuas.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="bg-white rounded-card shadow-card px-5 py-4 border border-gray-100"
            >
              <h3 className="font-semibold text-base text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-700">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
