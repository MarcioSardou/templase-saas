"server-only";
import Stripe from 'stripe';


export async function handleStripeCancel(event:Stripe.CustomerSubscriptionDeletedEvent) {

    console.log("Cencelou a assinatura");

}