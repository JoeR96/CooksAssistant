"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RecipeNote } from "@/lib/db/types";

interface RecipeNotesProps {
  recipeId: string;
}

export function RecipeNotes({ recipeId }: RecipeNotesProps) {
  const [notes, setNotes] = useState<RecipeNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState({ text: "", imageUrl: "" });
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

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.text.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/recipes/${recipeId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        const createdNote = await response.json();
        setNotes(prev => [createdNote, ...prev]);
        setNewNote({ text: "", imageUrl: "" });
        setShowAddForm(false);
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
      <div className="animate-pulse space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Recipe Notes</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Note
        </button>
      </div>

      {/* Add Note Form */}
      {showAddForm && (
        <form onSubmit={handleAddNote} className="mb-6 rounded-lg border border-slate-200 p-4">
          <div className="mb-4">
            <label htmlFor="noteText" className="block text-sm font-medium text-slate-700 mb-2">
              Your cooking experience
            </label>
            <textarea
              id="noteText"
              rows={4}
              value={newNote.text}
              onChange={(e) => setNewNote(prev => ({ ...prev, text: e.target.value }))}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="How did it turn out? Any modifications you made? Tips for next time?"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="noteImage" className="block text-sm font-medium text-slate-700 mb-2">
              Photo URL (optional)
            </label>
            <input
              type="url"
              id="noteImage"
              value={newNote.imageUrl}
              onChange={(e) => setNewNote(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder="https://example.com/your-photo.jpg"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewNote({ text: "", imageUrl: "" });
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newNote.text.trim()}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Note"}
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto h-16 w-16 text-slate-300 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <p className="text-slate-500">
            No notes yet. Add your first cooking experience!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="text-xs text-slate-500">
                  {new Date(note.createdAt).toLocaleDateString()} at{" "}
                  {new Date(note.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-slate-400 hover:text-red-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {note.imageUrl && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={note.imageUrl}
                    alt="Recipe note"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                {note.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}