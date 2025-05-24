"use client"

import { getProductCategories } from "@/lib/products"
import CategoryCard from "@/components/category-card"

export default function CategoriesPage() {
  const categories = getProductCategories()

  return (
    <div className="container bg-white px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col gap-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-secondary md:text-4xl">Product Categories</h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
            Explore our comprehensive range of nylon production machinery organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.name} className="group">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>

        {/* Featured Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-secondary mb-6">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="gradient-primary rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Spinning Machines</h3>
              <p className="text-white/90 mb-4">
                High-performance spinning equipment for consistent nylon fiber production
              </p>
              <div className="text-3xl font-bold">8 Products</div>
            </div>
            <div className="gradient-secondary rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Extruders</h3>
              <p className="text-white/90 mb-4">Advanced extrusion systems for precision nylon processing</p>
              <div className="text-3xl font-bold">6 Products</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
