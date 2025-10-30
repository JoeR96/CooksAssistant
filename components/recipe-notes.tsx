"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Skeleton,
  Chip,
} from "@mui/material";
import {
  Add,
  Delete,
  StickyNote2,
} from "@mui/icons-material";
import { RecipeNote } from "@/lib/db/types";
import { AddNoteModal } from "./add-note-modal";

interface RecipeNotesProps {
  recipeId: string;
}

export function RecipeNotes({ recipeId }: RecipeNotesProps) {
  const [notes, setNotes] = useState<RecipeNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [recipeId]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}/notes`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (noteData: { text: string; imageUrl: string }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/recipes/${recipeId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        const createdNote = await response.json();
        setNotes(prev => [createdNote, ...prev]);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  if (isLoading) {
    return (
      <Stack spacing={2}>
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={96} sx={{ borderRadius: 2 }} />
        ))}
      </Stack>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2" fontWeight={600}>
          Recipe Notes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsModalOpen(true)}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Add Note
        </Button>
      </Box>

      {/* Notes List */}
      {notes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <StickyNote2 sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No notes yet. Add your first cooking experience!
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {notes.map((note) => (
            <Card key={note.id} sx={{ borderRadius: 2 }}>
              <CardContent>
                {/* Note Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Chip
                    label={new Date(note.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                  <IconButton
                    onClick={() => handleDeleteNote(note.id)}
                    size="small"
                    color="error"
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'error.light',
                        color: 'error.contrastText'
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>

                {/* Note Image */}
                {note.imageUrl && (
                  <Box sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                    <Image
                      src={note.imageUrl}
                      alt="Recipe note"
                      width={400}
                      height={300}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                )}

                {/* Note Text */}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-line',
                    lineHeight: 1.6,
                    color: 'text.primary'
                  }}
                >
                  {note.text}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Add Note Modal */}
      <AddNoteModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNote}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
}