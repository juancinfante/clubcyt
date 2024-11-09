import Usuario from "@/models/usuarios";
import { connectDB } from "@/utils/mongoose";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

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
                // Add logic here to look up the user from the credentials supplied
                // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
                await connectDB()

                const user = await Usuario.findOne({ email: credentials.email }).select("+password")
                if (!user) throw new Error("Invalid credentials");
                if (!user.email_verificado) throw new Error("Revisa tu correo y verifica tu email");
                if(user.password != credentials.password) throw new Error("Invalid credentials");
                
                return user
            }
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