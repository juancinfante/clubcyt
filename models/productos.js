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
    telefono: {
        type: String,
    },
    celular: {
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
    ig: {
        type: String,
    },
    fb: {
        type: String,
    },
    web: {
        type: String,
    },
    video_youtube: {
        type: String,
    },
    fotos: {
        type: [],
        required: true
    },
    tags: {
        type: [],
        required: true
    },
    activado: {
        type: Boolean,
        default: false
    },
})

const Producto = models.Productos || model("Productos", ProductSchema);

export default Producto;
