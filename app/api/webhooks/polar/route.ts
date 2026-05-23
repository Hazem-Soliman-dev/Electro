import { NextRequest, NextResponse } from "next/server";
import { dbActions } from "@/lib/db";
import { validateEvent } from "@polar-sh/sdk/webhooks";

// Handle Polar Webhook Events (e.g. payment.success / checkout.succeeded)
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.POLAR_WEBHOOK_SECRET;
    const bodyText = await req.text();

    // Verify signature if secret is configured
    if (secret) {
      const headers = {
        "webhook-id": req.headers.get("webhook-id") || "",
        "webhook-signature": req.headers.get("webhook-signature") || "",
        "webhook-timestamp": req.headers.get("webhook-timestamp") || "",
      };

      try {
        console.log("Verifying Polar Webhook signature...");
        validateEvent(bodyText, headers, secret);
        console.log("Polar Webhook signature verified successfully!");
      } catch (err: any) {
        console.error("Polar Webhook signature verification failed:", err.message || err);
        return NextResponse.json({ message: "Invalid webhook signature" }, { status: 401 });
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(bodyText);
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
    }

    console.log("Received Polar webhook event:", payload.type || payload.event);

    const eventType = payload.type || payload.event;
    const eventData = payload.data || payload;

    // Check if the event signifies a successful checkout/payment
    if (
      eventType === "checkout.succeeded" ||
      eventType === "order.created" ||
      eventType === "payment.success" ||
      eventType === "checkouts.succeeded"
    ) {
      const metadata = eventData.metadata || {};
      const orderId = metadata.orderId || eventData.custom_fields?.orderId || eventData.client_reference_id;

      if (orderId) {
        console.log(`Webhook: Order ${orderId} paid successfully. Updating status...`);
        // Update payment status to paid
        await dbActions.updateOrderPaymentStatus(orderId, "paid");
      } else {
        console.warn("Webhook: Successful payment event received but no orderId was found in metadata.");
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Polar Webhook processing error:", err);
    return NextResponse.json(
      { message: err.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
