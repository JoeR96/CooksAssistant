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
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';

interface BrisketCompleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    actualWrapTemp: number;
    actualFinishTemp: number;
    actualDuration: number;
    actualRestTime: number;
  }) => void;
  defaultValues: {
    wrapTemp: number;
    finishTemp: number;
    duration: number;
    restTime: number;
  };
}

export function BrisketCompleteModal({ 
  open, 
  onClose, 
  onConfirm, 
  defaultValues 
}: BrisketCompleteModalProps) {
  const [wrapTemp, setWrapTemp] = useState(defaultValues.wrapTemp);
  const [finishTemp, setFinishTemp] = useState(defaultValues.finishTemp);
  const [duration, setDuration] = useState(defaultValues.duration);
  const [restTime, setRestTime] = useState(defaultValues.restTime);

  const handleSubmit = () => {
    onConfirm({
      actualWrapTemp: wrapTemp,
      actualFinishTemp: finishTemp,
      actualDuration: duration,
      actualRestTime: restTime,
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Edit color="primary" />
            <Typography variant="h6">Confirm Final Details</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Review and adjust the final values before completing your smoke.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="success"
        >
          Complete Smoke
        </Button>
      </DialogActions>
    </Dialog>
  );
}
