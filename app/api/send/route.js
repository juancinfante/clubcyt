import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { to, subject, html } = await req.json(); // Parsear el JSON del body
    // Configurar Nodemailer (puedes usar Gmail u otro servicio)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "juaninfantejj@gmail.com",
        pass: "emgu qdav aues qtfm",
      },
    });

    // Configurar el correo
    const mailOptions = {
      from: "juaninfantejj@gmail.com",
      to,
      subject,
      html,
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    // Devolver la respuesta en JSON
    return new Response(JSON.stringify({ message: 'Correo enviado con éxito', info }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al enviar el correo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
