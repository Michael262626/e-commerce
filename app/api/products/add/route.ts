// app/api/products/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@/lib/generated/prisma';
import type { UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const price = formData.get('price') as string | null; // Changed to null
    const originalPrice = formData.get('originalPrice') as string | null; // Changed to null
    const image = formData.get('image') as string | null; // Changed to null
    const imageFile = formData.get('imageFile') as File | null;
    const videoFile = formData.get('videoFile') as File | null;
    const cloudinaryPublicId = formData.get('cloudinaryPublicId') as string | null; // Changed to null
    const features = JSON.parse(formData.get('features') as string) as string[];
    const specifications = JSON.parse(formData.get('specifications') as string) as Record<string, string>;
    const featured = formData.get('featured') === 'true';
    const inStock = formData.get('inStock') === 'true';
    const discount = parseInt(formData.get('discount') as string) || 0;
    const rating = parseFloat(formData.get('rating') as string) || 0;
    const reviews = parseInt(formData.get('reviews') as string) || 0;

    if (!name || !description || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    let mediaUrl = image;
    let publicId = cloudinaryPublicId || `product_${uuidv4()}`;

    if (imageFile || videoFile) {
      const file = imageFile ?? videoFile;
      if (file) {
        // Validate file type
        const isVideo = file.type.startsWith('video/');
        if (isVideo && !['video/mp4', 'video/webm'].includes(file.type)) {
          return NextResponse.json({ success: false, error: 'Invalid video format' }, { status: 400 });
        }
        if (!isVideo && !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          return NextResponse.json({ success: false, error: 'Invalid image format' }, { status: 400 });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: isVideo ? 'video' : 'image',
              public_id: publicId,
              folder: 'products',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!);
            }
          );
          uploadStream.end(fileBuffer);
        });

        mediaUrl = result.secure_url;
        publicId = result.public_id;
      }
    }

    const productToSave = {
      name,
      description,
      category,
      price,
      originalPrice,
      image: mediaUrl,
      cloudinaryPublicId: publicId,
      features: features.filter((f: string) => f.trim() !== ''),
      specifications,
      featured,
      inStock,
      discount,
      rating,
      reviews,
    };

    const savedProduct = await prisma.product.create({
      data: productToSave,
    });

    return NextResponse.json({ success: true, product: savedProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Error adding product:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to add product' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}