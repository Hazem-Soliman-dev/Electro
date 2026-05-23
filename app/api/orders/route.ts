import { NextRequest, NextResponse } from "next/server";
import { dbActions } from "@/lib/db";
import { polarActions } from "@/lib/polar";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, totalPrice, paymentMethod, deliveryAddress, deliveryPhone, userName, userEmail } = body;

    // Validate inputs
    if (!items || !items.length || !totalPrice || !paymentMethod || !deliveryAddress || !deliveryPhone || !userName || !userEmail) {
      return NextResponse.json(
        { message: "Missing required order fields" },
        { status: 400 }
      );
    }

    // Create the order in the database (or mock)
    const order = await dbActions.createOrder({
      userId: userEmail, // Clerk ID or Email can represent user in prototype
      userEmail,
      userName,
      items,
      totalPrice,
      paymentMethod,
      polarCheckoutId: null, // to be populated if using real Polar
      deliveryAddress,
      deliveryPhone,
    });

    let checkoutUrl = "";
    if (paymentMethod === "polar") {
      // Create checkout session URL (real Polar or local simulator)
      checkoutUrl = await polarActions.createCheckoutSession(
        order.id,
        parseFloat(totalPrice),
        userEmail
      );
      
      // Update order with checkout session info if needed
      if (checkoutUrl.includes("polar.sh")) {
        // extract checkout ID if applicable or update payment status
        await dbActions.updateOrderPaymentStatus(order.id, "pending");
      }
    }

    return NextResponse.json({
      success: true,
      order,
      checkoutUrl,
    });
  } catch (err: any) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { message: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
