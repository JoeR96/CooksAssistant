'use client';

import { useEffect, useState } from 'react';
import { Fab, Tooltip, Badge } from '@mui/material';
import { LocalFireDepartment } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export function BrisketFab() {
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkActiveSession();
    const interval = setInterval(checkActiveSession, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
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
    }
  };

  return (
    <Tooltip title="Brisket Tracker" placement="left">
      <Fab
        color="error"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => router.push('/brisket')}
      >
        <Badge
          color="success"
          variant="dot"
          invisible={!hasActiveSession}
          sx={{
            '& .MuiBadge-badge': {
              animation: hasActiveSession ? 'pulse 2s infinite' : 'none',
            },
          }}
        >
          <LocalFireDepartment />
        </Badge>
      </Fab>
    </Tooltip>
  );
}
