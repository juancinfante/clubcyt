import Usuario from "@/models/usuarios";
import { connectDB } from "@/utils/mongoose";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcrypt';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@gmail.com" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req) {
                await connectDB();

                // Buscar al usuario por el email
                const user = await Usuario.findOne({ email: credentials.email }).select("+password");

                // Si no existe el usuario, retornar un error
                if (!user) throw new Error("Email o contraseña incorrectos.");

                // Verificar si el email está verificado
                if (!user.email_verificado) throw new Error("Revisa tu correo y verifica tu email");

                // Comparar la contraseña proporcionada con la contraseña hasheada en la base de datos
                const isMatch = await bcrypt.compare(credentials.password, user.password);

                // Si las contraseñas no coinciden, retornar un error
                if (!isMatch) throw new Error("Email o contraseña incorrectos.");

                // Si todo está bien, retornar el usuario
                return user;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        jwt({account, user, token, profile, session}){
            if(user) token.user = user;
            return token;
        },
        session({token, session}){
            session.user = token.user;
            return session;
        }

    }
})

export { handler as GET, handler as POST }