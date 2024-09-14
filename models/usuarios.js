import { Schema, model, models } from "mongoose";

const UsuarioSchema = new Schema({
    nombre:{
        type: String,
        required : true
    },
    apellido: {
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true
    },
    password:{
        type: String,
        required : true
    }
})

const Usuario = models.Usuarios || model("Usuarios", UsuarioSchema);

export default Usuario;

