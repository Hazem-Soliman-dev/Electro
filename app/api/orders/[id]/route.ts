import { NextRequest, NextResponse } from "next/server";
import { dbActions } from "@/lib/db";

// GET specific order details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await dbActions.getOrderById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT / PATCH to update order status or payment status (Admin & Simulator use cases)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus } = body;

    let updatedOrder;

    if (status) {
      updatedOrder = await dbActions.updateOrderStatus(id, status);
    }

    if (paymentStatus) {
      updatedOrder = await dbActions.updateOrderPaymentStatus(id, paymentStatus);
    }

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
