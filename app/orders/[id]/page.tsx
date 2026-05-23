import { dbActions } from "@/lib/db";
import { notFound } from "next/navigation";
import { OrderTrackerClient } from "./OrderTrackerClient";

export const dynamic = "force-dynamic";

interface OrderTrackingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params;
  const order = await dbActions.getOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderTrackerClient initialOrder={order} />;
}
