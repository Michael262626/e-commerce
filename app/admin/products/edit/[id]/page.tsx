"use client";

import type React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentUser } from '@/lib/auth';

// Validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_DURATION = 15; // 15 seconds
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

interface ProductData {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  originalPrice: string;
  image: string;
  imageUrl: string;
  imageFile: File | null;
  videoUrl: string;
  videoFile: File | null;
  cloudinaryPublicId?: string;
  features: string[];
  specifications: {
    Dimensions: string;
    Weight: string;
    Power: string;
    Capacity: string;
    Speed: string;
    Warranty: string;
  };
  featured: boolean;
  inStock: boolean;
  discount: number;
  rating: number;
  reviews: number;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [user, setUser] = useState<any>(null);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const categories = [
    'Spinning Machines',
    'Extruders',
    'Twisting Machines',
    'Heat Treatment',
    'Drawing Machines',
    'Mixing Equipment',
    'Cutting Machines',
    'Packaging Equipment',
  ];

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        toast({
          title: 'Access Denied',
          description: 'You need admin privileges to access this page',
          variant: 'destructive',
        });
        router.push('/auth/login');
        return;
      }
      setUser(currentUser);

      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const product = await response.json();
        setProductData({
          id: product.id,
          name: product.name || '',
          description: product.description || '',
          category: product.category || '',
          price: product.price || '',
          originalPrice: product.originalPrice || '',
          image: product.image || '',
          imageUrl: product.image || '',
          imageFile: null,
          videoUrl: '',
          videoFile: null,
          cloudinaryPublicId: product.cloudinaryPublicId || '',
          features: product.features?.length ? product.features : [''],
          specifications: product.specifications || {
            Dimensions: '',
            Weight: '',
            Power: '',
            Capacity: '',
            Speed: '',
            Warranty: '',
          },
          featured: product.featured || false,
          inStock: product.inStock !== false,
          discount: product.discount || 0,
          rating: product.rating || 0,
          reviews: product.reviews || 0,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load product. Please try again.',
          variant: 'destructive',
        });
        router.push('/admin/products');
      }
    };

    fetchData();
  }, [id, router, toast]);

  const handleInputChange = useCallback((field: keyof ProductData, value: any) => {
    setProductData((prev) => (prev ? { ...prev, [field]: value } : prev));
  }, []);

  const validateFile = async (file: File): Promise<string | null> => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
    }

    const isVideo = file.type.startsWith('video/');
    if (isVideo && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return `Invalid video format. Please use ${ALLOWED_VIDEO_TYPES.join(', ')}`;
    }
    if (!isVideo && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `Invalid image format. Please use ${ALLOWED_IMAGE_TYPES.join(', ')}`;
    }

    if (isVideo) {
      try {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        await new Promise((resolve) => {
          video.onloadedmetadata = resolve;
        });
        if (video.duration > MAX_VIDEO_DURATION) {
          URL.revokeObjectURL(video.src);
          return `Video duration exceeds ${MAX_VIDEO_DURATION} seconds`;
        }
        URL.revokeObjectURL(video.src);
      } catch {
        return 'Error processing video';
      }
    }

    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaLoading(true);
    setMediaError(null);

    const validationError = await validateFile(file);
    if (validationError) {
      setMediaError(validationError);
      setMediaLoading(false);
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const mediaUrl = URL.createObjectURL(file);

    if (isVideo) {
      handleInputChange('videoFile', file);
      handleInputChange('videoUrl', mediaUrl);
      handleInputChange('imageUrl', '');
      handleInputChange('imageFile', null);
      handleInputChange('image', '');
    } else {
      handleInputChange('imageFile', file);
      handleInputChange('imageUrl', mediaUrl);
      handleInputChange('videoUrl', '');
      handleInputChange('videoFile', null);
      handleInputChange('image', '');
    }

    if (isVideo) {
      const video = document.createElement('video');
      video.src = mediaUrl;
      video.onloadeddata = () => {
        URL.revokeObjectURL(mediaUrl);
        setMediaLoading(false);
      };
    } else {
      const img = new Image();
      img.src = mediaUrl;
      img.onload = () => {
        URL.revokeObjectURL(mediaUrl);
        setMediaLoading(false);
      };
    }
  };

  const handleRemoveMedia = async () => {
    if (productData?.cloudinaryPublicId) {
      try {
        const response = await fetch('/api/products/delete-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: productData.cloudinaryPublicId }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete media');
        }

        toast({
          title: 'Success',
          description: 'Media removed from Cloudinary.',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete media from Cloudinary.',
          variant: 'destructive',
        });
      }
    }
    setProductData((prev) =>
      prev
        ? {
            ...prev,
            image: '',
            imageUrl: '',
            imageFile: null,
            videoUrl: '',
            videoFile: null,
            cloudinaryPublicId: '',
          }
        : prev,
    );
    setMediaError(null);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...(productData?.features || [])];
    updatedFeatures[index] = value;
    handleInputChange('features', updatedFeatures);
  };

  const addFeature = () => {
    handleInputChange('features', [...(productData?.features || []), '']);
  };

  const removeFeature = (index: number) => {
    if (productData && productData.features.length > 1) {
      const updatedFeatures = productData.features.filter((_: string, i: number) => i !== index);
      handleInputChange('features', updatedFeatures);
    }
  };

  const handleSpecificationChange = (key: string, value: string) => {
    handleInputChange('specifications', {
      ...(productData?.specifications || {}),
      [key]: value,
    });
  };

  const calculateDiscount = () => {
    if (productData?.price && productData?.originalPrice) {
      const price = Number.parseFloat(productData.price.replace(/[^0-9.]/g, ''));
      const originalPrice = Number.parseFloat(productData.originalPrice.replace(/[^0-9.]/g, ''));
      if (originalPrice > price) {
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
        handleInputChange('discount', discount);
      } else {
        handleInputChange('discount', 0);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!productData?.name || !productData?.description || !productData?.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (Name, Description, Category)',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (!productData?.imageFile && !productData?.videoFile && !productData?.image && !productData?.imageUrl) {
      toast({
        title: 'Validation Error',
        description: 'Please upload an image or video, or provide a media URL',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', productData.id);
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      if (productData.price) formData.append('price', productData.price);
      if (productData.originalPrice) formData.append('originalPrice', productData.originalPrice);
      if (productData.image) formData.append('image', productData.image);
      if (productData.imageFile) formData.append('imageFile', productData.imageFile);
      if (productData.videoFile) formData.append('videoFile', productData.videoFile);
      if (productData.cloudinaryPublicId) formData.append('cloudinaryPublicId', productData.cloudinaryPublicId);
      formData.append('features', JSON.stringify(productData.features.filter((f: string) => f.trim() !== '')));
      formData.append(
        'specifications',
        JSON.stringify(
          Object.fromEntries(
            Object.entries(productData.specifications).filter(([_, value]) => (value as string).trim() !== ''),
          ),
        ),
      );
      formData.append('featured', productData.featured.toString());
      formData.append('inStock', productData.inStock.toString());
      formData.append('discount', productData.discount.toString());
      formData.append('rating', productData.rating.toString());
      formData.append('reviews', productData.reviews.toString());

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update product');
      }

      toast({
        title: 'Success!',
        description: 'Product has been updated successfully',
      });

      router.push('/admin/products');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const mediaSection = (
    <div className="space-y-2">
      <Label htmlFor="media">Product Media (Image or Video)</Label>
      <div className="flex gap-2">
        <Input
          id="media-url"
          value={productData?.image || ''}
          onChange={(e) => handleInputChange('image', e.target.value)}
          placeholder="https://res.cloudinary.com/your-cloud-name/..."
          className="flex-1"
          disabled={mediaLoading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('file-input')?.click()}
          disabled={mediaLoading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {mediaLoading ? 'Uploading...' : 'Upload Media'}
        </Button>
        {(productData?.imageUrl || productData?.videoUrl || productData?.image) && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveMedia}
            disabled={mediaLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <input
          id="file-input"
          type="file"
          accept={`${ALLOWED_IMAGE_TYPES.join(',')},${ALLOWED_VIDEO_TYPES.join(',')}`}
          className="hidden"
          onChange={handleFileChange}
          disabled={mediaLoading}
        />
      </div>

      {mediaError && <div className="mt-2 text-red-500 text-sm">{mediaError}</div>}

      <div className="mt-2">
        {mediaLoading ? (
          <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg border">
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : productData?.videoUrl ? (
          <video
            src={productData.videoUrl}
            controls
            className="w-32 h-32 object-cover rounded-lg border"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg?height=128&width=128';
              setMediaError('Error loading video');
            }}
          />
        ) : productData?.imageUrl ? (
          <img
            src={productData.imageUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg?height=128&width=128';
              setMediaError('Error loading image');
            }}
          />
        ) : productData?.image ? (
          <img
            src={productData.image}
            alt="Product Media"
            className="w-32 h-32 object-cover rounded-lg border"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg?height=128&width=128';
              setMediaError('Error loading media');
            }}
          />
        ) : null}
      </div>
    </div>
  );

  if (!user || !productData) {
    return (
      <div className="container px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-secondary">Edit Product</h1>
            <p className="text-muted-foreground">Update the product information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the basic details of your product</CardDescription>
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
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., NylonSpinner 3000 Pro"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={productData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
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
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the product..."
                  className="min-h-[100px]"
                  required
                />
              </div>
              {mediaSection}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Update the pricing information for your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Current Price</Label>
                  <Input
                    id="price"
                    value={productData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="$45,000"
                    onBlur={calculateDiscount}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                  <Input
                    id="originalPrice"
                    value={productData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
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
                      onChange={(e) => handleInputChange('discount', Number.parseInt(e.target.value) || 0)}
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
                  {productData.discount}% OFF - Save{' '}
                  {productData.originalPrice &&
                    productData.price &&
                    `$${(
                      Number.parseFloat(productData.originalPrice.replace(/[^0-9.]/g, '')) -
                      Number.parseFloat(productData.price.replace(/[^0-9.]/g, ''))
                    ).toLocaleString()}`}
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Features</CardTitle>
              <CardDescription>Update the key features of your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {productData.features.map((feature: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1"
                  />
                  {productData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeFeature(index)}
                    >
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

          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>Update the technical details of your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(productData.specifications).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`spec-${key}`}>{key}</Label>
                    <Input
                      id={`spec-${key}`}
                      value={value as string}
                      onChange={(e) => handleSpecificationChange(key, e.target.value)}
                      placeholder={`Enter ${key.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={productData.inStock}
                    onCheckedChange={(checked) => handleInputChange('inStock', checked)}
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
                    onChange={(e) => handleInputChange('rating', Number.parseFloat(e.target.value) || 0)}
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
                    onChange={(e) => handleInputChange('reviews', Number.parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="24"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Updating Product...' : 'Update Product'}
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
  );
}