import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface Category {
  name: string
  icon: LucideIcon
  count: number
  href: string
}

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon

  return (
    <Link href={category.href}>
      <div className="group flex flex-col text-black items-center p-4 rounded-xl bg-white hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md border border-gray-100">
        <div className="rounded-full bg-primary/10 group-hover:bg-white/20 p-3 mb-3 transition-colors">
          <Icon className="h-6 w-6 text-primary group-hover:text-white" />
        </div>
        <h3 className="font-medium text-sm text-center mb-1 group-hover:text-white">{category.name}</h3>
        <p className="text-xs text-muted-foreground group-hover:text-white/80">{category.count} items</p>
      </div>
    </Link>
  )
}
