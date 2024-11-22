import Codigo from "@/models/codigos"
import { connectDB } from "@/utils/mongoose"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        const { codigo, cantidad } = await req.json(); // Obtener datos del cuerpo de la solicitud

        if (!codigo || !cantidad) {
            return NextResponse.json({ error: 'Faltan datos: codigo o cantidad' }, { status: 400 });
        }

        await connectDB();

        // Crear un nuevo código
        const nuevoCodigo = new Codigo({
            codigo,
            cantidad,
        });

        // Guardar el nuevo código en la base de datos
        await nuevoCodigo.save();

        return NextResponse.json({ message: 'Código agregado exitosamente' }, { status: 201 });
    } catch (error) {
        console.error("Error al agregar el código:", error);
        return NextResponse.json({ error: 'Hubo un error al agregar el código' }, { status: 500 });
    }
}

export async function getCodigo(codigo) {
    try {
      await connectDB();
  
      // Encuentra el producto y pobla las promociones asociadas
      const codigo = await Codigo.findOne({ codigo });
  
      if (!codigo) throw new Error('Codigo no valido.');
  
      return JSON.parse(JSON.stringify(prod));
    } catch (error) {
      console.log(error);
      // Puedes manejar el error de otra forma si lo necesitas
    }
  }

  export async function GET(req) {
    const { searchParams } = new URL(req.url);
    await connectDB(); // Conectar a la base de datos

    try {
        // Obtener los parámetros de búsqueda y paginación
        const searchQuery = searchParams.get('search') || ''; // Obtiene el parámetro de búsqueda
        const page = parseInt(searchParams.get('page')) || 1; // Página actual
        const limit = parseInt(searchParams.get('limit')) || 10; // Límites de resultados por página

        // Crear una expresión regular para la búsqueda (para nombre, email, etc.)
        const regex = new RegExp(searchQuery, 'i'); // Búsqueda insensible a mayúsculas

        // Calcular el número de saltos y límites para la paginación
        const skip = (page - 1) * limit;

        // Buscar los códigos que coinciden con la búsqueda
        const codigos = await Codigo.find({
            $or: [
                { codigo: regex },
                { descripcion: regex },
            ],
        })
            .skip(skip) // Aplicar paginación (saltamos los resultados de las páginas anteriores)
            .limit(limit); // Limitar los resultados por página

        // Contar el total de códigos para la paginación
        const totalCodigos = await Codigo.countDocuments({
            $or: [
                { codigo: regex },
                { descripcion: regex },
            ],
        });

        const totalPages = Math.ceil(totalCodigos / limit); // Calcular el total de páginas

        // Retornar los códigos encontrados con la información de la paginación
        return NextResponse.json({
            codigos, 
            totalPages,
            currentPage: page,
            totalCodigos,
        });
    } catch (error) {
        console.error('Error al obtener los códigos:', error);
        return NextResponse.json({ error: 'Error al obtener los códigos' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json(); // Obtener el id del cuerpo de la solicitud

        if (!id) {
            return NextResponse.json({ error: 'Falta el ID del código' }, { status: 400 });
        }

        await connectDB();

        // Eliminar el código por ID
        const deletedCodigo = await Codigo.findByIdAndDelete(id);

        if (!deletedCodigo) {
            return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Código eliminado exitosamente' }, { status: 200 });
    } catch (error) {
        console.error("Error al eliminar el código:", error);
        return NextResponse.json({ error: 'Hubo un error al eliminar el código' }, { status: 500 });
    }
}

export async function PUT(req) {
    const { id, codigo, cantidad } = await req.json(); // Obtener los datos del cuerpo de la solicitud

    if (!id || !codigo || cantidad === undefined) {
        return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    try {
        await connectDB();

        // Buscar y actualizar el código por ID
        const updatedCodigo = await Codigo.findByIdAndUpdate(
            id,
            { codigo, cantidad },
            { new: true } // Retornar el código actualizado
        );

        if (!updatedCodigo) {
            return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 });
        }

        return NextResponse.json(updatedCodigo, { status: 200 });
    } catch (error) {
        console.error('Error al actualizar el código:', error);
        return NextResponse.json({ error: 'Error al actualizar el código' }, { status: 500 });
    }
}