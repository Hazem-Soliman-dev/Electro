import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { dbActions } from "@/lib/db";
import { OrdersClient } from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await currentUser();

  // If user is not authenticated, redirect to sign-in page
  if (!user) {
    redirect("/sign-in?redirect_url=/orders");
  }

  const userEmail = user.primaryEmailAddress?.emailAddress || "";
  const orders = await dbActions.getOrdersByUserId(userEmail);

  return <OrdersClient initialOrders={orders} />;
}
