import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NotesState, Note } from '../../types';

// Sample notes data matching HTML mockups
const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes',
    body: 'Discussed project timeline and deliverables...',
    category: 'Work',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Shopping List',
    body: 'Milk, eggs, bread, coffee...',
    category: 'Personal',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Project Ideas',
    body: 'Build a collaborative note-taking app with real-time sync...',
    category: 'Work',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Book Recommendations',
    body: 'The Pragmatic Programmer, Clean Code, Design Patterns...',
    category: 'Personal',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialState: NotesState = {
  notes: sampleNotes,
  currentNoteId: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newNote: Note = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.notes.push(newNote);
      state.currentNoteId = newNote.id;
    },
    updateNote: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<Note, 'id' | 'createdAt'>> }>) => {
      const noteIndex = state.notes.findIndex(note => note.id === action.payload.id);
      if (noteIndex !== -1) {
        state.notes[noteIndex] = {
          ...state.notes[noteIndex],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
      if (state.currentNoteId === action.payload) {
        state.currentNoteId = null;
      }
    },
    setCurrentNote: (state, action: PayloadAction<string | null>) => {
      state.currentNoteId = action.payload;
    },
  },
});

export const { addNote, updateNote, deleteNote, setCurrentNote } = notesSlice.actions;
export default notesSlice.reducer;
