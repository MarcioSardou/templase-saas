import { stripe } from "@/app/lib/stripe";
import { handleStripeCancel } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") || "";

    if (!secret || !signature) {
      return NextResponse.json(
        { error: "Webhook secret not set" },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
      case "checkout.session.completed":
        const metadata = event.data.object.metadata;
        console.log("metadata", metadata);
        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event);
        }
        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event);
        }
        break;
      case "checkout.session.expired":
        console.log("ENVIAR EMAIL PARA USUARIO AVISANDO Q PAGAMENTO EXPIROU");
        break;
      case "checkout.session.async_payment_succeeded":
        console.log("ENVIAR EMAIL PARA USUARIO AVISANDO Q PAGAMENTO SUCESSO");
        break;
      case "checkout.session.async_payment_failed":
        console.log("ENVIAR EMAIL PARA USUARIO AVISANDO Q PAGAMENTO FALHOU");
        break;
      case "customer.subscription.created":

        console.log("ENVIAR EMAIL PARA USUARIO AVISANDO Q ASSINATURA CRIADA");
        break;
      case "customer.subscription.deleted":
        await handleStripeCancel(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.log("Error in Stripe webhook", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
