import { Polar } from "@polar-sh/sdk";

const isPolarConfigured = !!process.env.POLAR_ACCESS_TOKEN;
let polarClient: any = null;

if (isPolarConfigured) {
  try {
    polarClient = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      server: "sandbox", // Use sandbox for testing
    });
  } catch (err) {
    console.error("Failed to initialize Polar client:", err);
  }
}

export const polarActions = {
  createCheckoutSession: async (orderId: string, amount: number, email: string) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    if (!polarClient || !isPolarConfigured) {
      // Fallback mode: return simulation URL
      return `${appUrl}/cart/checkout-simulation?orderId=${orderId}`;
    }

    try {
      // Polar checkout session requires a Product ID.
      // Since food carts have dynamic prices, a production setup would map a dynamic pricing catalog.
      // For this prototype, if POLAR_PRODUCT_ID is not configured, we redirect to the simulator.
      const productId = process.env.POLAR_PRODUCT_ID;
      if (!productId) {
        console.warn("POLAR_PRODUCT_ID is missing. Redirecting to Local Payment Simulator.");
        return `${appUrl}/cart/checkout-simulation?orderId=${orderId}`;
      }

      // Create checkout session
      const checkout = await polarClient.checkouts.create({
        products: [productId],
        amount: Math.round(amount * 100), // In smallest unit of currency (piasters for EGP)
        currency: "egp", // Sets currency to EGP automatically
        customerEmail: email,
        successUrl: `${appUrl}/orders/${orderId}?payment=success`,
        cancelUrl: `${appUrl}/cart?payment=cancel`,
        metadata: {
          orderId,
        }
      });
      
      return checkout.url;
    } catch (err) {
      console.error("Polar checkout creation failed, redirecting to local simulator:", err);
      return `${appUrl}/cart/checkout-simulation?orderId=${orderId}`;
    }
  }
};
