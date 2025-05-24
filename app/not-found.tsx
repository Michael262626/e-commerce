import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 md:px-6 text-center">
      <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl">404</h1>
      <h2 className="text-3xl font-bold tracking-tight mt-4">Page Not Found</h2>
      <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed mt-4">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link href="/" className="mt-8">
        <Button>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
