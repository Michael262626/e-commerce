// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary'
import { v4 as uuidv4 } from 'uuid';
import { UploadApiResponse } from 'cloudinary';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const price = formData.get('price') as string | undefined;
    const originalPrice = formData.get('originalPrice') as string | undefined;
    const image = formData.get('image') as string | undefined;
    const imageFile = formData.get('imageFile') as File | null;
    const videoFile = formData.get('videoFile') as File | null;
    const cloudinaryPublicId = formData.get('cloudinaryPublicId') as string | undefined;
    const features = JSON.parse(formData.get('features') as string) as string[];
    const specifications = JSON.parse(formData.get('specifications') as string) as Record<string, string>;
    const featured = formData.get('featured') === 'true';
    const inStock = formData.get('inStock') === 'true';
    const discount = parseInt(formData.get('discount') as string) || 0;
    const rating = parseFloat(formData.get('rating') as string) || 0;
    const reviews = parseInt(formData.get('reviews') as string) || 0;

    let mediaUrl = image;
    let publicId = cloudinaryPublicId || `product_${uuidv4()}`;

    if (imageFile || videoFile) {
      const file = imageFile ?? videoFile;
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No valid file provided' },
          { status: 400 },
        );
      }
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: file.type.startsWith('video/') ? 'video' : 'image',
            public_id: publicId,
            folder: 'products',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          },
        );
        uploadStream.end(fileBuffer);
      });

      mediaUrl = result.secure_url;
      publicId = result.public_id;
    }

    const productToUpdate = {
      name,
      description,
      category,
      price: price || null,
      originalPrice: originalPrice || null,
      image: mediaUrl || null,
      cloudinaryPublicId: publicId || null,
      features: features.filter((f: string) => f.trim() !== ''),
      specifications: specifications || {},
      featured,
      inStock,
      discount,
      rating,
      reviews,
    };

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: productToUpdate,
    });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}