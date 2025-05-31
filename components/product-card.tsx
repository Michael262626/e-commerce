// components/product-card.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WhatsAppButton from "@/components/whatsapp-button";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <div className="flex">
          <div className="relative w-48 h-32 flex-shrink-0 bg-muted/30">
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
                src={product.imageUrl || "/placeholder.svg?height=400&width=400"}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.featured && <Badge className="bg-primary text-white text-xs">⭐ Featured</Badge>}
              {product.discount > 0 && (
                <Badge className="bg-accent text-black font-bold text-xs">-{product.discount}%</Badge>
              )}
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="flex justify-between h-full">
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
                  <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </div>

                {product.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviews || 0})</span>
                  </div>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {product.price ? `₦${Number.parseFloat(product.price).toLocaleString()}` : "Contact for Price"}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₦{Number.parseFloat(product.originalPrice).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <Link href={`/products/${product.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <WhatsAppButton productName={product.name} text="Get Quote" size="sm" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        {product.mediaType === "video" && product.imageUrl ? (
          <video
            src={product.imageUrl}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <Image
            src={product.imageUrl || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && <Badge className="bg-primary text-white">⭐ Featured</Badge>}
          {product.discount > 0 && (
            <Badge className="bg-accent text-black font-bold">-{product.discount}%</Badge>
          )}
          {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
          <h3 className="font-semibold text-secondary line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>
        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews || 0})</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {product.price ? `₦${(product.price)}` : "Contact for Price"}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₦{(product.originalPrice)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Link href={`/products/${product.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-white"
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <WhatsAppButton productName={product.name} text="Get Quote via WhatsApp" className="w-full" />
      </CardFooter>
    </Card>
  );
}