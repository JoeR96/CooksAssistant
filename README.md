# CooksAssistant

A lightweight web application for recipe management, meal planning, and shopping list generation.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Clerk account for authentication

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Clerk API keys from https://clerk.com
   - Add your PostgreSQL database URL

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Commands

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Dashboard page
│   ├── recipes/           # Recipe management
│   ├── shopping-lists/    # Shopping list features
│   └── api/              # API routes
├── components/           # Reusable UI components
├── lib/                 # Utilities and configurations
│   └── db/             # Database schema and connection
├── types/              # TypeScript type definitions
└── drizzle/            # Database migrations
```

## Features

- Recipe management with meal type categorization
- Shopping list generation from recipes
- Recipe notes with photos
- Mobile-responsive design
- Secure authentication with Clerk
