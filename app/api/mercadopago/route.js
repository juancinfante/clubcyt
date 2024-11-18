import { MercadoPagoConfig, PreApproval } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
  });
  

export async function POST(request) {
  // Obtenemos el cuerpo de la petición que incluye el tipo de notificación
  const body = await request.json();
  console.log("body",body)
  // Solo nos interesan las notificaciones de suscripciones
  if (body.type === "subscription_preapproval") {
    // Obtenemos la suscripción
    const preapproval = await new PreApproval(mercadopago).get({ id: body.data.id });
    console.log("preaproval" ,preapproval)
    // Si se aprueba, actualizamos el usuario con el id de la suscripción
    if (preapproval.status === "authorized") {
      console.log("email", preapproval.payer_email)
      // Actualizamos el usuario con el id de la suscripción
      console.log("authorized")
      console.log(preapproval)
    }
  }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, { status: 200 });
}
