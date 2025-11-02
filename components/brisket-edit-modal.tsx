'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Rating,
} from '@mui/material';
import { Close, Edit, PhotoCamera, Reviews } from '@mui/icons-material';
import { BrisketSession } from '@/lib/db/types';
import { ImageUpload } from './image-upload';

interface BrisketEditModalProps {
  open: boolean;
  session: BrisketSession;
  onClose: () => void;
  onSuccess: () => void;
}

export function BrisketEditModal({ open, session, onClose, onSuccess }: BrisketEditModalProps) {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  // Times
  const [wrapTemp, setWrapTemp] = useState(session.actualWrapTemp || session.targetWrapTemp);
  const [finishTemp, setFinishTemp] = useState(session.actualFinishTemp || session.targetFinishTemp);
  const [duration, setDuration] = useState(session.actualDuration || session.targetDuration);
  const [restTime, setRestTime] = useState(session.actualRestTime || session.targetRestTime);

  // Review
  const [rating, setRating] = useState(session.rating || 0);
  const [review, setReview] = useState(session.review || '');
  const [imageUrl, setImageUrl] = useState(session.imageUrl || '');

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update times
      await fetch(`/api/brisket/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          additionalData: {
            actualWrapTemp: wrapTemp,
            actualFinishTemp: finishTemp,
            actualDuration: duration,
            actualRestTime: restTime,
          },
        }),
      });

      // Update review if changed
      if (rating > 0 || review || imageUrl) {
        await fetch(`/api/brisket/${session.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating: rating || null,
            review: review || null,
            imageUrl: imageUrl || null,
          }),
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error updating session:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit color="primary" />
            <Typography variant="h6">Edit Brisket Session</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
          <Tab icon={<Edit />} label="Times & Temps" />
          <Tab icon={<Reviews />} label="Review" />
          <Tab icon={<PhotoCamera />} label="Photo" />
        </Tabs>
      </Box>

      <DialogContent dividers>
        {tab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Update the actual temperatures and times for this smoke.
            </Typography>

            <TextField
              fullWidth
              label="Wrap Temperature (°C)"
              type="number"
              value={wrapTemp}
              onChange={(e) => setWrapTemp(Number(e.target.value))}
              inputProps={{ min: 60, max: 85 }}
              helperText="Temperature when you wrapped the brisket"
            />

            <TextField
              fullWidth
              label="Finish Temperature (°C)"
              type="number"
              value={finishTemp}
              onChange={(e) => setFinishTemp(Number(e.target.value))}
              inputProps={{ min: 85, max: 100 }}
              helperText="Final internal temperature"
            />

            <TextField
              fullWidth
              label="Total Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              inputProps={{ min: 120, max: 1440, step: 5 }}
              helperText={`Total cooking time: ${formatTime(duration)}`}
            />

            <TextField
              fullWidth
              label="Rest Time (minutes)"
              type="number"
              value={restTime}
              onChange={(e) => setRestTime(Number(e.target.value))}
              inputProps={{ min: 15, max: 120, step: 5 }}
              helperText="How long the brisket rested"
            />
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Rating
              </Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue || 0)}
                size="large"
                sx={{ fontSize: '2.5rem' }}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="How was the bark? Was it tender? Any notes on flavor?"
            />
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload or update the main photo for this brisket.
            </Typography>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              label="Brisket Photo"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
