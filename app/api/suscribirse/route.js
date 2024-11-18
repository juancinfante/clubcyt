import { MercadoPagoConfig, PreApproval } from "mercadopago";

// Inicializa MercadoPago con tu accessToken
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export async function POST(req) {
  // Asegúrate de que la petición esté en formato JSON
  const { email } = await req.json(); // Obtén el email del cuerpo de la petición

  try {
    // Crea la suscripción en Mercado Pago
    const suscription = await new PreApproval(mercadopago).create({
      body: {
        back_url: "https://nb92zqsb-3000.brs.devtunnels.ms/",
        reason: "Suscripción clubcyt",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 100,
          currency_id: "ARS",
        },
        payer_email: email,
        status: "pending",
      },
    });

    // Devuelve la URL de pago para redirigir al usuario
    return new Response(JSON.stringify({ url: suscription.init_point }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al crear la suscripción:", error);
    return new Response(JSON.stringify({ error: "Error al crear la suscripción" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
