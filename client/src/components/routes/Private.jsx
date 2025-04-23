import { useAuth } from "@/context/auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import SpinnerComp from "../spinnerComp";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Private = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const authCheck = async () => {
      const token = auth.token;
      // if token is present
      if (token) {
        //checking if token is expired
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
        //if token is not expired validating the token
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/liquorhub/auth/user-auth`,{
            headers: {
              Authorization: `Bearer ${auth?.token}` 
            }
          }
        );
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      }else{
        setOk(false);
      }
    };
    if (auth?.token) {
      authCheck();
    }
  }, [auth?.token]);

  return ok ? <Outlet /> : <SpinnerComp />;
};

export default Private;
