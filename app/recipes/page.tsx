import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RecipesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-foreground">Recipes</h1>
      </div>
    </div>
  );
}
