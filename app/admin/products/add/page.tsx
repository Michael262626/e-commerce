"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { addProduct } from "@/lib/products"
import { getCurrentUser } from "@/lib/auth"

export default function AddProductPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    image: "",
    imageUrl: "",
    imageFile: null as File | null,
    features: [""],
    specifications: {
      Dimensions: "",
      Weight: "",
      Power: "",
      Capacity: "",
      Material: "",
      Warranty: "",
    },
    featured: false,
    inStock: true,
    discount: 0,
    rating: 0,
    reviews: 0,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }
    setUser(currentUser)
  }, [router, toast])

  const categories = [
    "Spinning Machines",
    "Extruders",
    "Twisting Machines",
    "Heat Treatment",
    "Drawing Machines",
    "Mixing Equipment",
    "Cutting Machines",
    "Packaging Equipment",
  ]

  const handleInputChange = (field: string, value: any) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSpecificationChange = (key: string, value: string) => {
    setProductData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...productData.features]
    updatedFeatures[index] = value
    setProductData((prev) => ({
      ...prev,
      features: updatedFeatures,
    }))
  }

  const addFeature = () => {
    setProductData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }))
  }

  const removeFeature = (index: number) => {
    if (productData.features.length > 1) {
      const updatedFeatures = productData.features.filter((_, i) => i !== index)
      setProductData((prev) => ({
        ...prev,
        features: updatedFeatures,
      }))
    }
  }

  const calculateDiscount = () => {
    if (productData.price && productData.originalPrice) {
      const price = Number.parseFloat(productData.price.replace(/[^0-9.]/g, ""))
      const originalPrice = Number.parseFloat(productData.originalPrice.replace(/[^0-9.]/g, ""))
      if (originalPrice > price) {
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100)
        setProductData((prev) => ({ ...prev, discount }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!productData.name || !productData.description || !productData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Description, Category)",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Filter out empty features
      const filteredFeatures = productData.features.filter((feature) => feature.trim() !== "")

      // Filter out empty specifications
      const filteredSpecifications = Object.fromEntries(
        Object.entries(productData.specifications).filter(([_, value]) => value.trim() !== ""),
      )

      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        features: filteredFeatures,
        specifications: filteredSpecifications,
        image: productData.imageUrl,
        date: new Date().toISOString(),
      }

      addProduct(newProduct)

      toast({
        title: "Success!",
        description: "Product has been added successfully",
      })

      // Reset form
      setProductData({
        name: "",
        description: "",
        category: "",
        price: "",
        originalPrice: "",
        image: "",
        imageUrl: "",
        imageFile: null as File | null,
        features: [""],
        specifications: {
          Dimensions: "",
          Weight: "",
          Power: "",
          Capacity: "",
          Material: "",
          Warranty: "",
        },
        featured: false,
        inStock: true,
        discount: 0,
        rating: 0,
        reviews: 0,
      })

      // Redirect to products management
      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-secondary">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product listing for your catalog</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., NylonSpinner 3000 Pro"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={productData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={productData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed description of the product..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
  <Label htmlFor="image">Product Image</Label>
  <div className="flex gap-2">
    <Input
      id="image-url"
      value={productData.imageUrl || ""}
      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
      placeholder="https://example.com/image.jpg"
      className="flex-1"
    />
    <Button type="button" variant="outline" onClick={() => document.getElementById('file-input')?.click()}>
      <Upload className="h-4 w-4 mr-2" />
      Upload
    </Button>
    <input
      id="file-input"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          handleInputChange("imageFile", file); // store File object
          handleInputChange("imageUrl", imageUrl); // for preview

          const img = new Image();
          img.src = imageUrl;
          img.onload = () => URL.revokeObjectURL(imageUrl);
        }
      }}
    />
  </div>

  {productData.imageUrl && (
    <div className="mt-2">
      <img
        src={productData.imageUrl || "/placeholder.svg"}
        alt="Preview"
        className="w-32 h-32 object-cover rounded-lg border"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg?height=128&width=128";
        }}
      />
    </div>
  )}
</div>

            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set the pricing information for your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Current Price</Label>
                  <Input
                    id="price"
                    value={productData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="$45,000"
                    onBlur={calculateDiscount}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                  <Input
                    id="originalPrice"
                    value={productData.originalPrice}
                    onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                    placeholder="$52,000"
                    onBlur={calculateDiscount}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Discount</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={productData.discount}
                      onChange={(e) => handleInputChange("discount", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              </div>

              {productData.discount > 0 && (
                <Badge className="bg-accent text-black">
                  {productData.discount}% OFF - Save{" "}
                  {productData.originalPrice &&
                    productData.price &&
                    `$${(
                      Number.parseFloat(productData.originalPrice.replace(/[^0-9.]/g, "")) -
                        Number.parseFloat(productData.price.replace(/[^0-9.]/g, ""))
                    ).toLocaleString()}`}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Product Features</CardTitle>
              <CardDescription>List the key features of your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {productData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1"
                  />
                  {productData.features.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeFeature(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addFeature} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>Enter the technical details of your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(productData.specifications).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`spec-${key}`}>{key}</Label>
                    <Input
                      id={`spec-${key}`}
                      value={value}
                      onChange={(e) => handleSpecificationChange(key, e.target.value)}
                      placeholder={`Enter ${key.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
              <CardDescription>Configure additional product settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={productData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={productData.inStock}
                    onCheckedChange={(checked) => handleInputChange("inStock", checked)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    value={productData.rating}
                    onChange={(e) => handleInputChange("rating", Number.parseFloat(e.target.value) || 0)}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviews">Number of Reviews</Label>
                  <Input
                    id="reviews"
                    type="number"
                    value={productData.reviews}
                    onChange={(e) => handleInputChange("reviews", Number.parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="24"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding Product..." : "Add Product"}
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
