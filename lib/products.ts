"use client"

import { Factory, Cog, Zap, Thermometer, ArrowUpDown, Beaker } from "lucide-react"

// Type definitions
export interface Product {
  id: string
  name: string
  description: string
  category: string
  image?: string
  imageUrl?: string
  imageFile?: File | null
  features?: string[]
  specifications?: Record<string, string>
  featured?: boolean
  date?: string
  price?: string
  originalPrice?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  discount?: number
}

export interface Category {
  name: string
  icon: any
  count: number
  href: string
}

// Initial sample products with enhanced e-commerce data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "NylonSpinner 3000 Pro",
    description:
      "High-speed nylon spinning machine with advanced temperature control for consistent fiber quality and maximum productivity.",
    category: "Spinning Machines",
    image: "/placeholder.svg?height=400&width=400",
    features: [
      "Automatic temperature regulation",
      "Variable speed control from 1000-5000 RPM",
      "Integrated cooling system",
      "Touch screen interface",
    ],
    specifications: {
      Dimensions: "2.5m x 1.8m x 2.2m",
      Weight: "1200 kg",
      Power: "380V, 22kW",
      Capacity: "500 kg/day",
    },
    featured: true,
    date: "2023-05-15",
    price: "$45,000",
    originalPrice: "$52,000",
    rating: 4.8,
    reviews: 24,
    inStock: true,
    discount: 13,
  },
  {
    id: "2",
    name: "ExtruderPro X7 Elite",
    description:
      "Industrial-grade nylon extruder with precision die control and multiple heating zones for superior output quality.",
    category: "Extruders",
    image: "/placeholder.svg?height=400&width=400",
    features: [
      "7 independent heating zones",
      "Digital pressure monitoring",
      "Automatic die cleaning system",
      "Energy-efficient motors",
    ],
    specifications: {
      Dimensions: "3.2m x 1.2m x 1.6m",
      Weight: "1800 kg",
      Power: "415V, 35kW",
      Capacity: "750 kg/day",
    },
    featured: true,
    date: "2023-08-22",
    price: "$68,500",
    originalPrice: "$75,000",
    rating: 4.9,
    reviews: 18,
    inStock: true,
    discount: 9,
  },
  {
    id: "3",
    name: "TwistMaster 2500 Advanced",
    description:
      "Precision twisting machine for nylon yarn with adjustable tension control and automated package handling.",
    category: "Twisting Machines",
    image: "/placeholder.svg?height=400&width=400",
    features: [
      "Electronic tension control",
      "Automatic package doffing",
      "Spindle speed up to 12,000 RPM",
      "Low vibration operation",
    ],
    specifications: {
      Dimensions: "4.5m x 1.5m x 2.0m",
      Weight: "1500 kg",
      Power: "380V, 18kW",
      Capacity: "600 kg/day",
    },
    featured: false,
    date: "2023-11-10",
    price: "$38,900",
    rating: 4.6,
    reviews: 31,
    inStock: true,
  },
  {
    id: "4",
    name: "HeatSet 1800 Premium",
    description:
      "Continuous heat setting machine for nylon fibers with precise temperature control and energy efficiency.",
    category: "Heat Treatment",
    image: "/placeholder.svg?height=400&width=400",
    features: [
      "Digital temperature control ±1°C",
      "Variable speed conveyor",
      "Multiple heating chambers",
      "Automatic cooling zone",
    ],
    specifications: {
      Dimensions: "6.0m x 2.0m x 2.2m",
      Weight: "2200 kg",
      Power: "415V, 45kW",
      Capacity: "800 kg/day",
    },
    featured: false,
    date: "2024-01-05",
    price: "$55,200",
    originalPrice: "$62,000",
    rating: 4.7,
    reviews: 15,
    inStock: false,
    discount: 11,
  },
  {
    id: "5",
    name: "DrawLine 5000 Ultra",
    description:
      "Multi-stage drawing line for nylon fibers with precision tension control and automated threading system.",
    category: "Drawing Machines",
    image: "/placeholder.svg?height=400&width=400",
    features: [
      "5-stage drawing process",
      "Individual godet speed control",
      "Heated godets with PID control",
      "Automatic threading system",
    ],
    specifications: {
      Dimensions: "8.5m x 2.2m x 2.5m",
      Weight: "3500 kg",
      Power: "415V, 60kW",
      Capacity: "1000 kg/day",
    },
    featured: true,
    date: "2024-02-18",
    price: "$89,000",
    originalPrice: "$98,000",
    rating: 4.9,
    reviews: 12,
    inStock: true,
    discount: 9,
  },
  {
    id: "6",
    name: "PolyMix 1200 Smart",
    description: "Advanced polymer mixing system for nylon compound preparation with intelligent recipe management.",
    category: "Mixing Equipment",
    image: "/placeholder.svg?height=400&width=400",
    features: [
      "Vacuum mixing chamber",
      "Automatic additive dispensing",
      "Temperature and humidity control",
      "Recipe management system",
    ],
    specifications: {
      Dimensions: "2.8m x 2.5m x 3.0m",
      Weight: "1600 kg",
      Power: "380V, 25kW",
      Capacity: "1200 kg/day",
    },
    featured: false,
    date: "2023-09-30",
    price: "$42,800",
    rating: 4.5,
    reviews: 22,
    inStock: true,
  },
]

