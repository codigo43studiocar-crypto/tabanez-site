"use client";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">

      {/* Propostas */}
      <a
        href="/propostas"
        className="w-12 h-12 rounded-full bg-amber-400 text-neutral-900 shadow-lg flex items-center justify-center hover:scale-110 transition"
        aria-label="Ver propostas"
      >
        📄
      </a>

      {/* Agenda */}
      <a
        href="/agenda"
        className="w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-110 transition"
        aria-label="Ver agenda"
      >
        📅
      </a>

      {/* Notícias */}
      <a
        href="/noticias"
        className="w-12 h-12 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition"
        aria-label="Notícias"
      >
        📰
      </a>

      {/* Imprensa */}
      <a
        href="/imprensa"
        className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition"
        aria-label="Imprensa"
      >
        🎤
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/5561992815222?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20equipe%20do%20Tabanez."
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-110 transition"
        aria-label="Falar pelo WhatsApp"
      >
        💬
      </a>
    </div>
  );
}