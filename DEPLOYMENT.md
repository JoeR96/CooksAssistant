# CooksAssistant Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Set up a Neon, Supabase, or other PostgreSQL database
3. **Clerk Account**: Set up authentication at [clerk.com](https://clerk.com)

## Environment Variables

Set the following environment variables in your Vercel project:

### Database
- `DATABASE_URL`: Your PostgreSQL connection string

### Clerk Authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: `/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: `/dashboard`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: `/dashboard`

## Deployment Steps

### 1. Database Setup

1. Create a PostgreSQL database (recommended: Neon)
2. Copy the connection string
3. Run database migrations:
   ```bash
   npm run db:push
   ```
4. Seed the database (optional):
   ```bash
   npm run db:seed
   ```

### 2. Clerk Setup

1. Create a new Clerk application
2. Configure sign-in/sign-up pages
3. Set redirect URLs:
   - Sign-in redirect: `https://your-domain.vercel.app/dashboard`
   - Sign-up redirect: `https://your-domain.vercel.app/dashboard`
4. Copy the API keys

### 3. Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy the application

### 4. Post-Deployment

1. Test authentication flow
2. Verify database connectivity
3. Test recipe creation and management
4. Test shopping list functionality

## Build Commands

- **Build**: `npm run build`
- **Start**: `npm start`
- **Development**: `npm run dev`

## Database Commands

- **Generate migrations**: `npm run db:generate`
- **Push schema**: `npm run db:push`
- **View database**: `npm run db:studio`
- **Seed data**: `npm run db:seed`

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check database is accessible from Vercel

2. **Authentication Issues**
   - Verify Clerk keys are set correctly
   - Check redirect URLs match your domain

3. **Build Failures**
   - Check all dependencies are installed
   - Verify TypeScript compilation passes

### Support

For issues, check:
1. Vercel deployment logs
2. Browser console for client-side errors
3. Database connectivity with `npm run db:studio`