export interface Product {
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
  
  export interface Category {
    name: string
    icon: any
    count: number
    href: string
  }
  