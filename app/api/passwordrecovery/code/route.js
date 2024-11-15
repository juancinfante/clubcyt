// pages/api/passwordRecovery/code.js

import { connectDB } from '@/utils/mongoose';
import { NextResponse } from 'next/server';
import Usuario from '@/models/usuarios';

export async function POST(req) {
    const { email, code } = await req.json();  // Leemos el email y el código del body del request

    try {
        await connectDB();

        // Verificar si el código es correcto
        const recoveryData = await Usuario.findOne({ email, verificationCode: code });
        if (!recoveryData) {
            return NextResponse.json({ error: 'Código incorrecto o expirado.' }, { status: 400 });
        }

        return NextResponse.json({ message: 'Código verificado exitosamente.' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Hubo un error al procesar la solicitud.' }, { status: 500 });
    }
}
