"use client";

import { useState } from "react";
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
  Fade,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
} from "@mui/material";
import {
  Close,
  StickyNote2,
} from "@mui/icons-material";
import { ImageUpload } from "./image-upload";

interface AddNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: { text: string; imageUrl: string }) => Promise<void>;
  isSubmitting: boolean;
}

export function AddNoteModal({ 
  open, 
  onClose, 
  onSubmit, 
  isSubmitting 
}: AddNoteModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    text: "",
    imageUrl: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.text.trim()) return;
    
    await onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      text: "",
      imageUrl: "",
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Fade}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <StickyNote2 color="primary" />
          <Typography variant="h5" component="div" fontWeight={600}>
            Add Cooking Note
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share your cooking experience, modifications, or tips for next time!
            </Typography>
          </Box>

          {/* Note Text */}
          <TextField
            fullWidth
            label="Your Cooking Experience"
            value={formData.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
            multiline
            rows={6}
            required
            variant="outlined"
            placeholder="How did it turn out? Any modifications you made? Tips for next time?"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Image Upload */}
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => handleInputChange("imageUrl", url)}
            label="Photo of Your Result (Optional)"
          />
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ borderRadius: 2, minWidth: 100 }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !formData.text.trim()}
          sx={{ 
            borderRadius: 2, 
            minWidth: 120,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
        >
          {isSubmitting ? "Adding..." : "Add Note"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}