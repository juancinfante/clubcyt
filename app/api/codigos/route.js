import Codigo from "@/models/codigos"
import { connectDB } from "@/utils/mongoose"
import { NextResponse } from "next/server"

export async function POST(request) {
    connectDB()
    try {
        const data = await request.json()
        const newCodigo = new Codigo(data)
        await newCodigo.save()
        return NextResponse.json({
            message: "Codigo creado!"
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error.message, {
            status: 400
        })
    }
}

// GET ONE EVENT BY ID
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
