// src/app/admin/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setErro("Senha incorreta.");
        return;
      }

      router.push("/admin");
    } catch (err) {
      console.error(err);
      setErro("Erro ao tentar entrar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl shadow-xl shadow-black/50 p-6">
        <p className="text-[10px] tracking-[0.35em] uppercase text-amber-300">
          Tabanez ▸ Painel
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Painel Administrativo</h1>
        <p className="text-sm text-neutral-300 mb-6">
          Digite a senha de acesso para gerenciar agenda, propostas e conteúdos.
        </p>

        {erro && (
          <p className="mb-4 text-sm text-red-400 bg-red-950/50 border border-red-700 rounded-lg px-3 py-2">
            {erro}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-1">
              Senha de acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={carregando || !password}
            className="w-full py-2.5 rounded-lg bg-amber-400 text-neutral-900 font-semibold text-sm hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {carregando ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>
      </div>
    </div>
  );
}