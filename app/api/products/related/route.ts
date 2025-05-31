// app/api/products/related/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get("excludeId");
    const category = searchParams.get("category");

    // Validate inputs
    if (!excludeId) {
      return NextResponse.json(
        { success: false, error: "excludeId is required" },
        { status: 400 }
      );
    }

    // Build Prisma query
    const where: any = {
      id: { not: excludeId },
      deletedAt: null,
    };

    if (category) {
      where.category = decodeURIComponent(category);
    }

    const products = await prisma.product.findMany({
      where,
      take: 4, // Limit to 4 related products
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch related products" },
      { status: 500 }
    );
  }
}