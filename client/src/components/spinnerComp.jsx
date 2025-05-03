import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

const SpinnerComp = () => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  const [auth] = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => prevValue - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count === 0) {
      navigate(`${auth?.user? (auth?.user?.role === 1 ?'/dashboard/admin':'/'):'/login'}`,{
        state: { from:location }  
      });
    }
  },[count])

  return (
    <>
      <div className="flex flex-col justify-center h-screen items-center ">
        <p className="text-4xl font-bold">Unauthorized Access</p>
        <div className="text-4xl ">Redirecting to you in {count} second</div>
        <div>
          <Spinner />
        </div>
      </div>
    </>
  );
};

export default SpinnerComp;
