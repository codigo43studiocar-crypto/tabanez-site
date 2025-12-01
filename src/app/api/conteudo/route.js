import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "conteudo.json");

const PADRAO = {
  home: {
    badge: "Carlos Alberto Tabanez",
    titulo: "TABANEZ",
    subtitulo:
      "Trabalho incansável pelo Distrito Federal. Segurança pública, projetos sociais e presença constante nas ruas ao lado da população.",
    trajetoria: {
      titulo: "Uma trajetória construída com trabalho",
      cards: [
        {
          titulo: "Segurança pública",
          texto:
            "Policial Civil aposentado, atuou na Divisão de Operações Especiais (DOE), treinou milhares de operadores e recebeu diversas condecorações.",
        },
        {
          titulo: "Projetos sociais",
          texto:
            "À frente de ações sociais e iniciativas como o atendimento a famílias vulneráveis e projetos comunitários em várias regiões do DF.",
        },
        {
          titulo: "O Incansável Tabanez",
          texto:
            "Reconhecido pelo ritmo intenso de visitas, agendas lotadas e presença constante nas ruas, ouvindo de perto as demandas da população.",
        },
      ],
    },
    acoes: {
      titulo: "Últimas ações",
      cards: [
        {
          titulo: "Fiscalização na saúde",
          texto:
            "Visitas em hospitais e UPAs para ouvir profissionais e pacientes.",
        },
        {
          titulo: "Defesa das comunidades",
          texto:
            "Articulação com lideranças locais para destravar melhorias nas cidades.",
        },
        {
          titulo: "Atenção às famílias",
          texto:
            "Apoio direto a famílias em vulnerabilidade e ações sociais contínuas.",
        },
      ],
    },
  },
  biografia: {
    titulo: "Quem é Carlos Tabanez",
    introducao:
      "Carlos Alberto Rodrigues Tabanez é brasiliense, empresário, ex-deputado distrital, Policial Civil aposentado e referência em ações sociais e fiscalização no Distrito Federal. Com mais de 30 anos de atuação pública, comunitária, empresarial e policial, construiu uma trajetória marcada por coragem, disciplina e compromisso com a população.",
    secoes: [
      {
        id: "origens-formacao",
        titulo: "Origens e formação",
        texto:
          "Tabanez teve uma trajetória profissional sólida antes de entrar para a vida pública. Formou-se em Química, fez especializações na área, atuou como professor e sempre esteve envolvido com trabalho voluntário e formação de pessoas.",
      },
      {
        id: "carreira-policia",
        titulo: "Carreira na Polícia Civil",
        texto:
          "Na Polícia Civil do DF, Tabanez atuou em unidades estratégicas, incluindo a Divisão de Operações Especiais (DOE). Foi instrutor, participou de operações de alto risco e ajudou a formar milhares de profissionais de segurança pública.",
      },
      {
        id: "empreendedorismo-cacs",
        titulo: "Empreendedorismo e defesa dos CACs",
        texto:
          "Empresário e instrutor, Tabanez participou da criação de clubes e projetos ligados ao esporte de tiro, defendendo o uso responsável de armas, o esporte e os direitos dos CACs, sempre com foco na legalidade e na segurança.",
      },
      {
        id: "origem-incansavel",
        titulo: "A origem de “O Incansável Tabanez”",
        texto:
          "Durante a campanha de 2018, o ritmo intenso de reuniões, visitas e agendas fez com que a equipe passasse a chamá-lo de 'O Incansável Tabanez'. A expressão virou marca, associada ao trabalho contínuo e à presença constante nas ruas.",
      },
      {
        id: "trajetoria-politica",
        titulo: "Trajetória política",
        texto:
          "Em 2018, pelo PROS, Tabanez recebeu mais de oito mil votos e ficou na suplência, assumindo por período limitado e apresentando projetos e indicações. Em 2022, pelo MDB, cresceu em votação e se consolidou como liderança conhecida nas regiões administrativas.",
      },
      {
        id: "mandato-fiscalizacao",
        titulo: "Mandato e fiscalização",
        texto:
          "Mesmo fora do mandato completo, Tabanez se destacou por fiscalizar hospitais, UPAs e serviços públicos, ouvir servidores e usuários, cobrar providências do poder público e apresentar projetos voltados à melhoria da qualidade de vida no DF.",
      },
      {
        id: "projetos-sociais",
        titulo: "Projetos sociais e Instituto INCIDE",
        texto:
          "À frente do Instituto INCIDE e de iniciativas como o projeto Visão Para Todos, Tabanez ajudou a levar atendimento, exames e óculos para milhares de pessoas, além de apoiar ações sociais e campanhas solidárias em diversas regiões do Distrito Federal.",
      },
      {
        id: "bandeiras-compromisso",
        titulo: "Bandeiras e compromisso",
        texto:
          "As principais bandeiras de Tabanez são a segurança pública, a defesa da família, a geração de emprego e renda, a transparência no uso do dinheiro público e a atenção às comunidades mais simples. Sua marca é a energia que gera oportunidades e o compromisso de não abandonar o povo.",
      },
    ],
  },
  propostas: {
    titulo: "Propostas",
    subtitulo:
      "Conheça as ações e compromissos de Tabanez para transformar o Distrito Federal.",
    secoes: [
      {
        id: "seguranca",
        titulo: "Segurança Pública",
        intro:
          "Como policial civil experiente, Tabanez conhece de perto as necessidades das forças de segurança e da população.",
      },
      {
        id: "saude",
        titulo: "Saúde",
        intro:
          "A saúde pública precisa de gestão real, investimentos certos e presença ativa.",
      },
      {
        id: "educacao",
        titulo: "Educação",
        intro:
          "Educação é base para o futuro — e o DF precisa avançar com força.",
      },
      {
        id: "mobilidade",
        titulo: "Mobilidade",
        intro: "Mobilidade urbana moderna é qualidade de vida.",
      },
      {
        id: "social",
        titulo: "Desenvolvimento Social",
        intro: "Cuidar das pessoas é a base de todo governo justo.",
      },
      {
        id: "emprego",
        titulo: "Emprego e Renda",
        intro: "Geração de emprego é desenvolvimento real.",
      },
      {
        id: "gestao",
        titulo: "Gestão Pública",
        intro: "Gestão transparente, eficiente e responsável.",
      },
    ],
  },
};

