import Link from "next/link"
import { Factory, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex text-orange items-center gap-2 font-bold text-xl">
              <Factory className="h-6 w-6 text-orange" />
              <span>APP</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              High-quality industrial machinery for nylon production. Professional equipment with expert support.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Quick Links</h3>
            <ul className="grid gap-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              {/* <li>
                <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                  Admin
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Contact</h3>
            <ul className="grid gap-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">+ (234) 805-611-2316</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">adeosuntesleem@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">
                  4 Irepodun Street
                  <br />
                  Olorunshogo Alabede Area
                  <br />
                  Aboru, Lagos
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Alubarika Poly Product. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
