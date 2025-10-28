# CooksAssistant Design Document

## Overview

CooksAssistant is a lightweight, mobile-first web application built with Next.js 15 that helps users discover meal inspiration, manage recipes across all meal types, and streamline grocery shopping. The application emphasizes simplicity, speed, and a clean user experience while providing powerful recipe management and shopping list generation capabilities.

## Architecture

### Technology Stack
- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with slate/amber/lime color palette
- **Authentication**: Clerk for user management
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel
- **Language**: TypeScript
- **API**: Next.js API routes

### Application Structure
```
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Main dashboard
│   ├── recipes/           # Recipe management
│   ├── shopping-lists/    # Shopping list features
│   └── api/              # API routes
├── components/           # Reusable UI components
├── lib/                 # Utilities and configurations
│   ├── db/             # Database schema and connection
│   ├── auth/           # Clerk configuration
│   └── utils/          # Helper functions
└── types/              # TypeScript type definitions
```

## Components and Interfaces

### Core Components

#### Dashboard Components
- **RecipeGrid**: Displays recipe cards in responsive grid layout
- **FilterBar**: Meal type and tag filtering interface
- **SearchBar**: Recipe search functionality
- **AddRecipeButton**: Quick access to recipe creation

#### Recipe Components
- **RecipeCard**: Preview card showing title, image, meal type, and tags
- **RecipeForm**: Form for creating/editing recipes
- **RecipeView**: Full recipe display with ingredients and steps
- **RecipeNotes**: Section for user notes and photos

#### Shopping List Components
- **ShoppingListGenerator**: Interface for creating lists from recipes
- **PantryCheck**: Ingredient deselection interface
- **ShoppingListView**: Display and manage shopping list items
- **ExportOptions**: Export to Notes/clipboard functionality

### API Interfaces

#### Recipe API
```typescript
interface RecipeAPI {
  GET /api/recipes - List user recipes with filtering
  POST /api/recipes - Create new recipe
  GET /api/recipes/[id] - Get specific recipe
  PUT /api/recipes/[id] - Update recipe
  DELETE /api/recipes/[id] - Delete recipe
}
```

#### Shopping List API
```typescript
interface ShoppingListAPI {
  POST /api/shopping-lists - Generate shopping list from recipes
  GET /api/shopping-lists/[id] - Get shopping list
  PUT /api/shopping-lists/[id] - Update shopping list items
  POST /api/shopping-lists/export - Export shopping list
}
```

#### Recipe Notes API
```typescript
interface RecipeNotesAPI {
  GET /api/recipes/[id]/notes - Get recipe notes
  POST /api/recipes/[id]/notes - Add recipe note
  PUT /api/notes/[id] - Update note
  DELETE /api/notes/[id] - Delete note
}
```

## Data Models

### Database Schema (Drizzle ORM)

```typescript
// recipes table
export const recipes = pgTable('recipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  mealType: mealTypeEnum('meal_type').notNull(),
  ingredients: json('ingredients').$type<string[]>().notNull(),
  steps: text('steps').notNull(),
  tags: json('tags').$type<string[]>().default([]),
  imageUrl: varchar('image_url', { length: 500 }),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// shopping_list_items table
export const shoppingListItems = pgTable('shopping_list_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: varchar('quantity', { length: 100 }),
  checked: boolean('checked').default(false),
  userId: varchar('user_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// recipe_notes table
export const recipeNotes = pgTable('recipe_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  text: text('text').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Enums
export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack', 'other']);
```

### TypeScript Types

```typescript
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  ingredients: string[];
  steps: string;
  tags: string[];
  imageUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingListItem {
  id: string;
  recipeId?: string;
  name: string;
  quantity?: string;
  checked: boolean;
  userId: string;
  createdAt: Date;
}

export interface RecipeNote {
  id: string;
  recipeId: string;
  userId: string;
  text: string;
  imageUrl?: string;
  createdAt: Date;
}
```

## User Interface Design

### Design System
- **Colors**: Tailwind slate (neutral), amber (accent), lime (success)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Layout**: Mobile-first responsive design
- **Components**: Rounded corners, subtle shadows, clean spacing

### Key Pages

#### Dashboard (`/dashboard`)
- Header with user profile and add recipe button
- Filter bar for meal types and tags
- Search functionality
- Responsive grid of recipe cards
- Empty state for new users with sample recipes

#### Recipe View (`/recipes/[id]`)
- Hero image and recipe title
- Meal type badge and tags
- Ingredients list with shopping list generation button
- Step-by-step instructions
- Notes section with add note functionality
- Chronological display of user notes with photos

#### Add/Edit Recipe (`/recipes/new`, `/recipes/[id]/edit`)
- Clean form with proper validation
- Image upload with preview
- Dynamic ingredient list management
- Tag input with suggestions
- Mobile-optimized input fields

#### Shopping List (`/shopping-lists/[id]`)
- Pantry check interface for ingredient deselection
- Checkable list items
- Export options (Notes app, clipboard)
- Consolidation of multiple recipe ingredients

## Error Handling

### Client-Side Error Handling
- Form validation with clear error messages
- Network error handling with retry options
- Image upload error handling with fallbacks
- Loading states for all async operations

### Server-Side Error Handling
- Database connection error handling
- Authentication error responses
- Input validation and sanitization
- Proper HTTP status codes and error messages

### Error Boundaries
- React error boundaries for component failures
- Graceful degradation for non-critical features
- User-friendly error messages
- Error logging for debugging

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Database model testing
- Utility function testing
- API route testing

### Integration Testing
- End-to-end user flows
- Database integration tests
- Authentication flow testing
- Shopping list generation testing

### Performance Testing
- Mobile performance optimization
- Image loading optimization
- Database query performance
- Bundle size monitoring

## Security Considerations

### Authentication & Authorization
- Clerk handles user authentication
- User-specific data isolation
- Protected API routes
- Session management

### Data Security
- Input sanitization and validation
- SQL injection prevention via Drizzle ORM
- XSS protection
- CSRF protection

### Privacy
- User data isolation
- Secure image storage
- No sharing of personal recipes
- GDPR compliance considerations

## Performance Optimization

### Frontend Optimization
- Next.js 15 App Router for optimal loading
- Image optimization with Next.js Image component
- Lazy loading for recipe cards
- Client-side caching for frequently accessed data

### Database Optimization
- Proper indexing on user_id and recipe_id fields
- Efficient queries with Drizzle ORM
- Connection pooling
- Query result caching where appropriate

### Mobile Optimization
- Responsive images
- Touch-friendly interface elements
- Minimal bundle size
- Progressive Web App features

## Deployment Strategy

### Vercel Deployment
- Automatic deployments from Git
- Environment variable management
- PostgreSQL database connection
- CDN for static assets

### Environment Configuration
- Development, staging, and production environments
- Database migrations with Drizzle
- Clerk authentication configuration
- Image storage configuration