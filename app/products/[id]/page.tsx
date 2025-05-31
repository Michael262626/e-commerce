// app/products/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Phone, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WhatsAppButton from "@/components/whatsapp-button";
import ProductCard from "@/components/product-card";
import { Product } from "@/types/product";
import { Metadata } from "next";

async function getProductById(id: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/products/get-id/${id}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!data.success || !data.product) {
      return null;
    }
    return data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(id: string, category: string): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/products/related?excludeId=${id}&category=${encodeURIComponent(category)}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    if (!data.success || !Array.isArray(data.products)) {
      return [];
    }
    return data.products;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | Nylon Production Machinery`,
    description: product.description.slice(0, 160) || `Explore ${product.name} for your nylon production needs.`,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(id, product.category);

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/30">
          {product.mediaType === "video" && product.imageUrl ? (
            <video
              src={product.imageUrl}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <Image
              src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted-foreground mt-2">{product.category}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">
              {product.price ? `₦${(product.price)}` : "Contact for Price"}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ₦{(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <Badge className="bg-accent text-black font-bold">- {product.discount}%</Badge>
            )}
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
            <p className="text-muted-foreground">
              Contact us via WhatsApp for pricing, customization, and delivery details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <WhatsAppButton productName={product.name} className="flex-1" />
              <Button variant="outline" className="flex-1">
                <Phone className="mr-2 h-4 w-4" />
                Call: +234 8056112316
              </Button>
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
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
            >
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}