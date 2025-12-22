import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL as string;


export const loginUser=createAsyncThunk(
    "loginUser",async ({email,password}:{email:string,password:string},thunkAPI)=>{
        try{
            const response= await axios.post(`${API_URL}/users/login/`,{"username":email,"password":password},
              {withCredentials:true}
            )
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)
export const logoutUser=createAsyncThunk(
    "logoutUser",async (_,thunkAPI)=>{
        try{
            const response= await axios.post(`${API_URL}/users/logout/`,{},
                {withCredentials:true}
             
            )
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)
export const fetchUser=createAsyncThunk(
    "fetchUser",async (_,thunkAPI)=>{
        try{
            const response= await axios.get(`${API_URL}/users/fetch/`
            )
            return response.data;
        }
        catch(error:any){
            return thunkAPI.rejectWithValue(error.message);
        }
    
}
)

interface loginState{
    userInfo:any,
    loading:boolean,
    error:any
}

const initialState:loginState={
    userInfo:null,
    loading:false,
    error:null
};



const authSlice = createSlice({
  name:"User",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(loginUser.pending,(state)=>{
            state.loading=true,
            state.error=null
        });
        builder.addCase(loginUser.fulfilled,(state,action)=>{
            state.loading=false,
            state.userInfo=action.payload
            // const item=action.payload
            // let itemList={email:item['email'],id:item['id'],isAdmin:item['isAdmin'],name:item['name'],username:item['username'],_id:item['_id']}
            // localStorage.setItem("userInfo",JSON.stringify(itemList))
            // console.log("action-",action.payload)
        })
        builder.addCase(loginUser.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload
        })
        builder.addCase(fetchUser.fulfilled,(state,actions)=>{
            state.userInfo=actions.payload,
            state.loading=false
        })
        builder.addCase(logoutUser.fulfilled,(state)=>{
            state.userInfo=null,
            
            state.loading=false,
            state.error=null
            // localStorage.removeItem("userInfo")
        })
    }
}
);

export default authSlice.reducer;
