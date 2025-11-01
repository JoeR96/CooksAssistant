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
  Rating,
  CircularProgress,
} from '@mui/material';
import { Close, Star } from '@mui/icons-material';
import { ImageUpload } from './image-upload';

interface BrisketReviewModalProps {
  open: boolean;
  sessionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BrisketReviewModal({ open, sessionId, onClose, onSuccess }: BrisketReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/brisket/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review, imageUrl }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">How did your brisket turn out?</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="review-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            rows={4}
            label="Review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="How was the bark? Was it tender? Any notes on flavor?"
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Upload Photo (optional)
            </Typography>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              label="Brisket Photo"
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="review-form"
          variant="contained"
          disabled={loading || rating === 0}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
