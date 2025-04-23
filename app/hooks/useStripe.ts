import { Stripe, loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    async function loadStripeAsync() {
      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!
      );
      setStripe(stripeInstance);
    }

    loadStripeAsync();
  }, []);

  async function createPaymentStripeCheckout(checkouData: unknown) {
    if (!stripe) return;

    try {
      const response = await fetch("/api/stripe/create-pay-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkouData),
      });

      const data = await response.json();

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.log(error);
    }
  }
  // func to create the stripe checkout ( pay one time )

  async function createSubscriptionStripeCheckout(checkouData: unknown) {
    if (!stripe) return;

    try {
      const response = await fetch("/api/stripe/create-subscription-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkouData),
      });

      const data = await response.json();
      if (data.error) {
        console.log(data.error);
        return;
      }

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.log(error);
    }
  }
  //func to create the stripe checkout ( pay subscription )

  async function handleCreateStripePortal() {
    if (!stripe) return;
  
    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe portal URL missing:", data);
      }
    } catch (error) {
      console.log("Erro ao criar portal Stripe:", error);
    }
  }
  //func to create the stripe portal ( for subscription management )

  return {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  };
}
