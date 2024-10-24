import Promocion from "@/models/promocion"
import { connectDB } from "@/utils/mongoose"
import { NextResponse } from "next/server"

export async function POST(request) {
    connectDB()
    try {
        const data = await request.json()
        const newPromocion = new Promocion(data)
        await newPromocion.save()
        return NextResponse.json({
            message: "Promocion creada!"
        })
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}