function ler() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
      fs.writeFileSync(DATA_PATH, JSON.stringify(PADRAO, null, 2), "utf-8");
      return PADRAO;
    }

    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw || "{}");

    return {
      home: {
        ...PADRAO.home,
        ...(data.home || {}),
        trajetoria: {
          ...PADRAO.home.trajetoria,
          ...(data.home?.trajetoria || {}),
          cards: data.home?.trajetoria?.cards || PADRAO.home.trajetoria.cards,
        },
        acoes: {
          ...PADRAO.home.acoes,
          ...(data.home?.acoes || {}),
          cards: data.home?.acoes?.cards || PADRAO.home.acoes.cards,
        },
      },
      biografia: {
        ...PADRAO.biografia,
        ...(data.biografia || {}),
        secoes: data.biografia?.secoes || PADRAO.biografia.secoes,
      },
      propostas: {
        ...PADRAO.propostas,
        ...(data.propostas || {}),
        secoes: data.propostas?.secoes || PADRAO.propostas.secoes,
      },
    };
  } catch (e) {
    console.error("Erro ao ler conteudo.json:", e);
    return PADRAO;
  }
}

function salvar(json) {
  try {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    fs.writeFileSync(DATA_PATH, JSON.stringify(json, null, 2), "utf-8");
  } catch (e) {
    console.error("Erro ao salvar conteudo.json:", e);
  }
}

export async function GET() {
  const data = ler();
  return NextResponse.json(data);
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const atual = ler();

    const novo = {
      home: {
        ...atual.home,
        ...(body.home || {}),
        trajetoria: {
          ...atual.home.trajetoria,
          ...(body.home?.trajetoria || {}),
          cards:
            body.home?.trajetoria?.cards &&
            body.home.trajetoria.cards.length
              ? body.home.trajetoria.cards
              : atual.home.trajetoria.cards,
        },
        acoes: {
          ...atual.home.acoes,
          ...(body.home?.acoes || {}),
          cards:
            body.home?.acoes?.cards && body.home.acoes.cards.length
              ? body.home.acoes.cards
              : atual.home.acoes.cards,
        },
      },
      biografia: {
        ...atual.biografia,
        ...(body.biografia || {}),
        secoes:
          body.biografia?.secoes && body.biografia.secoes.length
            ? body.biografia.secoes
            : atual.biografia.secoes,
      },
      propostas: {
        ...atual.propostas,
        ...(body.propostas || {}),
        secoes:
          body.propostas?.secoes && body.propostas.secoes.length
            ? body.propostas.secoes
            : atual.propostas.secoes,
      },
    };

    salvar(novo);
    return NextResponse.json(novo);
  } catch (e) {
    console.error("Erro no PUT /api/conteudo:", e);
    return NextResponse.json(
      { error: "Erro ao salvar conteúdo." },
      { status: 500 }
    );
  }
}
