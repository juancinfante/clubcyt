import Producto from "@/models/productos";
import { connectDB } from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
    await connectDB(); // Conectar a la base de datos

    const { searchParams } = new URL(request.url);

    const all = searchParams.get('all') === 'true'; // Verificar si se solicitan todos los productos
    const admin = searchParams.get('admin') === 'true'; // Verificar si se solicita desde el admin
    const text = searchParams.get('text') || ""; // Texto de búsqueda
    const categoria = searchParams.get('categoria') || ""; // Categoría de búsqueda
    const provincia = searchParams.get('provincia') || ""; // Provincia de búsqueda
    const page = parseInt(searchParams.get('page'), 10) || 1; // Página actual (por defecto 1)
    const limit = parseInt(searchParams.get('limit'), 10) || 12; // Límite de productos por página (por defecto 12)

    // Si se solicitan todos los productos sin filtros
    if (all) {
        const productos = await Producto.find().populate({
            path: 'usuarioId',
            select: 'nombre email', // Solo traer nombre y email del usuario
        });

        return NextResponse.json({
            productos,
            totalProductos: productos.length,
        });
    }
     // Convertir el texto a número para buscar por CUIT si es posible
     const cuitNumber = !isNaN(Number(text)) ? Number(text) : null;

    // Construcción dinámica de la query
    const query = {
        ...(admin ? {} : { activado: true }), // Si admin=true, no aplica el filtro 'activado: true'
        ...(text && {
            $or: [
                { nombre: { $regex: text, $options: 'i' } }, // Buscar por nombre
                { categoria: { $regex: text, $options: 'i' } }, // Buscar por categoría
                { provincia: { $regex: text, $options: 'i' } }, // Buscar por provincia 
                { codigoPromo: { $regex: text, $options: 'i' } }, // Buscar por código promocional
                { tags: { $elemMatch: { $regex: text, $options: 'i' } } }, // Buscar en tags
                ...(cuitNumber !== null ? [{ cuit: cuitNumber }] : []),
            ],
        }),
        ...(categoria && { categoria }), // Filtrar por categoría exacta
        ...(provincia && { provincia }), // Filtrar por provincia exacta
    };

    // Calcular documentos a saltar (para la paginación)
    const skip = (page - 1) * limit;

    // Obtener los productos con filtros, paginación y población
    const productos = await Producto.find(query)
        .populate({
            path: 'usuarioId',
            select: 'nombre apellido email', // Solo traer datos específicos del usuario
        })
        .sort({ createdAt: -1 }) // Ordenar por más recientes
        .skip(skip) // Saltar documentos según la página
        .limit(limit); // Limitar la cantidad de resultados

    // Contar el total de documentos que coinciden con la búsqueda
    const totalProductos = await Producto.countDocuments(query);

    return NextResponse.json({
        productos, // Lista de productos
        currentPage: page, // Página actual
        totalPages: Math.ceil(totalProductos / limit), // Total de páginas
        totalProductos, // Total de productos
    });
}




export async function POST(request) {
    connectDB()
    try {
        const data = await request.json()
        const newProduct = new Producto(data)
        await newProduct.save()
        return NextResponse.json({
            message: "Producto creado!"
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}