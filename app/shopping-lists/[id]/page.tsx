"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { ShoppingListView } from "@/components/shopping-list-view";
import { ShoppingListExport } from "@/components/shopping-list-export";
import { ShoppingListItem } from "@/lib/db/types";

export default function ShoppingListPage() {
  const params = useParams();
  const router = useRouter();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchShoppingList();
  }, [params.id]);

  const fetchShoppingList = async () => {
    try {
      const response = await fetch(`/api/shopping-lists/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      } else {
        console.error("Failed to fetch shopping list");
      }
    } catch (error) {
      console.error("Error fetching shopping list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemToggle = async (itemId: string, checked: boolean) => {
    try {
      const response = await fetch(`/api/shopping-lists/${params.id}/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checked }),
      });

      if (!response.ok) {
        console.error("Failed to update item");
        // Revert optimistic update if needed
        fetchShoppingList();
      }
    } catch (error) {
      console.error("Error updating item:", error);
      fetchShoppingList();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Shopping List" />
        <main className="mx-auto max-w-2xl p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        title="Shopping List" 
        subtitle={`${items.length} item${items.length !== 1 ? 's' : ''}`}
      />
      <main className="mx-auto max-w-2xl p-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
          >
            <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <ShoppingListView items={items} onItemToggle={handleItemToggle} />
          {items.length > 0 && (
            <ShoppingListExport items={items} listId={params.id as string} />
          )}
        </div>
      </main>
    </div>
  );
}