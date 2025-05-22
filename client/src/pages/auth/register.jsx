import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^(?=[a-zA-Z0-9._%+-]*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*?])[a-zA-Z\d@#$%&*?]{6,}$/;
    const phoneRegex = /^9[0-9]{9}$/;

    if (!name || !address || !phone || !email || !password || !answer) {
      return toast.error("All fields are mandatory");
    }
    if(!emailRegex.test(email)){
        return toast.error("Please enter a valid email");
    }
    if(!passwordRegex.test(password)){
      return toast.error("Password must be a combination of small,capital, special characters and more that 6 digits");
    }
    if(!phoneRegex.test(phone)){
      return toast.error("Please enter a valid phone number ");
    }
    
    //Fetching data from the server
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/liquorhub/auth/register`,
        { name, address, phone, email, password, answer}
      );
      //redirect to login if the registration is successful
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        return toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error fetching data form the server", error);
    }
  };
  return (
    <div>
      <Layout title="LiquorHub-register">
        <form className="flex mx-8">
          <div className="flex w-1/2 h-[90vh] justify-center   ">
            <img
              src="/jd.png"
              alt=""
              className="h-screen w-[53%] object-cover "
            />
          </div>
          <div className="w-1/2 px-28 py-5 ">
            <div className="flex flex-col items-center gap-2 text-center ">
              <h1 className="text-2xl font-bold">Register your account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your details below to register your account
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-3 ">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="grid gap-3 ">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address here"
                  required
                />
              </div>
              <div className="grid gap-3 ">
                <Label htmlFor="answer">What is your favourite sports?</Label>
                <h1 className="text-xs text-green-900">*This will be used to reset your password if you forgot</h1>
                <Input
                  id="answer"
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Your security answer"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98*******"
                  required
                />
              </div>
              <div className="grid gap-3 ">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3 ">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                    id="password"
                    type={`${showPassword ? "text" : "password"}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2"
                    required
                  />
                 
                  <Button
                    className="absolute ml-[26%]  h-5 text-xs mt-8.5  cursor-pointer text-gray-600"
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
              <Button
                type="submit"
                className="w-full cursor-pointer dark:bg-[#161b22]  hover:dark:bg-[#1c2128] dark:text-white"
                onClick={(e) => handleRegister(e)}
              >
                Register
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>
        </form>
      </Layout>
    </div>
  );
};

export default RegisterPage;
