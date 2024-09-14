import Producto from "@/models/productos"
import { connectDB } from "@/utils/mongoose"

// GET ONE EVENT BY ID
export async function getProdByID(id) {
    try {
      await connectDB()
  
      const prod = await Producto.findById(id)
  
      if (!prod) throw new Error('Producto no encontrado.')
  
      return JSON.parse(JSON.stringify(prod))
    } catch (error) {
    //   handleError(error)
    console.log(error)
    }
  }