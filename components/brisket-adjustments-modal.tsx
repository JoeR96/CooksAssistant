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
  Alert,
  Chip,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Close, TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import { BrisketSession } from '@/lib/db/types';

interface BrisketAdjustmentsModalProps {
  open: boolean;
  session: BrisketSession;
  onClose: () => void;
  onSuccess: () => void;
}

export function BrisketAdjustmentsModal({ open, session, onClose, onSuccess }: BrisketAdjustmentsModalProps) {
  const [smokeTemp, setSmokeTemp] = useState(session.targetSmokeTemp);
  const [wrapTemp, setWrapTemp] = useState(session.targetWrapTemp);
  const [finishTemp, setFinishTemp] = useState(session.targetFinishTemp);
  const [duration, setDuration] = useState(session.targetDuration);
  const [restTime, setRestTime] = useState(session.targetRestTime);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const getSuggestions = () => {
    const suggestions = [];
    
    if (session.rating && session.rating < 3) {
      suggestions.push('Consider adjusting temperatures or timing based on your review');
    }
    
    if (session.review?.toLowerCase().includes('dry')) {
      suggestions.push('Try wrapping earlier (lower wrap temp by 5°C)');
      suggestions.push('Reduce smoking temperature by 5-10°C');
    }
    
    if (session.review?.toLowerCase().includes('tough') || session.review?.toLowerCase().includes('chewy')) {
      suggestions.push('Increase finish temperature by 2-3°C');
      suggestions.push('Extend cooking time by 30-60 minutes');
    }
    
    if (session.review?.toLowerCase().includes('bark')) {
      if (session.review?.toLowerCase().includes('not enough') || session.review?.toLowerCase().includes('weak')) {
        suggestions.push('Delay wrapping (increase wrap temp by 5°C)');
      }
    }
    
    if (session.review?.toLowerCase().includes('smoke') || session.review?.toLowerCase().includes('smoky')) {
      if (session.review?.toLowerCase().includes('too much') || session.review?.toLowerCase().includes('bitter')) {
        suggestions.push('Reduce smoking temperature by 5-10°C');
      } else if (session.review?.toLowerCase().includes('not enough')) {
        suggestions.push('Increase smoking temperature by 5°C');
      }
    }

    return suggestions;
  };

  const suggestions = getSuggestions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adjustments = {
        smokeTemp,
        wrapTemp,
        finishTemp,
        duration,
        restTime,
        notes,
      };

      const response = await fetch(`/api/brisket/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustments }),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving adjustments:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChange = (current: number, original: number, unit: string) => {
    const diff = current - original;
    if (diff === 0) return <Chip icon={<Remove />} label="No change" size="small" />;
    if (diff > 0) return (
      <Chip 
        icon={<TrendingUp />} 
        label={`+${diff}${unit}`} 
        size="small" 
        color="success"
      />
    );
    return (
      <Chip 
        icon={<TrendingDown />} 
        label={`${diff}${unit}`} 
        size="small" 
        color="error"
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Adjust Settings for Next Time</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="adjustments-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {suggestions.length > 0 && (
            <Alert severity="info" icon="💡">
              <Typography variant="subtitle2" gutterBottom>
                Suggestions based on your review:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {suggestions.map((suggestion, i) => (
                  <li key={i}>
                    <Typography variant="body2">{suggestion}</Typography>
                  </li>
                ))}
              </Box>
            </Alert>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                label="Smoking Temperature (°C)"
                type="number"
                value={smokeTemp}
                onChange={(e) => setSmokeTemp(Number(e.target.value))}
                inputProps={{ min: 80, max: 150 }}
              />
              {renderChange(smokeTemp, session.targetSmokeTemp, '°C')}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                label="Wrap Temperature (°C)"
                type="number"
                value={wrapTemp}
                onChange={(e) => setWrapTemp(Number(e.target.value))}
                inputProps={{ min: 60, max: 85 }}
              />
              {renderChange(wrapTemp, session.targetWrapTemp, '°C')}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                label="Finish Temperature (°C)"
                type="number"
                value={finishTemp}
                onChange={(e) => setFinishTemp(Number(e.target.value))}
                inputProps={{ min: 85, max: 100 }}
              />
              {renderChange(finishTemp, session.targetFinishTemp, '°C')}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                inputProps={{ min: 120, max: 720, step: 30 }}
              />
              {renderChange(duration, session.targetDuration, 'min')}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                label="Rest Time (minutes)"
                type="number"
                value={restTime}
                onChange={(e) => setRestTime(Number(e.target.value))}
                inputProps={{ min: 15, max: 120, step: 5 }}
              />
              {renderChange(restTime, session.targetRestTime, 'min')}
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other adjustments or reminders for next time..."
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="adjustments-form"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : 'Save Adjustments'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
