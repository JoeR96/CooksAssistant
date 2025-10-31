import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET
);

export async function POST(request: NextRequest) {
  try {

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size
    const maxSize = isCloudinaryConfigured ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for Cloudinary, 5MB for local
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File size must be less than ${maxSize / (1024 * 1024)}MB` 
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary (Production)
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'cooks-assistant', // Organize uploads in a folder
            transformation: [
              { width: 1200, height: 800, crop: 'limit' }, // Limit max size
              { quality: 'auto' }, // Auto optimize quality
              { fetch_format: 'auto' } // Auto format (WebP when supported)
            ]
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });

      const result = uploadResponse as any;
      
      return NextResponse.json({ 
        url: result.secure_url,
        publicId: result.public_id 
      });
    } else {
      // Fallback to local storage (Development)
      console.warn('Cloudinary not configured, using local storage (development only)');
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}_${originalName}`;
      const filepath = join(uploadsDir, filename);

      // Save file locally
      await writeFile(filepath, buffer);

      // Return the public URL
      const url = `/uploads/${filename}`;
      
      return NextResponse.json({ url });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}