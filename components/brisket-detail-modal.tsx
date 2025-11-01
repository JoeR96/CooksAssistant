'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import { Close, LocalFireDepartment, Checkroom, Restaurant, HotelOutlined } from '@mui/icons-material';
import { BrisketSession } from '@/lib/db/types';

interface BrisketDetailModalProps {
  open: boolean;
  session: BrisketSession | null;
  onClose: () => void;
}

export function BrisketDetailModal({ open, session, onClose }: BrisketDetailModalProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    if (!session) return;

    const updateElapsed = () => {
      const now = new Date();
      const start = new Date(session.startedAt);
      const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
      setElapsedMinutes(elapsed);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session) return null;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgress = () => {
    return Math.min((elapsedMinutes / session.targetDuration) * 100, 100);
  };

  const getStatusIcon = () => {
    switch (session.status) {
      case 'smoking': return <LocalFireDepartment />;
      case 'wrapped': return <Checkroom />;
      case 'finishing': return <Restaurant />;
      case 'resting': return <HotelOutlined />;
      default: return <LocalFireDepartment />;
    }
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'smoking': return 'error';
      case 'wrapped': return 'warning';
      case 'finishing': return 'info';
      case 'resting': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = () => {
    switch (session.status) {
      case 'smoking': return '🔥 Smoking';
      case 'wrapped': return '📦 Wrapped';
      case 'finishing': return '🍖 Finishing';
      case 'resting': return '😴 Resting';
      default: return session.status;
    }
  };

  const getUserInitials = (userId: string) => {
    return userId.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: 'primary.main',
              }}
            >
              {getUserInitials(session.userId)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {session.weight}kg Brisket
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Live Session
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Current Status
            </Typography>
            <Chip 
              label={getStatusLabel()} 
              color={getStatusColor() as any}
              icon={getStatusIcon()}
            />
          </Box>

          <Divider />

          {/* Progress */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Time Elapsed: {formatTime(elapsedMinutes)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target: {formatTime(session.targetDuration)}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={getProgress()} 
              sx={{ 
                height: 12, 
                borderRadius: 2,
                bgcolor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #ff4500 0%, #ff6347 25%, #ff8c00 50%, #ff6347 75%, #ff4500 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'fire-gradient 2s ease infinite, fire-flicker 1.5s ease-in-out infinite',
                  boxShadow: '0 0 10px rgba(255, 69, 0, 0.8), 0 0 20px rgba(255, 140, 0, 0.6), 0 0 30px rgba(255, 69, 0, 0.4)',
                }
              }}
            />
          </Box>

          <Divider />

          {/* Temperature Details */}
          <Box>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Temperature Settings
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 1 }}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Smoke Temp
                </Typography>
                <Typography variant="h6">
                  {session.targetSmokeTemp}°C
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Wrap Temp
                </Typography>
                <Typography variant="h6">
                  {session.targetWrapTemp}°C
                  {session.actualWrapTemp && (
                    <Typography variant="caption" color="success.main" display="block">
                      ✓ {session.actualWrapTemp}°C
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Finish Temp
                </Typography>
                <Typography variant="h6">
                  {session.targetFinishTemp}°C
                  {session.actualFinishTemp && (
                    <Typography variant="caption" color="success.main" display="block">
                      ✓ {session.actualFinishTemp}°C
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Rest Time
                </Typography>
                <Typography variant="h6">
                  {session.targetRestTime} min
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Info Banner */}
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'info.light', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'info.main',
            }}
          >
            <Typography variant="body2" color="info.dark">
              👀 You're viewing a live session from the community. Sign in to track your own brisket!
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
