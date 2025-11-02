'use client';

import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Chip, Skeleton } from '@mui/material';
import { History, Star, TrendingUp } from '@mui/icons-material';
import { BrisketSession } from '@/lib/db/types';
import { BrisketDetailModal } from './brisket-detail-modal';

export function BrisketHistorySidebar() {
  const [sessions, setSessions] = useState<BrisketSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<BrisketSession | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/brisket?all=true&completed=true');
      if (response.ok) {
        const data = await response.json();
        // Filter only completed sessions and sort by date
        const completed = data
          .filter((s: BrisketSession) => s.status === 'completed')
          .sort((a: BrisketSession, b: BrisketSession) => 
            new Date(b.completedAt || b.createdAt).getTime() - 
            new Date(a.completedAt || a.createdAt).getTime()
          )
          .slice(0, 10); // Show last 10
        setSessions(completed);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getUserInitials = (userId: string) => {
    return userId.substring(0, 2).toUpperCase();
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const handleCardClick = (session: BrisketSession) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <History color="primary" />
            <Typography variant="h6">Brisket History</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <History sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No History Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Completed briskets will appear here
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History color="primary" />
              <Typography variant="h6">Brisket History</Typography>
            </Box>
            <Chip 
              label={sessions.length} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>

          <Box 
            sx={{ 
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(0,0,0,0.3)',
              },
            }}
          >
            {sessions.map((session) => (
              <Card
                key={session.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: 4,
                  },
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => handleCardClick(session)}
              >
                {session.imageUrl && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${session.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.15,
                      zIndex: 0,
                    }}
                  />
                )}
                <CardContent sx={{ p: 1.5, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'start' }}>
                    {session.imageUrl ? (
                      <Box
                        component="img"
                        src={session.imageUrl}
                        alt="Brisket"
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: 'primary.main',
                          fontSize: '0.875rem',
                          flexShrink: 0,
                        }}
                      >
                        {getUserInitials(session.userId)}
                      </Avatar>
                    )}

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {session.weight}kg
                        </Typography>
                        {session.rating && (
                          <Typography variant="caption">
                            {getRatingStars(session.rating)}
                          </Typography>
                        )}
                      </Box>

                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                        {formatDate(session.completedAt || session.createdAt)}
                      </Typography>

                      {session.adjustments && (
                        <Chip
                          icon={<TrendingUp sx={{ fontSize: 12 }} />}
                          label="Adjusted"
                          size="small"
                          color="success"
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      )}

                      {session.review && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mt: 0.5,
                            fontSize: '0.7rem',
                          }}
                        >
                          {session.review}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

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
