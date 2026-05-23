import { NextRequest, NextResponse } from "next/server";
import { dbActions } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nameEn, nameAr, descriptionEn, descriptionAr, price, category, imageUrl, isAvailable } = body;

    if (!nameEn || !nameAr || !descriptionEn || !descriptionAr || !price || !category || !imageUrl) {
      return NextResponse.json(
        { message: "Missing required menu item fields" },
        { status: 400 }
      );
    }

    const item = await dbActions.createMenuItem({
      nameEn,
      nameAr,
      descriptionEn,
      descriptionAr,
      price: price.toString(),
      category,
      imageUrl,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    console.error("Error creating menu item:", err);
    return NextResponse.json(
      { message: err.message || "Failed to create menu item" },
      { status: 500 }
    );
  }
}
