// app/api/products/get-id/[id]/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await the params Promise
    const product = await prisma.product.findUnique({
      where: { id }, // Use the resolved id
    });
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}