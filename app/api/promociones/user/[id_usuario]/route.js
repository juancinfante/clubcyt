import Promocion from "@/models/promocion";
import { connectDB } from "@/utils/mongoose";
import { NextResponse } from "next/server";

// La función se llamará al recibir una petición GET
export async function GET(request, { params }) {
    connectDB(); // Conectar a la base de datos
    const { id_usuario } = params; // Obtener el userId de los parámetros de la URL

    try {
        // Buscar todas las promociones que coincidan con el userId y hacer populate del producto
        const promociones = await Promocion.find({ userId: id_usuario }).populate('productoId', 'nombre');

        // Comprobar si se encontraron promociones
        if (promociones.length === 0) {
            return NextResponse.json({ message: "No se encontraron promociones para este usuario." }, { status: 404 });
        }

        return NextResponse.json({
            message: "Promociones encontradas",
            promociones, // Devolver las promociones encontradas con el nombre del producto
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, {
            status: 400
        });
    }
}

