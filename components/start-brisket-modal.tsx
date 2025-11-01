'use client';

import { useState, useEffect } from 'react';
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
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { Close, LocalFireDepartment } from '@mui/icons-material';

interface StartBrisketModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StartBrisketModal({ open, onClose, onSuccess }: StartBrisketModalProps) {
  const [weight, setWeight] = useState('2');
  const [smokeTemp, setSmokeTemp] = useState('110');
  const [wrapTemp, setWrapTemp] = useState('72');
  const [finishTemp, setFinishTemp] = useState('94');
  const [duration, setDuration] = useState('270'); // 4.5 hours in minutes
  const [restTime, setRestTime] = useState('30');
  const [loading, setLoading] = useState(false);
  const [loadingDefaults, setLoadingDefaults] = useState(true);

  useEffect(() => {
    if (open) {
      loadLatestSession();
    }
  }, [open]);

  const loadLatestSession = async () => {
    setLoadingDefaults(true);
    try {
      const response = await fetch('/api/brisket/latest');
      if (response.ok) {
        const latest = await response.json();
        if (latest && latest.adjustments) {
          // Use adjusted values from last session
          setSmokeTemp(String(latest.adjustments.smokeTemp || latest.targetSmokeTemp));
          setWrapTemp(String(latest.adjustments.wrapTemp || latest.targetWrapTemp));
          setFinishTemp(String(latest.adjustments.finishTemp || latest.targetFinishTemp));
          setDuration(String(latest.adjustments.duration || latest.targetDuration));
          setRestTime(String(latest.adjustments.restTime || latest.targetRestTime));
        }
      }
    } catch (error) {
      console.error('Error loading latest session:', error);
    } finally {
      setLoadingDefaults(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/brisket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: parseFloat(weight),
          targetSmokeTemp: parseInt(smokeTemp),
          targetWrapTemp: parseInt(wrapTemp),
          targetFinishTemp: parseInt(finishTemp),
          targetDuration: parseInt(duration),
          targetRestTime: parseInt(restTime),
        }),
      });

      if (response.ok) {
        onSuccess();
        resetForm();
      }
    } catch (error) {
      console.error('Error starting session:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setWeight('2');
    setSmokeTemp('110');
    setWrapTemp('72');
    setFinishTemp('94');
    setDuration('270');
    setRestTime('30');
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalFireDepartment color="error" />
            <Typography variant="h6">Start New Brisket Session</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {loadingDefaults ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" id="brisket-form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Brisket Weight (kg)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                inputProps={{ min: 0.5, max: 10, step: 0.1 }}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Smoking Temperature (°C)"
                  type="number"
                  value={smokeTemp}
                  onChange={(e) => setSmokeTemp(e.target.value)}
                  required
                  inputProps={{ min: 80, max: 150 }}
                  helperText="Initial smoking temperature"
                />

                <TextField
                  fullWidth
                  label="Wrap Temperature (°C)"
                  type="number"
                  value={wrapTemp}
                  onChange={(e) => setWrapTemp(e.target.value)}
                  required
                  inputProps={{ min: 60, max: 85 }}
                  helperText="When to wrap in paper/foil"
                />

                <TextField
                  fullWidth
                  label="Finish Temperature (°C)"
                  type="number"
                  value={finishTemp}
                  onChange={(e) => setFinishTemp(e.target.value)}
                  required
                  inputProps={{ min: 85, max: 100 }}
                  helperText="Final internal temperature"
                />

                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  inputProps={{ min: 120, max: 720, step: 30 }}
                  helperText={`${Math.floor(parseInt(duration) / 60)}h ${parseInt(duration) % 60}m total`}
                />

                <TextField
                  fullWidth
                  label="Rest Time (minutes)"
                  type="number"
                  value={restTime}
                  onChange={(e) => setRestTime(e.target.value)}
                  required
                  inputProps={{ min: 15, max: 120, step: 5 }}
                  helperText="Post-cook resting period"
                />
              </Box>
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="brisket-form"
          variant="contained"
          color="error"
          disabled={loading || loadingDefaults}
          startIcon={loading ? <CircularProgress size={20} /> : <LocalFireDepartment />}
        >
          {loading ? 'Starting...' : 'Start Smoking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
