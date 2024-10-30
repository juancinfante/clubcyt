import mongoose, { Schema, model, models } from "mongoose";

const CodigoSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios'
    },
    codigo: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    
})

const Codigo = models.Codigos || model("Codigos", CodigoSchema);

export default Codigo;
