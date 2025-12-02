import { NextResponse } from "next/server";

export async function GET(req) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url));

  // limpa o cookie da sessão
  res.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}