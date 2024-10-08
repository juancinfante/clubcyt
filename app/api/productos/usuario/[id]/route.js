import Producto from "@/models/productos";
import Usuario from "@/models/usuarios";
import { connectDB } from "@/utils/mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB(); // Conectar a la base de datos

    const { id } = params; // Extrae el id desde los params de la URL
    
    if (!id) {
        return NextResponse.json({ error: 'El id es requerido' }, { status: 400 });
    }

    try {
        // Buscar todos los productos creados por el usuario con el ID proporcionado
        const productos = await Producto.find({ usuarioId: id }).populate('usuarioId', 'nombre email');

        if (!productos.length) {
            return NextResponse.json({ message: 'No se encontraron productos para este usuario' });
        }

        // Extraer el usuario de uno de los productos (todos tienen el mismo `usuarioId`)
        const usuario = productos[0]?.usuarioId;

        // Comprobar si el usuario está presente
        if (!usuario) {
            console.error('Error: Usuario no encontrado en los productos.');
            return NextResponse.json({ error: 'Usuario no encontrado en los productos' }, { status: 500 });
        }

        // Crear una respuesta con el usuario y todos los productos
        const response = {
            usuario: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email
            },
            productos: productos.map(producto => ({
                _id: producto._id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                categoria: producto.categoria,
                provincia: producto.provincia,
                descuento: producto.descuento,
                portada: producto.portada,
                fotos: producto.fotos,
                logo: producto.logo,
                __v: producto.__v,
                activado: producto.activado
            }))
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
    }
}
