import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AddRecipeButton() {
  return (
    <Button asChild size="sm" className="gap-2">
      <Link href="/recipes/new">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Recipe</span>
        <span className="sm:hidden">Add</span>
      </Link>
    </Button>
  );
}