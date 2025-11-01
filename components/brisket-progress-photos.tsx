'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Dialog,
  DialogContent,
} from '@mui/material';
import { Add, Delete, Edit, Close, PhotoCamera } from '@mui/icons-material';
import { ImageUpload } from './image-upload';
import { BrisketProgressPhoto } from '@/lib/db/types';

interface BrisketProgressPhotosProps {
  sessionId: string;
  isOwner: boolean;
}

export function BrisketProgressPhotos({ sessionId, isOwner }: BrisketProgressPhotosProps) {
  const [photos, setPhotos] = useState<BrisketProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState('');
  const [caption, setCaption] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<BrisketProgressPhoto | null>(null);

  useEffect(() => {
    loadPhotos();
  }, [sessionId]);

  const loadPhotos = async () => {
    try {
      const response = await fetch(`/api/brisket/${sessionId}/photos`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadingPhoto) return;

    try {
      const response = await fetch(`/api/brisket/${sessionId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadingPhoto,
          caption: caption || null,
        }),
      });

      if (response.ok) {
        setUploadingPhoto('');
        setCaption('');
        setShowUpload(false);
        loadPhotos();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return;

    try {
      const response = await fetch(`/api/brisket/${sessionId}/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadPhotos();
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const handleUpdateCaption = async (photoId: string) => {
    try {
      const response = await fetch(`/api/brisket/${sessionId}/photos/${photoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: editCaption }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditCaption('');
        loadPhotos();
      }
    } catch (error) {
      console.error('Error updating caption:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Loading photos...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhotoCamera color="primary" />
            <Typography variant="h6">Progress Photos</Typography>
            <Typography variant="caption" color="text.secondary">
              ({photos.length})
            </Typography>
          </Box>
          {isOwner && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => setShowUpload(!showUpload)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Add Photo
            </Button>
          )}
        </Box>

        {showUpload && isOwner && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <ImageUpload
              value={uploadingPhoto}
              onChange={(url) => setUploadingPhoto(url)}
              label="Progress Photo"
            />
            <TextField
              fullWidth
              size="small"
              placeholder="Add a caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!uploadingPhoto}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Upload
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowUpload(false);
                  setUploadingPhoto('');
                  setCaption('');
                }}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        {photos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PhotoCamera sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No progress photos yet
            </Typography>
            {isOwner && (
              <Typography variant="caption" color="text.secondary">
                Document your brisket journey!
              </Typography>
            )}
          </Box>
        ) : (
          <ImageList cols={3} gap={8} sx={{ mt: 2 }}>
            {photos.map((photo) => (
              <ImageListItem 
                key={photo.id}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.9 },
                }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || 'Progress photo'}
                  loading="lazy"
                  style={{ 
                    height: 200, 
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
                <ImageListItemBar
                  title={
                    editingId === photo.id ? (
                      <TextField
                        size="small"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        fullWidth
                      />
                    ) : (
                      photo.caption || 'No caption'
                    )
                  }
                  actionIcon={
                    isOwner && (
                      <Box onClick={(e) => e.stopPropagation()}>
                        {editingId === photo.id ? (
                          <IconButton
                            sx={{ color: 'white' }}
                            onClick={() => handleUpdateCaption(photo.id)}
                          >
                            <Close />
                          </IconButton>
                        ) : (
                          <>
                            <IconButton
                              sx={{ color: 'white' }}
                              onClick={() => {
                                setEditingId(photo.id);
                                setEditCaption(photo.caption || '');
                              }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              sx={{ color: 'white' }}
                              onClick={() => handleDelete(photo.id)}
                            >
                              <Delete />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    )
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </CardContent>

      <Dialog 
        open={!!selectedPhoto} 
        onClose={() => setSelectedPhoto(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedPhoto(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <Close />
          </IconButton>
          {selectedPhoto && (
            <Box>
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption || 'Progress photo'}
                style={{ width: '100%', display: 'block' }}
              />
              {selectedPhoto.caption && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1">{selectedPhoto.caption}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
