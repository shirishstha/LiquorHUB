import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@/context/auth";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Both email and password needed");
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/liquorhub/auth/login`,
        { email, password }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data, null, 4));
        navigate(location.state?.from?.pathname || res.data.user?.role === 0? "/":"/dashboard/admin");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error tramission from backend", error);
    }
  };
  return (
    <Layout title="LiquorHub-login">
      <form onSubmit={handleLogin}  >
        <div className="flex gap-6 ">
          <div className="flex flex-col justify-center w-1/2 px-28  ">
            <div className="flex flex-col items-center gap-2 text-center ">
              <h1 className="text-2xl font-bold">Login to your account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-3 ">
                <Label htmlFor="email">Email</Label>
                <div className="flex">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    className="p-2"
                    required
                  />
                
                </div>
              </div>
              <div className="grid gap-3 ">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="flex">
                  <Input
                    id="password"
                    type={`${showPassword ? "text" : "password"}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2"
                    required
                  />
                 
                  <Button
                    className="absolute ml-[28%] h-5 text-xs mt-2 p-0 cursor-pointer text-gray-600"
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      showPassword
                        ? setShowPassword(false)
                        : setShowPassword(true)
                    }
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full cursor-pointer dark:bg-[#161b22]  hover:dark:bg-[#1c2128] dark:text-white">
                Login
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?
              <Link to="/register" className="underline underline-offset-4 ">
                Register
              </Link>
            </div>
          </div>
          <div className="w-1/2 h-[90vh]">
            <img
              src="/wineglass.png"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default LoginPage;
