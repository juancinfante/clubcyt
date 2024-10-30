import Codigo from "@/models/codigos";
import { connectDB } from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB(); // Conectar a la base de datos

    const { codigo } = params; // Extrae el id desde los params de la URL

    try {
        // Buscar todos los productos creados por el usuario con el ID proporcionado
        const response = await Codigo.findOne({ codigo });
        // Verificar si el código no fue encontrado
        if (!response) {
            return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 });
        }
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        return NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 });
    }
}

  
export async function PUT(req, { params }) {
    await connectDB(); // Conectar a la base de datos

    const { codigo } = params; // Extrae el id desde los params de la URL
    const data = await req.json(); // Obtiene los datos enviados en el cuerpo de la petición

    try {
        // Actualiza el producto con el ID proporcionado con los datos del cuerpo de la petición
        const updateCodigo = await Codigo.findByIdAndUpdate(codigo, data, {
            new: true, // Devuelve el documento actualizado
            runValidators: true, // Ejecuta las validaciones del modelo en los datos actualizados
        });

        if (!updateCodigo) {
            return NextResponse.json({ error: 'Codigo no encontrado' }, { status: 404 });
        }

        console.log(updateCodigo)
        return NextResponse.json(updateCodigo);
    } catch (error) {
        console.error('Error al actualizar el Codigo:', error);
        return NextResponse.json({ error: 'Error al actualizar el Codigo' }, { status: 500 });
    }
}