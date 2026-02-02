import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import type { NotesState } from '../../types';
import axios from 'axios';
import { logoutUser } from './authSlice';
// Sample notes data matching backend format

const API_URL = import.meta.env.VITE_API_URL as string;


export const fetchNotes=createAsyncThunk(
    "fetchNotes",async (_,thunkAPI)=>{
        try{
            const response= await axios.get(`${API_URL}/notes/`,
              {withCredentials:true}
            )
            // console.log(response.data)
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)



export const addNote=createAsyncThunk(
    "addNote",async ({title,content,category}:{title:string,content:string,category:string},thunkAPI)=>{
        try{
            const response= await axios.post(`${API_URL}/notes/`,{title,content,category},
              {withCredentials:true}
            )
            // console.log(response.data)
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)


export const deleteNote=createAsyncThunk(
    "deleteNote",async ({noteId}:{noteId:number},thunkAPI)=>{
        try{
            const response= await axios.delete(`${API_URL}/notes/${noteId}/`,
              {withCredentials:true}
            )
            // console.log(response.data)
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)


export const updateNote=createAsyncThunk(
    "updateNote",async ({id,title,content,category}:{id:string,title:string,content:string,category:string},thunkAPI)=>{
        try{
            const response= await axios.put(`${API_URL}/notes/${id}/`,{title,content,category},
              {withCredentials:true}
            )
            // console.log(response.data)
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)


export const fetchIndividualNote=createAsyncThunk(
    "fetchIndividualNote",async ({noteId}:{noteId:number},thunkAPI)=>{
        try{
            const response= await axios.get(`${API_URL}/notes/${noteId}/`,
              {withCredentials:true}
            )
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)

const initialState: NotesState = {
  notes: [],
  loading:false,
  error:null
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,

  reducers: {

  },


  extraReducers:(builder)=>{
    builder.addCase(fetchNotes.fulfilled,(state,action)=>{
      state.loading=false,
      // console.log(action.payload)
      state.notes=action.payload
      state.error=null
    })
    builder.addCase(fetchNotes.pending,(state)=>{
      state.loading=true,
      state.error=null
    })
    builder.addCase(fetchNotes.rejected,(state,action)=>{
      state.loading=false,
      state.error=action.payload
    })
    builder.addCase(fetchIndividualNote.fulfilled,(state,action)=>{
      state.loading=false
      // Add or update the note in the notes array
      const existingNoteIndex = state.notes.findIndex(note => note.id === action.payload.id)
      if (existingNoteIndex !== -1) {
        state.notes[existingNoteIndex] = action.payload
      } else {
        state.notes.push(action.payload)
      }
      state.error=null
    })
    builder.addCase(fetchIndividualNote.pending,(state)=>{
      state.loading=true,
      state.error=null
    })
    builder.addCase(fetchIndividualNote.rejected,(state,action)=>{
      state.loading=false,
      state.error=action.payload
    })
    builder.addCase(logoutUser.fulfilled,(state)=>{
      state.notes=[]
    })
  }
});

export default notesSlice.reducer;
