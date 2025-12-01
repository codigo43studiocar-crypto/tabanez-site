"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function login(e) {
    e.preventDefault();

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (data.ok) {
      router.push("/admin/dashboard");
    } else {
      setErro("Credenciais inválidas.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-extrabold mb-5 text-center text-primary">
          Painel Administrativo
        </h1>

        {erro && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">
            {erro}
          </div>
        )}

        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Senha</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-lg"
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
            type="submit"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
