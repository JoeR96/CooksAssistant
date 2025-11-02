'use client';

import { useState, useEffect } from 'react';
import { BrisketSmokingSection } from './brisket-smoking-section';

export function ConditionalBrisketSection() {
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    try {
      const response = await fetch('/api/brisket?active=true');
      if (response.ok) {
        const session = await response.json();
        setHasActiveSession(!!session);
      }
    } catch (error) {
      console.error('Error checking active session:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !hasActiveSession) {
    return null;
  }

  return <BrisketSmokingSection />;
}
