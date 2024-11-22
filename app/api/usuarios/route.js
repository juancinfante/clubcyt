import Usuario from "@/models/usuarios"
import { connectDB } from "@/utils/mongoose"
import { NextResponse } from "next/server"

export async function POST(request) {
    connectDB()
    try {
        const data = await request.json()
        const newUsuario = new Usuario(data)
        await newUsuario.save()
        return NextResponse.json({
            message: "Usuario creado!"
        })
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}

export async function GET(req) {
    connectDB(); // Conexión a la base de datos

    try {
        const { page = 1, limit = 10, text = "" } = Object.fromEntries(
            new URL(req.url).searchParams
        );

        // Conversión de variables de paginación
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        // Construir query dinámica
        const query = {
            // ...(admin !== "true" && { activado: true }), // Filtrar solo usuarios activados si admin no es true
            ...(text && {
                $or: [
                    { nombre: { $regex: text, $options: "i" } }, // Búsqueda por nombre
                    { email: { $regex: text, $options: "i" } }, // Búsqueda por email
                ],
            }),
        };

        // Consultar usuarios con filtros, paginación y orden
        const usuarios = await Usuario.find(query)
            .sort({ createdAt: -1 }) // Ordenar por fecha de creación (más recientes primero)
            .skip(skip)
            .limit(pageSize);

        // Obtener el total de usuarios que coinciden con la consulta
        const total = await Usuario.countDocuments(query);

        // Responder con los usuarios y metadata de paginación
        return NextResponse.json({
            message: "Usuarios obtenidos exitosamente!",
            usuarios,
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        connectDB(); // Conexión a la base de datos
        const data = await request.json(); // Obtenemos el cuerpo de la solicitud
        const { id } = data; // Extraemos el ID del cuerpo

        // Eliminamos el usuario según el ID
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);
        if (!usuarioEliminado) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Respondemos con un mensaje de éxito
        return NextResponse.json({
            message: "Usuario eliminado exitosamente",
            usuario: usuarioEliminado,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Error al eliminar el usuario" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        await connectDB(); // Conexión a la base de datos
        const data = await request.json(); // Obtenemos el cuerpo de la solicitud
        const { id, ...camposActualizados } = data; // Extraemos el ID y los campos a actualizar

        // Verificar si el usuario existe
        const usuarioExistente = await Usuario.findById(id);
        if (!usuarioExistente) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Actualizar los campos permitidos
        Object.keys(camposActualizados).forEach((campo) => {
            if (camposActualizados[campo] !== undefined) {
                usuarioExistente[campo] = camposActualizados[campo];
            }
        });

        // Guardar los cambios en la base de datos
        const usuarioActualizado = await usuarioExistente.save();

        // Responder con un mensaje de éxito y el usuario actualizado
        return NextResponse.json({
            message: "Usuario actualizado exitosamente",
            usuario: usuarioActualizado,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Error al actualizar el usuario" },
            { status: 500 }
        );
    }
}