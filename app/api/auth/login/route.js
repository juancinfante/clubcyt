import Usuario from "@/models/usuarios";
import { connectDB } from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB(); // Conectar a la base de datos

    try {
        const { email, password } = await req.json(); // Obtener los datos del cuerpo de la solicitud
        // Verificar si el usuario existe
        const user = await Usuario.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Email o contraseña incorrecto' }, { status: 404 });
        }

        if (password != user.password) {
            return NextResponse.json({ error: 'Email o contraseña incorrecto' }, { status: 401 });
        }

        return NextResponse.json({ message: 'Login exitoso', _id: user._id, verificado: user.email_verificado });
    } catch (error) {
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
    }
}