import { NextResponse } from "next/server";

export function middleware(req) {
  const session = req.cookies.get("admin_session")?.value;
  const url = req.nextUrl;

  // Rotas protegidas
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    if (!session) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
