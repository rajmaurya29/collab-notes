import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import type { NotesState } from '../../types';
import axios from 'axios';
// Sample notes data matching backend format

const API_URL = import.meta.env.VITE_API_URL as string;


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

const individualNoteSlice = createSlice({
  name: 'individualNote',
  initialState,

  reducers: {

  },


  extraReducers:(builder)=>{
    
    builder.addCase(fetchIndividualNote.fulfilled,(state,action)=>{
      state.loading=false
      state.notes=action.payload
    })
    builder.addCase(fetchIndividualNote.pending,(state)=>{
      state.loading=true,
      state.error=null
    })
    builder.addCase(fetchIndividualNote.rejected,(state,action)=>{
      state.loading=false,
      state.error=action.payload
    })
   
  }
});

export default individualNoteSlice.reducer;
