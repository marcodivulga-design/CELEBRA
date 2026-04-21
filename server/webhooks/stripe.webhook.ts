import { Request, Response } from "express";
import Stripe from "stripe";
import { getDb } from "../db";
import { notifyOwner } from "../_core/notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("[Stripe] Checkout session completed:", session.id);

  const db = await getDb();
  if (!db) return;

  try {
    // Extract user info from metadata
    const userId = session.metadata?.user_id;
    const customerEmail = session.metadata?.customer_email;
    const customerName = session.metadata?.customer_name;

    if (!userId) {
      console.error("No user_id in session metadata");
      return;
    }

    // Update user subscription status
    // This assumes you have a subscriptions table
    // Adjust based on your actual schema
    console.log(`User ${userId} completed checkout. Email: ${customerEmail}`);

    // Send notification to owner
    await notifyOwner({
      title: "Nova Assinatura",
      content: `${customerName} (${customerEmail}) completou o checkout. Session: ${session.id}`,
    });
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Stripe] Payment intent succeeded:", paymentIntent.id);

  try {
    const metadata = paymentIntent.metadata;
    const userId = metadata?.user_id;
    const amount = paymentIntent.amount;
    const currency = paymentIntent.currency;

    console.log(`Payment of ${amount} ${currency} succeeded for user ${userId}`);

    // Log payment in database if needed
    // Update user account balance or subscription status

    await notifyOwner({
      title: "Pagamento Processado",
      content: `Pagamento de ${(amount / 100).toFixed(2)} ${currency.toUpperCase()} foi processado com sucesso.`,
    });
  } catch (error) {
    console.error("Error handling payment_intent.succeeded:", error);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("[Stripe] Invoice paid:", invoice.id);

  try {
    const customerId = invoice.customer as string;
    const amount = invoice.amount_paid;
    const currency = invoice.currency;

    console.log(`Invoice ${invoice.id} paid. Amount: ${amount} ${currency}`);

    // Update subscription status in database
    // Mark invoice as paid

    await notifyOwner({
      title: "Fatura Paga",
      content: `Fatura ${invoice.number} foi paga. Valor: ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`,
    });
  } catch (error) {
    console.error("Error handling invoice.paid:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("[Stripe] Subscription updated:", subscription.id);

  try {
    const customerId = subscription.customer as string;
    const status = subscription.status;

    console.log(`Subscription ${subscription.id} updated. Status: ${status}`);

    // Update subscription status in database
    // Update renewal date

    await notifyOwner({
      title: "Assinatura Atualizada",
      content: `Assinatura ${subscription.id} foi atualizada. Status: ${status}.`,
    });
  } catch (error) {
    console.error("Error handling customer.subscription.updated:", error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("[Stripe] Subscription deleted:", subscription.id);

  try {
    const customerId = subscription.customer as string;
    console.log(`Subscription ${subscription.id} was cancelled`);

    // Mark subscription as cancelled in database
    // Downgrade user to free plan

    await notifyOwner({
      title: "Assinatura Cancelada",
      content: `Assinatura ${subscription.id} foi cancelada pelo usuário.`,
    });
  } catch (error) {
    console.error("Error handling customer.subscription.deleted:", error);
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("[Stripe] Charge refunded:", charge.id);

  try {
    const amount = charge.amount_refunded;
    const currency = charge.currency;
    console.log(`Charge ${charge.id} was refunded. Amount: ${amount} ${currency}`)

    // Log refund in database
    // Update user account balance

    await notifyOwner({
      title: "Reembolso Processado",
      content: `Reembolso de ${(amount / 100).toFixed(2)} ${currency.toUpperCase()} foi processado para cobrança ${charge.id}.`,
    });
  } catch (error) {
    console.error("Error handling charge.refunded:", error);
  }
}
