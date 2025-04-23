import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import SpinnerComp from '../spinnerComp';
import { useAuth } from '@/context/auth';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = () => {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();

    useEffect(()=>{
        const authCheck = async () =>{
          const token = auth.token;
          const decoded = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();
          if(isExpired){
            setOk(false);
            localStorage.removeItem('auth');
            setAuth({user:null, token:''});
            toast.error("Your token has expired ! Login Again");
            navigate('/login');
            return;
          }
            const res= await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/liquorhub/auth/admin-auth`,{
                headers: {
                  Authorization: `Bearer ${auth?.token}` 
                }
              });
            if(res.data.ok){
                setOk(true);
            }else{
                setOk(false);
            }
        }
        if(auth?.token){
           authCheck();
        }
        
    },[auth?.token]);



  return ok? <Outlet/> : <SpinnerComp/>
}

export default AdminRoute
