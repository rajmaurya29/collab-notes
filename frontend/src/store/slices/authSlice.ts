import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signup: (state, action: PayloadAction<{ username: string; email: string; password: string }>) => {
      // Create a new user from signup data
      const newUser: User = {
        id: crypto.randomUUID(),
        username: action.payload.username,
        email: action.payload.email,
      };
      state.isAuthenticated = true;
      state.user = newUser;
    },
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      // For frontend-only implementation, create a user from login data
      const user: User = {
        id: crypto.randomUUID(),
        username: action.payload.email.split('@')[0], // Extract username from email
        email: action.payload.email,
      };
      state.isAuthenticated = true;
      state.user = user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { signup, login, logout } = authSlice.actions;
export default authSlice.reducer;
