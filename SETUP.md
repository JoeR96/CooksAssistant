# CooksAssistant Setup Guide

## Initial Setup Complete ✓

The project foundation has been successfully set up with:
- Next.js 15 with TypeScript
- Tailwind CSS configured
- Clerk authentication integrated
- PostgreSQL database with Drizzle ORM
- Basic app router structure

## Next Steps

### 1. Configure Clerk Authentication

1. Go to https://clerk.com and create an account (or sign in)
2. Create a new application
3. Copy your API keys from the dashboard
4. Open `.env.local` and add your keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### 2. Set Up PostgreSQL Database

You have several options:

#### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb cooks_assistant`
3. Add to `.env.local`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/cooks_assistant
   ```

#### Option B: Vercel Postgres
1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the connection string to `.env.local`

#### Option C: Neon, Supabase, or other providers
1. Create a PostgreSQL database with your preferred provider
2. Copy the connection string to `.env.local`

### 3. Initialize the Database

Once your DATABASE_URL is set, run:
```bash
npm run db:push
```

This will create all the necessary tables in your database.

### 4. Start Development

```bash
npm run dev
```

Open http://localhost:3000 to see your app!

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Sign-in and sign-up pages
│   ├── dashboard/         # Main dashboard
│   ├── recipes/           # Recipe management
│   ├── shopping-lists/    # Shopping list features
│   └── api/              # API routes
├── components/           # Reusable UI components (empty for now)
├── lib/
│   └── db/              # Database schema and connection
├── types/               # TypeScript type definitions
└── middleware.ts        # Clerk authentication middleware
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Troubleshooting

### Build fails with Clerk error
Make sure you've added your Clerk keys to `.env.local`

### Database connection error
Verify your DATABASE_URL is correct and the database is accessible

### Port 3000 already in use
Run on a different port: `npm run dev -- -p 3001`
