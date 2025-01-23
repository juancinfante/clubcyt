import Producto from "@/models/productos";
import Usuario from "@/models/usuarios";
import QRCode from "qrcode";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export async function POST(request) {
  // Obtenemos el cuerpo de la petición que incluye el tipo de notificación
  const body = await request.json();
  console.log(body)
  // Solo nos interesan las notificaciones de suscripciones
  if (body.type === "subscription_preapproval") {
    // Obtenemos la suscripción
    const preapproval = await new PreApproval(mercadopago).get({ id: body.data.id });

    // Buscar primero en Productos
    let producto = await Producto.findOne({ suscriptionId: preapproval.id });

    if (producto) {
      // Si se encuentra en Productos, actualiza el estado correspondiente y lastUpdated
      if (preapproval.status === "authorized") {
        await Producto.findOneAndUpdate(
          { suscriptionId: preapproval.id },
          {
            status: "authorized",
            activado: true,
            dateSuscription: new Date()
          },
          { new: true, runValidators: true }
        );
      } else if (preapproval.status === "cancelled") {
        await Producto.findOneAndUpdate(
          { suscriptionId: preapproval.id },
          {
            status: "cancelled",
            activado: false,
            dateCancelation: new Date()
          },
          { new: true, runValidators: true }
        );
      }
    } else {
      // Si no se encuentra en Productos, buscar en Usuario
      let usuario = await Usuario.findOne({ suscriptionId: preapproval.id });

      if (usuario) {
        let updates = {};

        if (preapproval.status === "authorized") {
          // Genera el QR con la ruta específica del usuario
          const qrCodeData = `https://clubcyt.vercel.com/user/${usuario._id}`;
          const qrCodeImage = await QRCode.toDataURL(qrCodeData);

          updates = {
            status: "authorized",
            suscripto: true,
            dateSuscription: new Date(),
            qrcode: qrCodeImage, // Inserta el QR generado
          };
        } else if (preapproval.status === "cancelled") {
          updates = {
            status: "cancelled",
            suscripto: false,
            dateCancelation: new Date(),
          };
        }

        // Actualiza el usuario con los cambios correspondientes
        await Usuario.findOneAndUpdate(
          { suscriptionId: preapproval.id },
          updates,
          { new: true, runValidators: true }
        );
      }

    }
  }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, { status: 200 });
}
