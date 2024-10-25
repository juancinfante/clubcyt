import Producto from "@/models/productos"
import Promocion from "@/models/promocion"
import Usuario from "@/models/usuarios"
import { connectDB } from "@/utils/mongoose"

// GET ONE EVENT BY ID
export async function getProdByID(id) {
  try {
    await connectDB()

    const prod = await Producto.findById(id)

    if (!prod) throw new Error('Producto no encontrado.')
      console.log(prod)
    return JSON.parse(JSON.stringify(prod))
  } catch (error) {
    console.log(error)
  }
}
// // GET ONE EVENT BY ID
// export async function getProdBySlug(slug) {
//   try {
//     await connectDB()

//     const prod = await Producto.findOne({ slug })

//     if (!prod) throw new Error('Comercio no encontrado.')

//     return JSON.parse(JSON.stringify(prod))
//   } catch (error) {
//     //   handleError(error)
//     console.log(error)
//   }
// }

// GET ONE EVENT BY ID
export async function getProdBySlug(slug) {
  try {
    await connectDB();

    // Encuentra el producto y pobla las promociones asociadas
    const prod = await Producto.findOne({ slug }).populate('promociones'); // Asumiendo que 'promociones' es el campo que tiene la relación

    if (!prod) throw new Error('Comercio no encontrado.');

    return JSON.parse(JSON.stringify(prod));
  } catch (error) {
    console.log(error);
    // Puedes manejar el error de otra forma si lo necesitas
  }
}
// GET ONE EVENT BY ID
export async function getPromociones() {
  try {
    await connectDB();

    // Obtener todas las promociones y hacer populate del producto asociado
    const promociones = await Promocion.find().populate('productoId'); // Asegúrate de que "idProducto" es el campo de referencia al Producto en el esquema de Promocion

    if (!promociones || promociones.length === 0) {
      throw new Error('No hay promociones disponibles');
    }

    return JSON.parse(JSON.stringify(promociones));

  } catch (error) {
    console.log(error);
    return null;
  }
}

// GET ONE User BY ID
export async function getUserByID(id) {
  try {
    await connectDB()

    const user = await Usuario.findById(id)

    if (!user) throw new Error('Usuario no encontrado.')

    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    console.log(error)
  }
}

// GET PRODUCTS BY SEARCH FILTERS
export async function getProductsByFilters({ text, category, province }) {
  try {
    await connectDB();

    // Crear un objeto de consulta dinámico
    const query = {};

    // Si se pasa un texto, buscará coincidencias en el nombre (usando una expresión regular para búsqueda parcial)
    if (text) {
      query.nombre = { $regex: text, $options: "i" }; // "i" para que no sea case-sensitive
    }

    // Si se pasa una categoría, agregarla al query
    if (category) {
      query.categoria = category;
    }

    // Si se pasa una provincia, agregarla al query
    if (province) {
      query.provincia = province;
    }

    // Buscar productos que coincidan con el query dinámico
    const products = await Producto.find(query);

    if (!products.length) throw new Error('No se encontraron productos.');

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    // handleError(error)
    console.log(error);
  }
}
