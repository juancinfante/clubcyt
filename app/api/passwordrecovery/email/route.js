// pages/api/passwordRecovery/email.js

import { connectDB } from '@/utils/mongoose';
import { sendRecoveryEmail } from '@/utils/sendRecoveryEmail';
import { NextResponse } from 'next/server';
import Usuario from '@/models/usuarios';
import crypto from 'crypto';
// utils/generateCode.js


// Esta función genera el código de verificación
export const generateCode = () => {
    return crypto.randomInt(100000, 999999).toString();  // Genera un código de 6 dígitos
};



export async function POST(req) {
    const { email } = await req.json();  // Leemos el email del body del request

    try {
        await connectDB();

        // Verificar si el email existe en la base de datos
        const user = await Usuario.findOne({ email });
        if (!user) {
            return NextResponse.json({
                error: "El email no esta vinculado."
            }, { status: 404 });  // Indicamos el código de estado correcto
        }

        // Generar el código de verificación
        const verificationCode = generateCode();

        // Actualizar el campo verificationCode del usuario si ya existe uno, si no, insertamos uno nuevo
        await Usuario.updateOne(
            { email },
            {
                $set: {
                    verificationCode,
                    createdAt: new Date(),
                },
            },
            { upsert: true }
        );

        // Enviar el email con el código de verificación
        await sendRecoveryEmail(email, verificationCode);

        return NextResponse.json({ message: 'Código de verificación enviado.' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Hubo un error al procesar la solicitud.' }, { status: 500 });
    }
}
