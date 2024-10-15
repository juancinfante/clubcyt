import Producto from "@/models/productos";
import { connectDB } from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
    await connectDB(); // Conectar a la base de datos

    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text') || "";
    const tag = searchParams.get('text') || "";
    const categoria = searchParams.get('categoria') || "";
    const provincia = searchParams.get('provincia') || "";
    const page = parseInt(searchParams.get('page')) || 1; // Página actual, por defecto 1
    const limit = parseInt(searchParams.get('limit')) || 12; // Límite de productos por página, por defecto 10

     // Crear la consulta para buscar por nombre o tags y productos activados
     const query = {
        activado: true,
        ...(text && {
            $or: [
                { nombre: { $regex: text, $options: 'i' } }, // Búsqueda en nombre
                { tags: { $elemMatch: { $regex: text, $options: 'i' } } } // Búsqueda en tags (arreglo)
            ]
        }),
        ...(categoria && { categoria }), // Filtrar por categoría
        ...(provincia && { provincia })  // Filtrar por provincia
    };

    const skip = (page - 1) * limit; // Calcular el número de documentos a saltar

    // Obtener los productos con paginación
    const productos = await Producto.find(query)
        .skip(skip) // Saltar documentos
        .limit(limit); // Límite de productos

    // Contar el total de productos que coinciden con la búsqueda para saber cuántas páginas hay
    const totalProductos = await Producto.countDocuments(query);

    return NextResponse.json({
        productos,
        currentPage: page,
        totalPages: Math.ceil(totalProductos / limit),
        totalProductos,
    });
}


export async function POST(request) {
    connectDB()
    console.log(request.portada)
    try {
        const data = await request.json()
        const newProduct = new Producto(data)
        await newProduct.save()
        return NextResponse.json({
            message: "Producto creado!"
        })
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}