// Product categories with icons and counts
export const getProductCategories = (): Category[] => [
  {
    name: "Spinning Machines",
    icon: Factory,
    count: 8,
    href: "/products?category=spinning",
  },
  {
    name: "Extruders",
    icon: Cog,
    count: 6,
    href: "/products?category=extruders",
  },
  {
    name: "Twisting Machines",
    icon: Zap,
    count: 5,
    href: "/products?category=twisting",
  },
  {
    name: "Heat Treatment",
    icon: Thermometer,
    count: 4,
    href: "/products?category=heat-treatment",
  },
  {
    name: "Drawing Machines",
    icon: ArrowUpDown,
    count: 7,
    href: "/products?category=drawing",
  },
  {
    name: "Mixing Equipment",
    icon: Beaker,
    count: 3,
    href: "/products?category=mixing",
  },
]

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Get products from localStorage or use initial products
const getStoredProducts = (): Product[] => {
  if (!isBrowser) return initialProducts

  const storedProducts = localStorage.getItem("products")
  if (storedProducts) {
    try {
      return JSON.parse(storedProducts)
    } catch (error) {
      console.error("Error parsing stored products:", error)
      return initialProducts
    }
  }

  // If no stored products, save initial products and return them
  localStorage.setItem("products", JSON.stringify(initialProducts))
  return initialProducts
}

// Save products to localStorage
const saveProducts = (products: Product[]): void => {
  if (!isBrowser) return
  localStorage.setItem("products", JSON.stringify(products))
}

// Get all products
export const getAllProducts = (): Product[] => {
  return getStoredProducts()
}

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  const products = getStoredProducts()
  return products.filter((product) => product.featured)
}

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  const products = getStoredProducts()
  return products.find((product) => product.id === id)
}

// Get related products (excluding the current product)
export const getRelatedProducts = (currentId: string, limit = 4): Product[] => {
  const products = getStoredProducts()
  const currentProduct = products.find((product) => product.id === currentId)

  if (!currentProduct) return []

  // First try to find products in the same category
  const sameCategory = products.filter(
    (product) => product.id !== currentId && product.category === currentProduct.category,
  )

  // If we have enough products in the same category, return them
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  // Otherwise, add other products to reach the limit
  const otherProducts = products.filter(
    (product) => product.id !== currentId && product.category !== currentProduct.category,
  )

  return [...sameCategory, ...otherProducts].slice(0, limit)
}

// Add a new product
export const addProduct = (product: Product): void => {
  const products = getStoredProducts()
  products.push(product)
  saveProducts(products)
}

// Update a product
export const updateProduct = (updatedProduct: Product): void => {
  const products = getStoredProducts()
  const index = products.findIndex((product) => product.id === updatedProduct.id)

  if (index !== -1) {
    products[index] = updatedProduct
    saveProducts(products)
  }
}

// Remove a product
export const removeProduct = (id: string): void => {
  const products = getStoredProducts()
  const filteredProducts = products.filter((product) => product.id !== id)
  saveProducts(filteredProducts)
}
