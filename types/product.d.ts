export interface Product {
    id: string
    name: string
    description: string
    category: string
    image?: string | null
    imageUrl?: string
    imageFile?: File | null
    features: string[]
    specifications?: Record<string, string>
    featured?: boolean
    date?: string
    price?: string | null
    originalPrice?: string
    rating: number
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
  