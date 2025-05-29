"use client"

import Link from "next/link"
import { ArrowRight, ChevronRight, Phone, Truck, Shield, Headphones, Award } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ProductCard from "@/components/product-card"
import CategoryCard from "@/components/category-card"
import SearchBar from "@/components/search-bar"
import { getFeaturedProducts, getProductCategories } from "@/lib/products"

export default function Home() {
  const featuredProducts = getFeaturedProducts()
  const categories = getProductCategories()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-20 lg:py-24 gradient-primary overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative px-4 md:px-6 z-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6 text-white">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 w-fit">
                  🔥 Best Deals on Industrial Equipment
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none">
                  Premium Nylon Production Machinery
                </h1>
                <p className="max-w-[600px] text-white/90 text-lg md:text-xl">
                  Discover high-quality, reliable machinery for all your nylon manufacturing needs. Industry-leading
                  technology with expert support and competitive prices.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/products">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10 px-8">
                    Get Quote
                    <Phone className="ml-2 text-black h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto flex justify-center">
              <div className="relative">
                <img
                  alt="Industrial machinery"
                  className="aspect-video overflow-hidden rounded-2xl object-cover shadow-2xl float-animation"
                  height="550"
                  src="/placeholder.svg?height=550&width=800"
                  width="800"
                />
                <div className="absolute -bottom-4 -right-4 bg-accent text-black px-4 py-2 rounded-xl font-bold shadow-lg">
                  🎯 Best Prices Guaranteed!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full py-8 bg-white">
        <div className="container px-4 md:px-6">
          <SearchBar />
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full bg-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-secondary">Shop by Category</h2>
              <p className="text-muted-foreground max-w-[600px]">Find the perfect machinery for your specific needs</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-6xl">
              {categories.map((category) => (
                <CategoryCard key={category.name} category={category} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">⭐ Featured Products</Badge>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-secondary">Best Selling Equipment</h2>
                <p className="text-muted-foreground max-w-[600px]">
                  Discover our most popular nylon production machinery trusted by industry leaders worldwide.
                </p>
              </div>
              <Link href="/products" className="hidden md:block">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  View All Products
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="flex justify-center md:hidden">
              <Link href="/products">
                <Button className="px-8">
                  View All Products
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 gradient-secondary text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-white/20 p-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Free Delivery</h3>
              <p className="text-white/80 text-sm">Free installation and delivery for orders above $50,000</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-white/20 p-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">2 Year Warranty</h3>
              <p className="text-white/80 text-sm">Comprehensive warranty coverage on all machinery</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-white/20 p-4">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">24/7 Support</h3>
              <p className="text-white/80 text-sm">Round-the-clock technical support and maintenance</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-white/20 p-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Quality Assured</h3>
              <p className="text-white/80 text-sm">ISO certified machinery with premium quality guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="w-full py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="rounded-2xl gradient-primary p-8 md:p-12 text-white text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <Badge className="bg-white/20 text-white border-white/30">🎉 Limited Time Offer</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Get 15% Off Your First Order!</h2>
              <p className="text-xl text-white/90">
                New customers get exclusive discount on all nylon production machinery. Contact us now for personalized
                quotes and special pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Claim Discount
                    <Phone className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter
      <section className="w-full py-12 bg-white border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-secondary">Stay Updated</h3>
              <p className="text-muted-foreground">Get the latest deals and product updates</p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="px-6">Subscribe</Button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  )
}
