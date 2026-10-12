import axios from 'axios';
import {store,loggedOut} from '../store';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',timeout:15000});
api.interceptors.request.use(config=>{const token=store.getState().auth.token;if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
api.interceptors.response.use(res=>res,err=>{if(err.response?.status===401&&store.getState().auth.token){store.dispatch(loggedOut());if(!location.pathname.startsWith('/login'))location.assign('/login');}return Promise.reject(err);});
export const errorMessage=e=>e.response?.data?.message|| (e.code==='ECONNABORTED'?'Request timed out':!e.response?'Unable to connect to server. Check your network.':'Request failed');
export default api;
