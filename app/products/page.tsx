"use client";

import { useEffect, useState, useMemo } from "react";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import ProductCard from "@/components/product-card";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string | null;
  originalPrice: string | null;
  imageUrl: string | null;
  cloudinaryPublicId: string | null;
  mediaType: "image" | "video" | null;
  features: string[];
  specifications: Record<string, string>;
  featured: boolean;
  inStock: boolean;
  discount: number;
  rating: number;
  reviews: number;
  createdAt: Date;
}

interface Category {
  name: string;
  count: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]); // Adjusted for Naira
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch("/api/products/get");
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        if (productsData.success && Array.isArray(productsData.products)) {
          setProducts(productsData.products);
        } else {
          throw new Error("Invalid products response");
        }

        // Fetch categories (assuming /api/categories exists)
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success && Array.isArray(categoriesData.categories)) {
          setCategories(categoriesData.categories);
        } else {
          throw new Error("Invalid categories response");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load products or categories. Please try again.",
          variant: "destructive",
        });
        setProducts([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const filtered = products.filter((product: Product) => {
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      if (inStockOnly && !product.inStock) {
        return false;
      }

      if (product.price) {
        const price = Number.parseFloat(product.price.replace(/[^0-9.]/g, ""));
        if (isNaN(price) || price < priceRange[0] || price > priceRange[1]) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a: Product, b: Product) => {
          const priceA = a.price ? Number.parseFloat(a.price.replace(/[^0-9.]/g, "")) : 0;
          const priceB = b.price ? Number.parseFloat(b.price.replace(/[^0-9.]/g, "")) : 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        sorted.sort((a: Product, b: Product) => {
          const priceA = a.price ? Number.parseFloat(a.price.replace(/[^0-9.]/g, "")) : 0;
          const priceB = b.price ? Number.parseFloat(b.price.replace(/[^0-9.]/g, "")) : 0;
          return priceB - priceA;
        });
        break;
      case "rating":
        sorted.sort((a: Product, b: Product) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort((a: Product, b: Product) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
      default:
        sorted.sort((a: Product, b: Product) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return sorted;
  }, [products, searchQuery, selectedCategories, priceRange, sortBy, inStockOnly]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search Products</Label>
        <Input
          placeholder="Search machinery..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="space-y-3">
        <Label>Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center space-x-2">
              <Checkbox
                id={category.name}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={(checked) => handleCategoryChange(category.name, checked as boolean)}
              />
              <Label htmlFor={category.name} className="text-sm">
                {category.name} ({category.count})
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Label>Price Range (₦)</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={10000000}
            min={0}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked === true)}
        />
        <Label htmlFor="inStock" className="text-sm">
          In Stock Only
        </Label>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSearchQuery("");
          setSelectedCategories([]);
          setPriceRange([0, 10000000]);
          setInStockOnly(false);
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:px-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Nylon Production Machinery</h1>
              <p className="text-muted-foreground">
                Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          <Card className="hidden lg:block h-fit">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5" />
                <h3 className="font-semibold">Filters</h3>
              </div>
              <FilterContent />
            </CardContent>
          </Card>
          <div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                    setPriceRange([0, 10000000]);
                    setInStockOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}