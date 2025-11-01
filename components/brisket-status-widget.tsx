'use client';

import { useEffect, useState } from 'react';
import { Box, Chip, CircularProgress } from '@mui/material';
import { LocalFireDepartment, History } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { BrisketSession } from '@/lib/db/types';

export function BrisketStatusWidget() {
  const [activeSession, setActiveSession] = useState<BrisketSession | null>(null);
  const [loading, setLoading] = useState(true);
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
        setActiveSession(session);
      }
    } catch (error) {
      console.error('Error checking active session:', error);
    } finally {
      setLoading(false);
    }
  };

  const getElapsedTime = () => {
    if (!activeSession) return '';
    const now = new Date();
    const start = new Date(activeSession.startedAt);
    const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
    const hours = Math.floor(elapsed / 60);
    const mins = elapsed % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusLabel = () => {
    if (!activeSession) return '';
    switch (activeSession.status) {
      case 'smoking': return '🔥 Smoking';
      case 'wrapped': return '📦 Wrapped';
      case 'finishing': return '🍖 Finishing';
      case 'resting': return '😴 Resting';
      default: return activeSession.status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 2 }}>
        <CircularProgress size={16} />
      </Box>
    );
  }

  if (activeSession) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 2 }}>
        <Chip
          icon={<LocalFireDepartment />}
          label={`${getStatusLabel()} • ${getElapsedTime()}`}
          color="error"
          size="small"
          onClick={() => router.push('/brisket')}
          sx={{
            cursor: 'pointer',
            animation: 'pulse 2s infinite',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            transition: 'transform 0.2s',
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 2 }}>
      <Chip
        icon={<History />}
        label="Brisket History"
        size="small"
        variant="outlined"
        onClick={() => router.push('/brisket')}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      />
    </Box>
  );
}
