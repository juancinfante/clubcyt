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