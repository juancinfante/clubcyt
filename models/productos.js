import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
    usuarioId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuarios' },
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    descuento: {
        type: String,
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    portada: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    fotos: {
        type: [],
        required: true
    }
})

const Producto = models.Productos || model("Productos", ProductSchema);

export default Producto;