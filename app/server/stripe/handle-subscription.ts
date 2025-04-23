"server-only";
import Stripe from 'stripe';


export async function handleStripeSubscription(event:Stripe.CheckoutSessionCompletedEvent) {

    if(event.data.object.payment_status === "paid") {
        return console.log("Payment successful, liberar acesso");
    }

    // const customerId = 
}