import Producto from "@/models/productos";
import Usuario from "@/models/usuarios";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});


export async function POST(request) {
  // Obtenemos el cuerpo de la petición que incluye el tipo de notificación
  const body = await request.json();

  // Solo nos interesan las notificaciones de suscripciones
  if (body.type === "subscription_preapproval") {
    // Obtenemos la suscripción
    const preapproval = await new PreApproval(mercadopago).get({ id: body.data.id });
    console.log(preapproval)
    // Buscar primero en Productos
    let producto = await Producto.findOne({ suscriptionId: preapproval.id });

    if (producto) {
      // Si se encuentra en Productos, actualiza el estado correspondiente
      if (preapproval.status === "authorized") {
        await Producto.findOneAndUpdate(
          { suscriptionId: preapproval.id },
          { status: "authorized", activado: true },
          { new: true, runValidators: true }
        );
      } else if (preapproval.status === "cancelled") {
        await Producto.findOneAndUpdate(
          { suscriptionId: preapproval.id },
          { status: "cancelled", activado: false },
          { new: true, runValidators: true }
        );
      }
    } else {
      // Si no se encuentra en Productos, buscar en Usuario
      let usuario = await Usuario.findOne({ suscriptionId: preapproval.id });

      if (usuario) {
        if (preapproval.status === "authorized") {
          await Usuario.findOneAndUpdate(
            { suscriptionId: preapproval.id },
            { status: "authorized", suscripto: true },
            { new: true, runValidators: true }
          );
        } else if (preapproval.status === "cancelled") {
          await Usuario.findOneAndUpdate(
            { suscriptionId: preapproval.id },
            { status: "cancelled", suscripto: false },
            { new: true, runValidators: true }
          );
        }
      }
    }
  }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, { status: 200 });
}

