import Usuario from "@/models/usuarios"
import { connectDB } from "@/utils/mongoose"
import { NextResponse } from "next/server"// Asegúrate de tener la ruta correcta de tu archivo de conexión a la DB

export async function GET(request, { params }) {
    connectDB();
    console.log(params)
    try {
        const { id } = params; // Obtener el ID de los parámetros de la URL
        const usuario = await Usuario.findById(id); // Buscar el usuario por su ID
        
        if (!usuario) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }
        
        return NextResponse.json(usuario);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}
