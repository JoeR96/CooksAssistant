# Cloudinary Setup Guide

To enable image uploads in production, you need to set up Cloudinary (free tier available).

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After signup, you'll be taken to your dashboard

## Step 2: Get Your Credentials

From your Cloudinary dashboard, copy these values:

- **Cloud Name**: Found at the top of your dashboard
- **API Key**: Found in the "API Keys" section
- **API Secret**: Found in the "API Keys" section (click "Reveal")

## Step 3: Add Environment Variables

Add these to your `.env.local` file (or your hosting platform's environment variables):

```env
CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
CLOUDINARY_API_KEY="your_api_key_here"
CLOUDINARY_API_SECRET="your_api_secret_here"
```

## Step 4: Deploy

Once you've added the environment variables, deploy your app. Image uploads will now work in production!

## Features Included

- ✅ **Auto Optimization**: Images are automatically optimized for web
- ✅ **Format Conversion**: Automatically serves WebP when supported
- ✅ **Size Limits**: Max 10MB upload size
- ✅ **Organized Storage**: Images stored in `cooks-assistant/` folder
- ✅ **Responsive Images**: Automatically resized to max 1200x800
- ✅ **CDN Delivery**: Fast global delivery via Cloudinary's CDN

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 transformations per month

This is more than enough for most recipe apps!

## Development Fallback

If Cloudinary isn't configured, the app will fall back to local file storage for development. This means:
- ✅ Development works without Cloudinary setup
- ⚠️ Production requires Cloudinary for persistent image storage