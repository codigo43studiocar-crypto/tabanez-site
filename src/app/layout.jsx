import "./globals.css";
import Header from "../components/Header";
import FloatingActions from "../components/FloatingActions";

export const metadata = {
  title: "Tabanez",
  description: "Site político com notícias automáticas.",
};

export default function RootLayout({ children }) {
  const anoAtual = new Date().getFullYear();

  return (
    <html lang="pt-BR">
      <body className="bg-neutral-bg text-neutral-dark">
        <Header />

        {/* CONTEÚDO PRINCIPAL */}
        <main className="min-h-[70vh] pt-24 pb-8">{children}</main>

        {/* RODAPÉ */}
        <footer className="bg-neutral-dark text-gray-200 mt-8">
          <div className="section py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent-yellow">
                Tabanez Pelo Distrito Federal
              </p>
              <p className="text-sm text-gray-300 mt-1">
                Presença constante nas ruas ao lado da população.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                © {anoAtual} – Carlos Alberto Tabanez.
              </p>
            </div>

            {/* REDES SOCIAIS NO RODAPÉ */}
            <div className="flex flex-col items-start md:items-end gap-2">
              <p className="text-xs text-gray-400">Acompanhe também nas redes:</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/tabanezdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Instagram"
                >
                  <span className="text-lg">📸</span>
                </a>
                <a
                  href="https://facebook.com/tabanezdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Facebook"
                >
                  <span className="text-lg">📘</span>
                </a>
                <a
                  href="https://youtube.com/tabanezdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="YouTube"
                >
                  <span className="text-lg">▶️</span>
                </a>
              </div>

              <a
                href="/fale-comigo"
                className="text-xs text-accent-yellow hover:underline"
              >
                Fale comigo
              </a>
            </div>
          </div>
        </footer>

        {/* BOTÕES FLUTUANTES (Propostas, Agenda, Notícias, Imprensa, WhatsApp) */}
        <FloatingActions />
      </body>
    </html>
  );
}