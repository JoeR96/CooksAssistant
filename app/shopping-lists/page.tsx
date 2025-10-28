import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ShoppingListsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900">Shopping Lists</h1>
      </div>
    </div>
  );
}
