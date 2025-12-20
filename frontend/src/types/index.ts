// Core data models

export interface Note {
  id: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

// Redux state interfaces

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface NotesState {
  notes: Note[];
  currentNoteId: string | null;
}

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface RootState {
  auth: AuthState;
  notes: NotesState;
  theme: ThemeState;
}

// Component prop interfaces

export interface FormInputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export interface NoteCardProps {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  category: string;
  onClick: () => void;
  onDelete?: (id: string) => void;
}
