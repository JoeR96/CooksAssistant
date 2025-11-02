'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  LinearProgress,
  Card,
  CardMedia,
  CardActions,
} from '@mui/material';
import { CloudUpload, Delete, PhotoCamera } from '@mui/icons-material';

interface MultiImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
}

export function MultiImageUpload({ onUploadComplete, maxFiles = 10 }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).slice(0, maxFiles);
    
    // Create preview URLs
    const previews = fileArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);

    // Upload files
    setUploading(true);
    const urls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgress(((i + 1) / fileArray.length) * 100);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          urls.push(data.url);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setUploadedUrls(urls);
    setUploading(false);
    setUploadProgress(0);
    onUploadComplete(urls);

    // Clean up preview URLs
    previews.forEach(url => URL.revokeObjectURL(url));
  };

  const handleRemovePreview = (index: number) => {
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviews);
    setUploadedUrls(newUrls);
    onUploadComplete(newUrls);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        capture="environment"
      />

      {previewUrls.length === 0 ? (
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
          onClick={handleButtonClick}
        >
          <PhotoCamera sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            Click to select photos
          </Typography>
          <Typography variant="caption" color="text.secondary">
            You can select up to {maxFiles} photos at once
          </Typography>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2, mb: 2 }}>
            {previewUrls.map((url, index) => (
              <Card key={index} sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={url}
                  alt={`Preview ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardActions sx={{ justifyContent: 'center', p: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleRemovePreview(index)}
                    disabled={uploading}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>

          {uploading && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Uploading... {Math.round(uploadProgress)}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}

          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={handleButtonClick}
            disabled={uploading || previewUrls.length >= maxFiles}
            fullWidth
          >
            Add More Photos
          </Button>
        </Box>
      )}
    </Box>
  );
}
