'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Loader2 } from 'lucide-react';

export function SeedChristmasButton() {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/seed/christmas-sandwich', {
        method: 'POST',
      });

      if (response.ok) {
        setSeeded(true);
        // Refresh the page to show the new category
        window.location.reload();
      } else {
        console.error('Failed to seed Christmas sandwich');
      }
    } catch (error) {
      console.error('Error seeding Christmas sandwich:', error);
    } finally {
      setLoading(false);
    }
  };

  if (seeded) {
    return (
      <Button disabled variant="outline">
        <Gift className="h-4 w-4 mr-2" />
        Christmas Sandwich Added!
      </Button>
    );
  }

  return (
    <Button onClick={handleSeed} disabled={loading} variant="outline">
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Gift className="h-4 w-4 mr-2" />
      )}
      {loading ? 'Adding...' : 'Add Christmas Sandwich'}
    </Button>
  );
}