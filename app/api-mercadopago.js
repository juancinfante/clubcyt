import { MercadoPagoConfig, PreApproval } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN, // Asegúrate de configurar este token en el archivo .env
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body; // Obtenemos el email desde el cuerpo de la solicitud

  try {
    const suscription = await new PreApproval(mercadopago).create({
      body: {
        back_url: "https://clubcyt.vercel.app/cuenta",
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

    res.status(200).json({ url: suscription.init_point });
  } catch (error) {
    console.error("Error al crear la suscripción:", error);
    res.status(500).json({ error: "Error al crear la suscripción" });
  }
}
