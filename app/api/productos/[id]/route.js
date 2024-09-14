import Producto from "@/models/productos";
import { connectDB } from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB(); // Conectar a la base de datos

    const { id } = params; // Extrae el id desde los params de la URL

    try {
        // Buscar todos los productos creados por el usuario con el ID proporcionado
        const response = await Producto.findById(id);

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        return NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    await connectDB(); // Conectar a la base de datos

    const { id } = params; // Extrae el id desde los params de la URL
    const data = await req.json(); // Obtiene los datos enviados en el cuerpo de la petición

    try {
        // Actualiza el producto con el ID proporcionado con los datos del cuerpo de la petición
        const updatedProducto = await Producto.findByIdAndUpdate(id, data, {
            new: true, // Devuelve el documento actualizado
            runValidators: true, // Ejecuta las validaciones del modelo en los datos actualizados
        });

        if (!updatedProducto) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }

        console.log(updatedProducto)
        return NextResponse.json(updatedProducto);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    await connectDB(); // Conectar a la base de datos

    const { id } = params; // Extrae el id desde los params de la URL

    try {
        // Eliminar el producto con el ID proporcionado
        await Producto.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
    }
}
