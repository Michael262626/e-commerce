// app/api/products/related/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Product } from "@/types/product";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get("excludeId");
    const category = searchParams.get("category");

    console.log("Query params:", { excludeId, category: category ? decodeURIComponent(category) : null });

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
    };

    if (category) {
      where.category = decodeURIComponent(category);
    }

    const rawProducts = await prisma.product.findMany({
      where,
      take: 4, // Limit to 4 related products
      orderBy: { createdAt: "desc" },
    });

    console.log("Raw products:", rawProducts);

    // Transform products to match Product interface
    const products: Product[] = rawProducts.map((p) => {
      // Transform specifications to Record<string, string>
      let specifications: Record<string, string> = {};
      if (p.specifications && typeof p.specifications === "object" && !Array.isArray(p.specifications)) {
        specifications = Object.fromEntries(
          Object.entries(p.specifications).map(([key, value]) => [
            key,
            typeof value === "string" ? value : String(value),
          ])
        );
      }

      return {
        ...p,
        mediaType: p.mediaType === "image" || p.mediaType === "video" ? p.mediaType : null,
        specifications,
        createdAt: new Date(p.createdAt), // Ensure Date type
      };
    });

    console.log("Transformed products:", products);

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch related products" },
      { status: 500 }
    );
  }
}