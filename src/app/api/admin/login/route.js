import { NextResponse } from "next/server";

const ADMIN_PASSWORD = "Zara@90807060";

export async function POST(req) {
  const { password } = await req.json();

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ ok: true });

    // Criando cookie de sessão
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 3, // 3 horas
    });

    return response;
  }

  return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
}
