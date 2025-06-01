// app/api/products/update/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import { UploadApiResponse } from "cloudinary";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Validation schema (unchanged)
const UpdateProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().nullable(),
  originalPrice: z.string().nullable(),
  image: z.string().nullable().optional(),
  cloudinaryPublicId: z.string().nullable().optional(),
  features: z.string().transform((val) => JSON.parse(val)).pipe(z.array(z.string())),
  specifications: z.string().transform((val) => JSON.parse(val)).pipe(z.record(z.string())),
  featured: z.string().transform((val) => val === "true"),
  inStock: z.string().transform((val) => val === "true"),
  discount: z.string().transform((val) => Number.parseInt(val) || 0),
  rating: z.string().transform((val) => Number.parseFloat(val) || 0),
  reviews: z.string().transform((val) => Number.parseInt(val) || 0),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Validate Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary environment variables are not set");
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    // Validate ID from params
    const { id } = await params;
    if (!id || typeof id !== "string" || id.length < 10) {
      console.error("Invalid product ID:", id);
      return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    // Check if product exists and fetch existing media
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { id: true, imageUrl: true, cloudinaryPublicId: true, mediaType: true },
    });
    if (!existingProduct) {
      console.error("Product not found:", id);
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Parse form data
    const formData = await request.formData();
    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Ensure image is null if undefined
    data.image = data.image ?? null;
    data.cloudinaryPublicId = data.cloudinaryPublicId ?? null;

    // Validate form data
    const parsed = UpdateProductSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 });
    }

    const {
      name,
      description,
      category,
      price,
      originalPrice,
      image: imageUrl,
      cloudinaryPublicId,
      features,
      specifications,
      featured,
      inStock,
      discount,
      rating,
      reviews,
    } = parsed.data;

    // Handle file upload (image or video)
    let newImageUrl = imageUrl ?? existingProduct.imageUrl; // Fallback to existing imageUrl
    let newCloudinaryPublicId = cloudinaryPublicId ?? existingProduct.cloudinaryPublicId; // Fallback to existing cloudinaryPublicId
    let newMediaType: "image" | "video" | null = null; // Default to null
    if (existingProduct.mediaType === "image" || existingProduct.mediaType === "video") {
      newMediaType = existingProduct.mediaType;
    } else if (existingProduct.mediaType !== null) {
      console.warn(`Invalid mediaType '${existingProduct.mediaType}' for product ${id}, defaulting to null`);
    }
    const imageFile = formData.get("imageFile") as File | null;
    const videoFile = formData.get("videoFile") as File | null;

    if (imageFile || videoFile) {
      const file = imageFile ?? videoFile;
      if (!file) {
        return NextResponse.json({ success: false, error: "No valid file provided" }, { status: 400 });
      }

      // Validate file size and type
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxFileSize) {
        return NextResponse.json({ success: false, error: "File size exceeds 10MB" }, { status: 400 });
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, error: "Invalid file type" }, { status: 400 });
      }

      // Validate video duration
      if (file.type.startsWith("video/")) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const blob = new Blob([buffer], { type: file.type });
        const video = await new Promise<HTMLVideoElement>((resolve, reject) => {
          const vid = document.createElement("video");
          vid.src = URL.createObjectURL(blob);
          vid.onloadedmetadata = () => resolve(vid);
          vid.onerror = () => reject(new Error("Error loading video metadata"));
        });
        if (video.duration > 100) {
          URL.revokeObjectURL(video.src);
          return NextResponse.json({ success: false, error: "Video duration exceeds 100 seconds" }, { status: 400 });
        }
        URL.revokeObjectURL(video.src);
      }

      // Upload to Cloudinary
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const publicId = cloudinaryPublicId || `product_${uuidv4()}`;
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: file.type.startsWith("video/") ? "video" : "image",
            public_id: publicId,
            folder: "products",
            timeout: 30000,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          },
        );
        uploadStream.end(fileBuffer);
      });

      newImageUrl = result.secure_url;
      newCloudinaryPublicId = result.public_id;
      newMediaType = file.type.startsWith("video/") ? "video" : "image";

      // Delete old media if it exists and different
      if (existingProduct.cloudinaryPublicId && existingProduct.cloudinaryPublicId !== newCloudinaryPublicId) {
        await cloudinary.uploader.destroy(existingProduct.cloudinaryPublicId, {
          resource_type: existingProduct.cloudinaryPublicId.includes("video") ? "video" : "image",
        });
      }
    }

    // Prepare product data for update
    const productToUpdate = {
      name,
      description,
      category,
      price: price || null,
      originalPrice: price || null,
      imageUrl: newImageUrl || null,
      cloudinaryPublicId: newCloudinaryPublicId || null,
      mediaType: newMediaType,
      features: features.filter((f) => f.trim().length > 0),
      specifications: specifications || {},
      featured,
      inStock: inStock,
      discount,
      rating,
      reviews,
    };

    // Update product in database
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productToUpdate,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        originalPrice: true,
        imageUrl: true,
        cloudinaryPublicId: true,
        mediaType: true,
        features: true,
        specifications: true,
        featured: true,
        inStock: true,
        discount: true,
        rating: true,
        reviews: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { success: true, product: updatedProduct },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error: any) {
    console.error("Error updating product:", error);
    const errorMessage = error.message.includes("Cloudinary")
      ? "Failed to upload media to Cloudinary"
      : error.message.includes("Prisma")
      ? "Database error"
      : error.message || "Failed to update product";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}