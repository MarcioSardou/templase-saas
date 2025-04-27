"server-only";
import { db } from '@/app/lib/firebase';
import Stripe from 'stripe';


export async function handleStripeSubscription(event:Stripe.CheckoutSessionCompletedEvent) {
    console.log("handleStripeSubscription", event);
    if(event.data.object.payment_status === "paid") {
        console.log("Payment successful, liberar acesso");

        const metadata = event.data.object.metadata;
        const userId = metadata?.userId;

        if(!userId) {
            return console.error("User ID not found in metadata");
        }

        await db.collection("users").doc(userId).update({
            stripeSubscriptionId: event.data.object.subscription,
            subscriptionStatus: "active",
        })
        // Aqui você pode adicionar a lógica para liberar o acesso do usuário
    }


    // const customerId = 
}