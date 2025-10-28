import { Header } from "@/components/header";
import { RecipeForm } from "@/components/recipe-form";
import { requireAuth } from "@/lib/auth/utils";

export default async function NewRecipePage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Add New Recipe" />
      <main className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <RecipeForm />
        </div>
      </main>
    </div>
  );
}