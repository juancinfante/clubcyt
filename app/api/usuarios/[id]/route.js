import Usuario from "@/models/usuarios"
import { connectDB } from "@/utils/mongoose"
import { NextResponse } from "next/server"// Asegúrate de tener la ruta correcta de tu archivo de conexión a la DB

export async function GET(request, { params }) {
    connectDB();
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

export async function PUT(req, { params }) {
    await connectDB(); // Conectar a la base de datos

    const { id } = params; // Extrae el id desde los params de la URL
    const data = await req.json(); // Obtiene los datos enviados en el cuerpo de la petición

    try {
        // Actualiza el producto con el ID proporcionado con los datos del cuerpo de la petición
        const userUpdate = await Usuario.findByIdAndUpdate(id, data, {
            new: true, // Devuelve el documento actualizado
            runValidators: true, // Ejecuta las validaciones del modelo en los datos actualizados
        });

        if (!userUpdate) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        console.log(userUpdate)
        return NextResponse.json(userUpdate);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return NextResponse.json({ error: 'Error al actualizar el usuario' }, { status: 500 });
    }
}