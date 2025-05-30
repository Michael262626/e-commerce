import { Category } from '@/types/product'
import { Factory, Cog, Zap, Thermometer, ArrowUpDown, Beaker } from 'lucide-react'

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
