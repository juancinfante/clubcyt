import Producto from "@/models/productos";
import Usuario from "@/models/usuarios";
import { connectDB } from "@/utils/mongoose";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

// Inicializa MercadoPago con tu accessToken
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export async function POST(req) {
  connectDB();
  try {
    // Asegúrate de que la petición esté en formato JSON
    const { email, producto } = await req.json(); // Obtén el email del cuerpo de la petición
    console.log(email)
    // Busca el usuario en la base de datos
    const user = await Usuario.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuario no encontrado" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    let amount = 2000 ;
    let reason = "Suscripcion ClubCyT"
    if (producto) {
      amount = 8000
      reason = "Suscripcion ClubCyt: " + producto.nombre;
    }
    // Crea la suscripción en Mercado Pago
    const suscription = await new PreApproval(mercadopago).create({
      body: {
        back_url: "https://clubcyt.com/cuenta",
        reason: reason,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: amount,
          currency_id: "ARS",
        },
        payer_email: email,
        status: "pending",
      },
    });

    if (producto) {
      await Producto.findByIdAndUpdate( producto._id, {
        suscriptionId: suscription.id,
        status: suscription.status
      });
    } else {
      // Actualiza el usuario con el ID de la suscripción
      await Usuario.findByIdAndUpdate(user._id, {
        suscriptionId: suscription.id,
        status: suscription.status
      });
    }

    // Devuelve la URL de pago para redirigir al usuario
    return new Response(JSON.stringify({ url: suscription.init_point }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al crear la suscripción:", error);
    return new Response(
      JSON.stringify({ error: "Error al crear la suscripción" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

