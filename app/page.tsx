import { dbActions } from "@/lib/db";
import { HomeClient } from "./HomeClient";

// Force dynamic rendering to fetch fresh menu items on every request
export const dynamic = "force-dynamic";

export default async function Home() {
  const items = await dbActions.getMenuItems();
  return <HomeClient initialItems={items} />;
}
