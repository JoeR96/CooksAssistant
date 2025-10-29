"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Database } from "lucide-react";

export function SeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });

      if (response.ok) {
        // Refresh the page to show the new recipes
        window.location.reload();
      } else {
        console.error("Failed to seed database");
      }
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button 
      onClick={handleSeed} 
      disabled={isSeeding}
      variant="outline"
      size="sm"
    >
      {isSeeding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding sample recipes...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" />
          Add Sample Recipes
        </>
      )}
    </Button>
  );
}