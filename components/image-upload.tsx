"use client";

import { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  IconButton,
  Stack,
} from "@mui/material";
import {
  CloudUpload,
  PhotoCamera,
  Delete,
  Image as ImageIcon,
} from "@mui/icons-material";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Recipe Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to your API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeImage = () => {
    onChange('');
    setError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {label}
      </Typography>

      {value ? (
        <Card sx={{ position: 'relative', maxWidth: 300 }}>
          <CardMedia
            component="img"
            height="200"
            image={value}
            alt="Recipe preview"
            sx={{ objectFit: 'cover' }}
          />
          <IconButton
            onClick={removeImage}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
            size="small"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Card>
      ) : (
        <Card
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
        >
          {isUploading ? (
            <Box>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Uploading image...
              </Typography>
            </Box>
          ) : (
            <Box>
              <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" fontWeight={500} gutterBottom>
                Drop an image here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Supports JPG, PNG, GIF up to 5MB
              </Typography>
              
              <Stack direction="row" spacing={1} justifyContent="center">
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                >
                  Browse Files
                </Button>
                
                {/* Mobile camera capture */}
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Create a new input for camera capture
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.capture = 'environment'; // Use rear camera
                    input.onchange = (event) => {
                      const file = (event.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleFileSelect(file);
                      }
                    };
                    input.click();
                  }}
                  sx={{ display: { xs: 'inline-flex', sm: 'none' } }} // Only show on mobile
                >
                  Camera
                </Button>
              </Stack>
            </Box>
          )}
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}