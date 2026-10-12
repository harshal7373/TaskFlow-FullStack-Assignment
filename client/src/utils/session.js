const KEY='taskflow_session';
export const readSession=()=>{try{return JSON.parse(localStorage.getItem(KEY)||sessionStorage.getItem(KEY)||'null');}catch{return null;}};
export const saveSession=(data,remember)=>{localStorage.removeItem(KEY);sessionStorage.removeItem(KEY);(remember?localStorage:sessionStorage).setItem(KEY,JSON.stringify(data));};
export const clearSession=()=>{localStorage.removeItem(KEY);sessionStorage.removeItem(KEY);};
