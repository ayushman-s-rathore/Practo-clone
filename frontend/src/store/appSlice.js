
import {  createSlice } from "@reduxjs/toolkit";


const appSlice=createSlice({
    name:"app",
    initialState:{
        searchOpen: false,
        serchQuery: null,
        userDetail: localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")): null
        
    },
    reducers:{
        setSearchOpen:(state,action)=>{
            state.searchOpen=action.payload
        },
        setSearchQuery:(state,action)=>{
            state.serchQuery=action.payload
        },
        setUserDetail:(state,action)=>{
            state.userDetail=action.payload
        }
    }
})


export const { setSearchOpen, setSearchQuery, setUserDetail } = appSlice.actions
export default appSlice.reducer