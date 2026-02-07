import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notesReducer from './slices/notesSlice';
import themeReducer from './slices/themeSlice';
import individualNoteReducer from './slices/individualNoteSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    individualNote:individualNoteReducer,
    theme: themeReducer,
  },
});

// Export types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
