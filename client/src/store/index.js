import {configureStore,createSlice} from '@reduxjs/toolkit';
import {readSession,saveSession,clearSession} from '../utils/session';
const auth=createSlice({name:'auth',initialState:readSession()||{token:null,user:null},reducers:{loggedIn:(state,action)=>{state.token=action.payload.token;state.user=action.payload.user;saveSession(action.payload,action.payload.remember);},loggedOut:state=>{state.token=null;state.user=null;clearSession();}}});
export const {loggedIn,loggedOut}=auth.actions;
export const store=configureStore({reducer:{auth:auth.reducer}});
