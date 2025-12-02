"use client";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">

      {/* Botão: Ver agenda completa */}
      <a
        href="/agenda"
        className="w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-dark transition"
        aria-label="Ver agenda completa"
      >
        {/* Ícone simples de calendário */}
        <span className="text-lg font-bold">🗓</span>
      </a>

      {/* Botão: Ver propostas */}
      <a
        href="/propostas"
        className="w-12 h-12 rounded-full bg-amber-400 text-neutral-900 shadow-lg flex items-center justify-center hover:bg-amber-300 transition"
        aria-label="Ver propostas"
      >
        {/* Ícone simples de documento */}
        <span className="text-lg font-bold">📄</span>
      </a>

      {/* Botão: WhatsApp (o que já existia) */}
      <a
        href="https://wa.me/+5561992815222"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:bg-[#1ebe57] transition"
        aria-label="Falar no WhatsApp"
      >
        {/* Bolha de chat */}
        <span className="text-xl font-bold">💬</span>
      </a>
    </div>
  );
}