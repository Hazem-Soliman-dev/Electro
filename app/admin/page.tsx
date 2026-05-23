import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { dbActions } from "@/lib/db";
import { AdminClient } from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await currentUser();

  // If not authenticated, redirect to login
  if (!user) {
    redirect("/sign-in?redirect_url=/admin");
  }

  // Fetch orders and items server-side
  const [items, orders] = await Promise.all([
    dbActions.getMenuItems(),
    dbActions.getOrders(),
  ]);

  const isUploadthingConfigured = !!process.env.UPLOADTHING_TOKEN;

  return (
    <AdminClient
      initialItems={items}
      initialOrders={orders}
      isUploadthingConfigured={isUploadthingConfigured}
    />
  );
}
