import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import type { NotesState } from '../../types';
import axios from 'axios';
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
  }
});

export default notesSlice.reducer;
