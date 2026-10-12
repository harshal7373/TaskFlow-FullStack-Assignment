import {useState,useEffect,useCallback} from 'react';
import api,{errorMessage} from '../services/api';
export function useTasks(query){
 const [data,setData]=useState({tasks:[],total:0,page:1,pages:0,metrics:{total:0,pending:0,inProgress:0,completed:0}});
 const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [nonce,setNonce]=useState(0);
 const refresh=useCallback(()=>setNonce(n=>n+1),[]);
 useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');
  api.get('/tasks',{params:query,signal:controller.signal}).then(r=>setData(r.data)).catch(e=>{if(e.code!=='ERR_CANCELED')setError(errorMessage(e));}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return()=>controller.abort();
 },[query,nonce]);
 return {...data,loading,error,refresh};
}
