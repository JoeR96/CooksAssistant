import { Header } from "@/components/header";
import { RecipeForm } from "@/components/recipe-form";
import { requireAuth } from "@/lib/auth/utils";

export default async function NewRecipePage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <Header title="Add New Recipe" />
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl bg-card p-8 shadow-xl border-0">
          <RecipeForm />
        </div>
      </main>
    </div>
  );
}