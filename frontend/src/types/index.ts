// Core data models

export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
  owner: number;
  ownerName:string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  access: string;
  refresh: string;
}

// Redux state interfaces

export interface AuthState {
  loading:boolean,
  error:any,
  user: User | null;
}

export interface NotesState {
  notes: Note[];
  loading:boolean,
  error:any,
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
  id: number;
  title: string;
  preview: string;
  timestamp: string;
  category: string;
  onClick: () => void;
  onDelete?: (id: number) => void;
}
