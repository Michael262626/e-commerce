// app/api/products/delete-media/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';


export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    if (!publicId) {
      return NextResponse.json({ success: false, error: 'Public ID is required' }, { status: 400 });
    }

    await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting media from Cloudinary:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 });
  }
}