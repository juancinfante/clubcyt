import Usuario from "@/models/usuarios";
import { connectDB } from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {

    await connectDB(); // Conectar a la base de datos

    try {
        const { nombre, apellido, email, password, dni } = await req.json(); // Obtener los datos del cuerpo de la solicitud

        // Verificar si el usuario ya existe por email
        const existingUser = await Usuario.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ emailExists: true, error: 'El email ya está registrado' }, { status: 400 });
        }
        const existingDNI= await Usuario.findOne({ dni });
        if (existingDNI.dni == dni) {
            return NextResponse.json({ dniExists: true, error: 'El dni ya está registrado' }, { status: 400 });
        }

        // Crear el nuevo usuario
        const newUser = new Usuario({
            nombre,
            apellido,
            email,
            password,
            dni
        });

        // Guardar el usuario en la base de datos
        await newUser.save();

        // Devolver el usuario sin contraseña
        const { contraseña, ...userWithoutPassword } = newUser._doc._id; // Eliminar la contraseña del objeto a devolver

        return NextResponse.json({ message: 'Registro exitoso', _id: newUser._doc._id }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
    }
}
