import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("token desde middlewarre", token)
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
  const protectedPaths = ["/cuenta", "/cuenta/new", "/cuenta/edit", "/cuenta/:path*", "/admin"];
  const isProtectedPath = protectedPaths.some((path) => url.pathname.startsWith(path));

  if (isProtectedPath) {
    if (!token) {
      // Redirigir al inicio si el usuario no está autenticado
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith("/admin")) {
      // Verifica el valor del token y el rol
      console.log("Token completo:", token);  // Imprime el token completo
      console.log("Rol del usuario:", token.user?.role);  // Verifica el rol
    
      const userRole = token.user?.role || "user";  // Manejo de fallback por si no existe el role
      if (userRole !== "admin") {
        console.log("Acceso denegado: El usuario no es admin.");
        url.pathname = "/";  // Redirigir a la página principal
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

// Configuración de las rutas protegidas
export const config = {
  matcher: [
    "/cuenta/:path*", 
    "/cuenta/new", 
    "/cuenta/edit", 
    "/admin", 
    "/login", 
    "/register" // Agrega login y register a la configuración del middleware
  ],
};
