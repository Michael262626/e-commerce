// app/products/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import WhatsAppButton from "@/components/whatsapp-button";
import ProductCard from "@/components/product-card";
import { Product } from "@/types/product";

async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      next: { revalidate: 60 }, // Optional: Cache for 60 seconds
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(id: string): Promise<Product[]> {
  try {
    const response = await fetch(`http://localhost:3000/api/products/related?excludeId=${id}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params
  const product = await getProductById(id); // Await product fetch

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(id); // Await related products

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg?height=600&width=600"} // Changed to image
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg text-gray-500 mt-2">{product.category}</p>
          </div>

          <Separator />

          <div className="prose max-w-none dark:prose-invert">
            <h3>Description</h3>
            <p>{product.description}</p>

            {product.features?.length > 0 && (
              <>
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </>
            )}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <>
                <h3>Technical Specifications</h3>
                <ul>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <p className="text-lg font-semibold">Interested in this machine?</p>
            <p className="text-gray-500">
              Contact us directly via WhatsApp to discuss pricing, customization options, and delivery details.
            </p>
            <WhatsAppButton productName={product.name} />

            <div className="flex items-center gap-2 mt-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-500">Or call us at: +234 8056112316</span>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Related Products</h2>
            <Link
              href="/products"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}