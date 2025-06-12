"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Factory, Menu, Phone, Search, ShoppingCart, User, Heart } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = getCurrentUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [])

  const routes = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/deals", label: "Deals" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-secondary text-white py-2">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>📞 + 234 805-611-2316</span>
              <span className="hidden md:inline">✉️ adeosuntesleem@gmail.com</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline">🚚 Free Delivery on Orders $50,000+</span>
              {/* Removed Admin link from here */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-xl text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Factory className="h-6 w-6" />
                  <span>APP</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`text-lg ${
                        isActive(route.href) ? "font-medium text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.label}
                    </Link>
                  ))}
                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className={`text-lg ${isActive("/admin") ? "font-medium text-primary" : "text-muted-foreground"}`}
                      onClick={() => setIsOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Factory className="h-7 w-7" />
            <span className="hidden sm:inline">APP</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(route.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
                <Input placeholder="Search machinery..." className="pl-10 bg-white text-black w-64" />
              </div>
            </div>

            {/* Action Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent focus:bg-accent active:bg-accent"
            >
              <Heart className="h-5 w-5 text-black" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                2
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent focus:bg-accent active:bg-accent"
            >
              <ShoppingCart className="h-5 w-5 text-black" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                3
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-accent focus:bg-accent active:bg-accent"
                >
                  <User className="h-5 w-5 text-black" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    {/* <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem> */}
                    
                      <DropdownMenuItem asChild className="">
                        <Link href="/auth/login">login</Link>
                      </DropdownMenuItem>
                  
                    {/* <DropdownMenuItem asChild>
                      <Link href="/auth/logout">Logout</Link>
                    </DropdownMenuItem> */}
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/contact">
              <Button size="sm" className="hidden md:flex">
                <Phone className="mr-2 h-4 w-4" />
                Get Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden border-b bg-muted/30 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
          <Input placeholder="Search machinery..." className="pl-10 w-full text-black" />
        </div>
      </div>
    </header>
  )
}