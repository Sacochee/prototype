// middleware.js
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/NextAuth";

export default function proxy(request: NextRequest) {
  const session = getServerSession(authOptions);
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!session && !isLoginPage) {
    // Redirige l'utilisateur non authentifié vers la page de connexion
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login).*)"], // Protège toutes les routes sauf /login
};
