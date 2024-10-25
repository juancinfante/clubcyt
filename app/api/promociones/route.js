import Producto from "@/models/productos";
import Promocion from "@/models/promocion"

import { connectDB } from "@/utils/mongoose"
import { NextResponse } from "next/server"

// export async function POST(request) {
//     connectDB()
//     try {
//         const data = await request.json()
//         const newPromocion = new Promocion(data)
//         await newPromocion.save()
//         return NextResponse.json({
//             message: "Promocion creada!"
//         })
//     } catch (error) {
//         return NextResponse.json(error.message, {
//             status: 400
//         })
//     }
// }

export async function POST(request) {
    await connectDB(); // Asegúrate de esperar la conexión
    try {
        const data = await request.json();

        // Crea y guarda la nueva promoción
        const newPromocion = new Promocion(data);
        await newPromocion.save();

        // Aquí suponemos que el producto ID viene en los datos de la promoción
        if (data.productoId) {
            // Actualiza el producto para agregar la nueva promoción
            await Producto.findByIdAndUpdate(
                data.productoId,
                { $push: { promociones: newPromocion._id } }, // Usa $push para agregar el ID de la promoción
                { new: true } // Esto devuelve el producto actualizado
            );
        }

        return NextResponse.json({
            message: "Promocion creada!",
            promocion: newPromocion // Puedes retornar la nueva promoción si es necesario
        });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: error.message }, {
            status: 400
        });
    }
}



export async function GET() {
    await connectDB(); // Conectar a la base de datos

    try {
        // Buscar todas las promociones y hacer populate del nombre del producto referenciado
        const response = await Promocion.find().populate('productoId', 'nombre'); // Suponiendo que el campo de referencia es 'productoId'

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        return NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 });
    }
}

