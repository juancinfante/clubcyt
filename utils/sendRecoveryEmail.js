// utils/sendRecoveryEmail.js

import nodemailer from 'nodemailer';

// Esta función envía el correo con el código de recuperación
export const sendRecoveryEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',  // Puedes configurar esto con el proveedor de tu elección
        auth: {
            user: 'miclubcyt@gmail.com',    // Reemplaza con tu email
            pass: 'ghdi hplu cbdh irja',         // Reemplaza con tu contraseña o contraseñas de app de Gmail
        },
    });

    const mailOptions = {
        from: "miclubcyt@gmail.com",
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Tu código de recuperación es: ${code}`,
    };

    return transporter.sendMail(mailOptions);
};
