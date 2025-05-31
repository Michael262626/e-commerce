// app/api/products/featured/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
      },
      take: 8, // Limit to 8 featured products
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch featured products" }, { status: 500 });
  }
}