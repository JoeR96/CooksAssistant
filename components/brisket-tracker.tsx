'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Box, Typography, LinearProgress, Chip, IconButton, Tooltip, Button } from '@mui/material';
import { LocalFireDepartment, Checkroom, Restaurant, HotelOutlined, CheckCircle, Edit } from '@mui/icons-material';
import { BrisketSession } from '@/lib/db/types';
import { BrisketReviewModal } from '@/components/brisket-review-modal';
import { BrisketAdjustmentsModal } from '@/components/brisket-adjustments-modal';
import { BrisketProgressPhotos } from '@/components/brisket-progress-photos';

interface BrisketTrackerProps {
  session: BrisketSession;
  onUpdate: () => void;
  isOwner?: boolean;
}

export function BrisketTracker({ session, onUpdate, isOwner = true }: BrisketTrackerProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [showAdjustments, setShowAdjustments] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(session.startedAt);
      const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
      setElapsedMinutes(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [session.startedAt]);

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
      case 'completed': return <CheckCircle />;
    }
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'smoking': return 'error';
      case 'wrapped': return 'warning';
      case 'finishing': return 'info';
      case 'resting': return 'success';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const handleStatusUpdate = async (newStatus: string, additionalData?: any) => {
    try {
      await fetch(`/api/brisket/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, additionalData }),
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getNextAction = () => {
    switch (session.status) {
      case 'smoking':
        return {
          label: 'Mark as Wrapped',
          color: 'error' as const,
          size: 'small' as const,
          action: () => handleStatusUpdate('wrapped', { actualWrapTemp: session.targetWrapTemp }),
        };
      case 'wrapped':
        return {
          label: 'Mark as Finishing',
          color: 'primary' as const,
          size: 'medium' as const,
          action: () => handleStatusUpdate('finishing'),
        };
      case 'finishing':
        return {
          label: 'Start Resting',
          color: 'primary' as const,
          size: 'medium' as const,
          action: () => handleStatusUpdate('resting', { actualFinishTemp: session.targetFinishTemp }),
        };
      case 'resting':
        return {
          label: 'Complete & Review',
          color: 'primary' as const,
          size: 'medium' as const,
          action: () => {
            handleStatusUpdate('completed', { 
              actualDuration: elapsedMinutes,
              actualRestTime: session.targetRestTime 
            });
            setShowReview(true);
          },
        };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon()}
              <Typography variant="h6">
                {session.weight}kg Brisket
              </Typography>
            </Box>
            <Chip 
              label={session.status.replace('_', ' ').toUpperCase()} 
              color={getStatusColor() as any}
              icon={getStatusIcon()}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Time Elapsed: {formatTime(elapsedMinutes)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target: {formatTime(session.targetDuration)}
              </Typography>
            </Box>
            <Box className="smoke-container" sx={{ position: 'relative', height: 12 }}>
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
              {session.status !== 'completed' && (
                <>
                  <div className="smoke smoke-1" />
                  <div className="smoke smoke-2" />
                  <div className="smoke smoke-3" />
                  <div className="smoke smoke-4" />
                  <div className="smoke smoke-5" />
                </>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Smoke Temp</Typography>
              <Typography variant="h6">{session.targetSmokeTemp}°C</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Wrap Temp</Typography>
              <Typography variant="h6">
                {session.targetWrapTemp}°C
                {session.actualWrapTemp && ` (${session.actualWrapTemp}°C)`}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Finish Temp</Typography>
              <Typography variant="h6">
                {session.targetFinishTemp}°C
                {session.actualFinishTemp && ` (${session.actualFinishTemp}°C)`}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Rest Time</Typography>
              <Typography variant="h6">{session.targetRestTime} min</Typography>
            </Box>
          </Box>

          {nextAction && session.status !== 'completed' && (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color={nextAction.color}
                size={nextAction.size}
                onClick={nextAction.action}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: nextAction.size === 'small' ? 3 : 4,
                  py: nextAction.size === 'small' ? 0.75 : 1.5,
                }}
              >
                {nextAction.label}
              </Button>
            </Box>
          )}

          {session.status === 'completed' && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {!session.review && (
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() => setShowReview(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                  }}
                >
                  Add Review
                </Button>
              )}
              {session.review && !session.adjustments && (
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  onClick={() => setShowAdjustments(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                  }}
                >
                  Adjust for Next Time
                </Button>
              )}
              {session.adjustments && (
                <Box sx={{ width: '100%', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="success.dark">
                    ✓ Adjustments saved for next session
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <BrisketReviewModal
        open={showReview}
        sessionId={session.id}
        onClose={() => setShowReview(false)}
        onSuccess={() => {
          setShowReview(false);
          onUpdate();
        }}
      />

      <BrisketAdjustmentsModal
        open={showAdjustments}
        session={session}
        onClose={() => setShowAdjustments(false)}
        onSuccess={() => {
          setShowAdjustments(false);
          onUpdate();
        }}
      />

      <BrisketProgressPhotos sessionId={session.id} isOwner={isOwner} />
    </>
  );
}
