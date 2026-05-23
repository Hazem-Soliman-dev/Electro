import { NextRequest, NextResponse } from "next/server";
import { dbActions } from "@/lib/db";

// PUT to edit a menu item
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const updated = await dbActions.updateMenuItem(id, body);
    if (!updated) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to update menu item" },
      { status: 500 }
    );
  }
}

// DELETE to remove a menu item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await dbActions.deleteMenuItem(id);
    if (!deleted) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Menu item deleted successfully" });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
