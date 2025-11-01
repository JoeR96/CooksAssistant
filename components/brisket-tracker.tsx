'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Box, Typography, LinearProgress, Chip, IconButton, Tooltip } from '@mui/material';
import { LocalFireDepartment, Checkroom, Restaurant, HotelOutlined, CheckCircle, Edit } from '@mui/icons-material';
import { BrisketSession } from '@/lib/db/types';
import { BrisketReviewModal } from '@/components/brisket-review-modal';
import { BrisketAdjustmentsModal } from '@/components/brisket-adjustments-modal';

interface BrisketTrackerProps {
  session: BrisketSession;
  onUpdate: () => void;
}

export function BrisketTracker({ session, onUpdate }: BrisketTrackerProps) {
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
          action: () => handleStatusUpdate('wrapped', { actualWrapTemp: session.targetWrapTemp }),
        };
      case 'wrapped':
        return {
          label: 'Mark as Finishing',
          action: () => handleStatusUpdate('finishing'),
        };
      case 'finishing':
        return {
          label: 'Start Resting',
          action: () => handleStatusUpdate('resting', { actualFinishTemp: session.targetFinishTemp }),
        };
      case 'resting':
        return {
          label: 'Complete & Review',
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
            <LinearProgress 
              variant="determinate" 
              value={getProgress()} 
              sx={{ height: 8, borderRadius: 1 }}
            />
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <button
                onClick={nextAction.action}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {nextAction.label}
              </button>
            </Box>
          )}

          {session.status === 'completed' && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {!session.review && (
                <button
                  onClick={() => setShowReview(true)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Review
                </button>
              )}
              {session.review && !session.adjustments && (
                <button
                  onClick={() => setShowAdjustments(true)}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Adjust for Next Time
                </button>
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
    </>
  );
}
