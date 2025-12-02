"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Usuário ou senha inválidos.");
        return;
      }

      // Login ok -> redireciona para o painel
      window.location.href = "/admin";
    } catch {
      setErro("Erro ao tentar fazer login. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* LOGO / TÍTULO */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            Painel Administrativo
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Acesso restrito à equipe do Tabanez.
          </p>
        </div>

        {/* CARD DE LOGIN */}
        <div className="bg-white text-neutral-900 rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-neutral-900">
            Entrar no painel
          </h2>

          {erro && (
            <p className="mb-3 text-sm bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {erro}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-800">
                Usuário
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Digite o usuário"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Digite a senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full mt-2 px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark disabled:opacity-60"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-neutral-500 text-center">
            As credenciais são definidas nas variáveis de ambiente do servidor
            (ADMIN_USER / ADMIN_PASS).
          </p>
        </div>
      </div>
    </div>
  );
}