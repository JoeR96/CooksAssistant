'use client';

import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, LinearProgress, Avatar } from '@mui/material';
import { LocalFireDepartment } from '@mui/icons-material';
import { BrisketSession } from '@/lib/db/types';
import { BrisketDetailModal } from './brisket-detail-modal';

export function LiveBrisketFeed() {
  const [sessions, setSessions] = useState<BrisketSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<BrisketSession | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/brisket?all=true');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getElapsedTime = (startedAt: Date | string) => {
    const now = new Date();
    const start = new Date(startedAt);
    const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
    const hours = Math.floor(elapsed / 60);
    const mins = elapsed % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgress = (session: BrisketSession) => {
    const now = new Date();
    const start = new Date(session.startedAt);
    const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
    return Math.min((elapsed / session.targetDuration) * 100, 100);
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'smoking': return '🔥';
      case 'wrapped': return '📦';
      case 'finishing': return '🍖';
      case 'resting': return '😴';
      default: return '🔥';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'smoking': return 'error';
      case 'wrapped': return 'warning';
      case 'finishing': return 'info';
      case 'resting': return 'success';
      default: return 'default';
    }
  };

  const getUserInitials = (userId: string) => {
    // Extract first 2 characters of user ID for display
    return userId.substring(0, 2).toUpperCase();
  };

  const handleCardClick = (session: BrisketSession) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Loading live sessions...
        </Typography>
      </Box>
    );
  }

  if (sessions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <LocalFireDepartment sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Active Smokes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Be the first to start smoking a brisket!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        }, 
        gap: 2 
      }}>
        {sessions.map((session) => (
          <Card 
            key={session.id}
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
              position: 'relative',
              overflow: 'visible',
            }}
            onClick={() => handleCardClick(session)}
          >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.main',
                    fontSize: '0.75rem',
                  }}
                >
                  {getUserInitials(session.userId)}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {session.weight}kg Brisket
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getElapsedTime(session.startedAt)}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={getStatusEmoji(session.status)}
                size="small"
                color={getStatusColor(session.status) as any}
                sx={{ minWidth: 40 }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={getProgress(session)} 
                sx={{ 
                  height: 6, 
                  borderRadius: 1,
                  bgcolor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 1,
                    background: 'linear-gradient(90deg, #ff4500 0%, #ff6347 25%, #ff8c00 50%, #ff6347 75%, #ff4500 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'fire-gradient 2s ease infinite',
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Smoke
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {session.targetSmokeTemp}°C
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Target
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {session.targetFinishTemp}°C
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        ))}
      </Box>

      <BrisketDetailModal
        open={modalOpen}
        session={selectedSession}
        onClose={() => {
          setModalOpen(false);
          setSelectedSession(null);
        }}
      />
    </>
  );
}
