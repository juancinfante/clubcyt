import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.clone();

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) => url.pathname.startsWith(path));

  if (isPublicPath && token) {
    // Si el usuario tiene una sesión activa y está intentando acceder a login o registro, redirigirlo
    url.pathname = "/"; // Redirigir a una página protegida
    return NextResponse.redirect(url);
  }

  // Rutas protegidas generales (requieren autenticación)
  const protectedPaths = ["/cuenta", "/cuenta/new", "/cuenta/edit", "/cuenta/:path*", ];
  const isProtectedPath = protectedPaths.some((path) => url.pathname.startsWith(path));

  if (isProtectedPath) {
    if (!token) {
      // Redirigir al login si el usuario no está autenticado
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Protección adicional para rutas administrativas
    // if (url.pathname.startsWith("/admin")) {
    //   const userRole = token.user.role || "user"; // Asegúrate de enviar el rol en el JWT
    //   if (userRole !== "admin") {
    //     // Redirigir si no tiene permisos
    //     url.pathname = "/"; // Página de acceso denegado
    //     return NextResponse.redirect(url);
    //   }
    // }
  }

  return NextResponse.next();
}

// Configuración de las rutas protegidas
export const config = {
  matcher: [
    "/cuenta/:path*", 
    "/cuenta/new", 
    "/cuenta/edit", 
    "/admin/:path*", 
    "/login", 
    "/register" // Agrega login y register a la configuración del middleware
  ],
};
