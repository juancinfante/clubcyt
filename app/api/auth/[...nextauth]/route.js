import Usuario from "@/models/usuarios";
import { connectDB } from "@/utils/mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    // Proveedor de inicio de sesión con credenciales
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        // Buscar al usuario por el email
        const user = await Usuario.findOne({ email: credentials.email }).select("+password");

        // Validar usuario y contraseña
        if (!user) throw new Error("Email o contraseña incorrectos.");
        if (!user.email_verificado) throw new Error("Revisa tu correo y verifica tu email.");
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Email o contraseña incorrectos.");

        // Retorna el usuario si todo es válido
        return user;
      },
    }),

    // Proveedor de inicio de sesión con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
        if (account.provider === "google") {
          await connectDB();
          let existingUser = await Usuario.findOne({ email: profile.email });
      
          if (!existingUser) {
            // Crear un nuevo usuario con valores predeterminados
            existingUser = await Usuario.create({
              email: profile.email,
              nombre: profile.given_name || profile.name || "Nombre no proporcionado",
              apellido: profile.family_name || "Apellido no proporcionado",
              dni: "00000000", // Valor predeterminado
              password: "google-oauth", // Valor no usado, pero requerido por el esquema
              email_verificado: true,
              role: "user", // Rol predeterminado
            });
          }
        }
        return true;
      },
    async jwt({ token, user, account }) {
      // Añadir datos del usuario al token
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          role: user.role || "user",
        };
      }

      // Manejo adicional para Google
      if (account?.provider === "google" && user?.email) {
        const userFromDB = await Usuario.findOne({ email: user.email });
        token.user = {
          id: userFromDB.id,
          nombre: userFromDB.nombre,
          apellido: userFromDB.apellido,
          email: userFromDB.email,
          role: userFromDB.role || "user",
        };
      }

      console.log("JWT Token:", token);
      return token;
    },
    async session({ session, token }) {
      // Incluir datos del token en la sesión
      session.user = token.user;
      console.log("Session:", session);
      return session;
    },
  },
});

export { handler as GET, handler as POST };
