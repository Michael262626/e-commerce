// app/deals/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/product-card";
import { Product } from "@/types/product";
import { Clock, Zap, Gift } from "lucide-react";
import Link from "next/link";

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/products/get`, {
          next: { revalidate: 60 },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();
        console.log("Products response:", data);

        if (!data.success || !Array.isArray(data.products)) {
          console.warn("Invalid response format for products");
          setProducts([]);
        } else {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const discountedProducts = products.filter((product) => product.discount > 0);

  return (
    <div className="container bg-white px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-accent text-black text-lg px-4 py-2">🔥 Special Offers</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-secondary md:text-4xl">Exclusive Deals & Discounts</h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
            Save big on premium nylon production machinery with our limited-time offers
          </p>
        </div>

        {/* Featured Deal */}
        <Card className="gradient-primary text-white overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Clock className="w-4 h-4 mr-2" />
                  Limited Time Offer
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">Get 15% Off Your First Order!</h2>
                <p className="text-white/90 text-lg">
                  New customers save big on all nylon production machinery. Professional equipment with expert support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/contact">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                      <Gift className="w-5 h-5 mr-2" />
                      Claim Discount
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold">15%</div>
                <div className="text-xl">OFF</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deal Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20 hover:border-primary transition-colors">
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Flash Sales</h3>
              <p className="text-muted-foreground mb-4">Limited quantity deals with massive savings</p>
              <Badge className="bg-accent text-black">Up to 20% OFF</Badge>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 hover:border-secondary transition-colors">
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-secondary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Bundle Deals</h3>
              <p className="text-muted-foreground mb-4">Save more when you buy multiple machines</p>
              <Badge className="bg-secondary text-white">Save $10,000+</Badge>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent transition-colors">
            <CardContent className="p-6 text-center">
              <div className="rounded-full bg-accent/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Seasonal Offers</h3>
              <p className="text-muted-foreground mb-4">Special pricing during peak seasons</p>
              <Badge className="bg-primary text-white">Limited Time</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Discounted Products */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-secondary">Products on Sale</h2>
            <Link href="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold text-secondary mb-2">Loading Deals...</h3>
                <p className="text-muted-foreground mb-4">Please wait while we fetch the latest offers.</p>
              </CardContent>
            </Card>
          ) : discountedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {discountedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold text-secondary mb-2">No Active Deals</h3>
                <p className="text-muted-foreground mb-4">Check back soon for exciting offers on our machinery</p>
                <Link href="/products">
                  <Button>Browse All Products</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}