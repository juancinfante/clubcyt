import Promocion from "@/models/promocion";
import { connectDB } from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    await connectDB(); // Conectar a la base de datos

    const { id } = params; // Extrae el id desde los params de la URL
    const data = await req.json(); // Obtiene los datos enviados en el cuerpo de la petición

    try {
        // Actualiza el producto con el ID proporcionado con los datos del cuerpo de la petición
        const updatedProm = await Promocion.findByIdAndUpdate(id, data, {
            new: true, // Devuelve el documento actualizado
            runValidators: true, // Ejecuta las validaciones del modelo en los datos actualizados
        });

        if (!updatedProm) {
            return NextResponse.json({ error: 'Promocion no encontrada' }, { status: 404 });
        }

        return NextResponse.json(updatedProm);
    } catch (error) {
        console.error('Error al actualizar la promocion:', error);
        return NextResponse.json({ error: 'Error al actualizar la promocion' }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    await connectDB(); // Conectar a la base de datos

    const { id } = params; // Extrae el id desde los params de la URL

    try {
        // Eliminar el producto con el ID proporcionado
        await Promocion.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Promocion eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return NextResponse.json({ error: 'Error al eliminar la promocion' }, { status: 500 });
    }
}