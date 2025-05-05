import Usuario from "@/models/usuarios";
import QRCode from "qrcode";

export async function POST(request) {
  try {
    const { userId } = await request.json(); // Recibe el ID del usuario
    console.log(userId)
    if (!userId) {
      return new Response(JSON.stringify({ error: "Falta el ID del usuario" }), { status: 400 });
    }

    // Generar el QR con la URL del usuario
    const qrCodeData = `https://clubcyt.com/user/${userId}`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    // Guardar el QR en la base de datos
    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { _id: userId},
      { qrcode: qrCodeImage,
        status: "authorized",
       },
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "QR generado exitosamente", qr: qrCodeImage }), { status: 200 });
  } catch (error) {
    console.error(error);
    // return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}
