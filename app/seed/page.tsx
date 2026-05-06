import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { db } from '@/lib/db';
import { recipes } from '@/lib/db/schema';
import { RECIPES } from '@/lib/seed/recipes';

// Dev-only seed page. Disabled in production unless ALLOW_SEED_PAGE=true.
function seedingAllowed() {
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_SEED_PAGE === 'true';
}

export default async function SeedPage() {
  if (!seedingAllowed()) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Seeding disabled</h1>
        <p className="mt-2 text-muted-foreground">
          Set <code>ALLOW_SEED_PAGE=true</code> to enable this page outside of dev.
        </p>
      </main>
    );
  }

  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const myExisting = await db
    .select({ title: recipes.title })
    .from(recipes)
    .where(eq(recipes.createdBy, userId));
  const myExistingTitles = new Set(myExisting.map(r => r.title));

  const toInsert = RECIPES.filter(r => !myExistingTitles.has(r.title));
  let insertedCount = 0;
  if (toInsert.length > 0) {
    const inserted = await db
      .insert(recipes)
      .values(
        toInsert.map(r => ({
          title: r.title,
          description: r.description,
          mealType: r.mealType,
          ingredients: r.ingredients,
          steps: r.steps.join('\n'),
          tags: r.tags,
          createdBy: userId,
        })),
      )
      .returning({ id: recipes.id });
    insertedCount = inserted.length;
  }

  const skippedCount = RECIPES.length - insertedCount;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Seed complete</h1>
      <p className="mt-2 text-muted-foreground">
        Inserted <strong>{insertedCount}</strong>, skipped <strong>{skippedCount}</strong> already
        owned by you.
      </p>
      <p className="mt-6">
        <Link href="/" className="underline">
          Back to recipes →
        </Link>
      </p>
    </main>
  );
}
