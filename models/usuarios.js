import { Schema, model, models } from "mongoose";

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email_verificado: {
        type: Boolean,
        required: true,
        default: false
    },
    dni: {
        type: Number,
        required: true
    },
    suscripto: {
        type: Boolean,
        default: false
    },
    qrcode: {
        type: String,
    },
    verificationCode: {
        type: String
    },
    suscriptionId: {
        type: String
    },
    status: {
        type: String
    },
    picture: {
        type: String
    },
    role: { type: String, default: "user" },
    dateSuscription: {
        type: Date,
        default: null // Por defecto, lo inicializamos en null
    },
    dateCancelation: {
        type: Date,
        default: null // Por defecto, lo inicializamos en null
    },
},
    {
        timestamps: true // Habilita createdAt y updatedAt automáticamente
    },)

const Usuario = models.Usuarios || model("Usuarios", UsuarioSchema);

export default Usuario;

