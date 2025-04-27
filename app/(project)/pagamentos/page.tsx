"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function Pagamentos() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  } = useStripe();

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Pagamentos</h1>
      <button
        className="border rounded-md px-1 cursor-pointer"
        onClick={() => createPaymentStripeCheckout({ testId: "1234" })}
      >
        Criar pagamento Stripe
      </button>
      <button
        className="border rounded-md px-1 cursor-pointer"
        onClick={() => createSubscriptionStripeCheckout({ testId: "12345" })}
      >
        Criar assinatura Stripe
      </button>
      <button
        className="border rounded-md px-1 cursor-pointer"
        onClick={() => handleCreateStripePortal()}
      >
        Criar portal de pagamentos
      </button>
    </div>
  );
}
