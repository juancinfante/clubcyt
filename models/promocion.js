import mongoose, { Schema, model, models } from "mongoose";

const PromocionSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    productoId: {
        type: Schema.Types.ObjectId,
        ref: 'Productos'
    },
    imagen: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    promocion: {
        type: String,
        required: true
    },
    desde:{
        type: String,
        required: false,
    },
    hasta:{
        type: String,
        required: false,
    },
})


const Promocion = models.Promocion || model("Promocion", PromocionSchema);

export default Promocion;
