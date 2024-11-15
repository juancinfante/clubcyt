// pages/api/passwordRecovery/password.js

import { connectDB } from '@/utils/mongoose';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import Usuario from '@/models/usuarios';

export async function POST(req) {
    const { email, code, newPassword, confirmPassword } = await req.json();  // Leemos el body del request

    try {
        await connectDB();

        // Verificar si el código es correcto
        const recoveryData = await Usuario.findOne({ email, verificationCode: code });
        if (!recoveryData) {
            return NextResponse.json({ error: 'Código incorrecto o expirado.' }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ error: 'Las contraseñas no coinciden.' }, { status: 400 });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña en la base de datos
        await Usuario.updateOne({ email }, { $set: { password: hashedPassword } });

        // Eliminar el código de recuperación después de usarlo
        await Usuario.updateOne({ email }, { $unset: { verificationCode: "" } });

        return NextResponse.json({ message: 'Contraseña actualizada exitosamente.' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Hubo un error al procesar la solicitud.' }, { status: 500 });
    }
}
