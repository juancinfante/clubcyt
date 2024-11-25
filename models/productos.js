import mongoose, { Schema, model, models } from "mongoose";
import { type } from "os";
import slugify from "slugify";

const ProductSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
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
        required: true
    },
    suscriptionId: {
        type: String
    },
    status: {
        type: String
    },

    slug: {
        type: String,
        unique: true
    },
    services: {
        type: Object,
        required: false,
    },
    popularServices: {
        type: [],
        required: false,
    },
    codigoPromo: {
        type: String,
    },
    dateSuscription: {
        type: Date,
        default: null // Por defecto, lo inicializamos en null
    },
    dateCancelation: {
        type: Date,
        default: null // Por defecto, lo inicializamos en null
    },
    razonSocial: {
        type: String,
    },
    cuit: {
        type: Number,
    },
    direccionFiscal: {
        type: String,
    },
    
    promociones: [
        {
            type: Schema.Types.ObjectId,
            ref: "Promocion",
        },
    ],
},
    {
        timestamps: true // Habilita createdAt y updatedAt automáticamente
    },)

// Middleware para generar el slug antes de guardar
ProductSchema.pre('save', function (next) {
    if (!this.slug) {
        // Generar el slug solo si no existe
        this.slug = slugify(this.nombre, {
            lower: true, // Convierte a minúsculas
            strict: true, // Elimina caracteres no válidos
            replacement: '-', // Usa guiones como separador
        });
    }
    next();
});

const Producto = models.Productos || model("Productos", ProductSchema);

export default Producto;
