import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Layout from "@/components/layout/Layout";

export function ForgotPassword({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*?])[a-zA-Z\d@#$%&*?]{6,}$/;

    if (!email || !answer || !newPassword) {
      return toast.error("All fields needed");
    }
    if (!passwordRegex.test(newPassword)) {
      return toast.error(
        "Invalid password format"
      );
    }

    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/auth/forgot-password`,
        { email, answer, newPassword }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error tramission from backend", error);
    }
  };
  return (
    <Layout>
      <form className={cn("flex gap-6", className)} {...props}>
        <div className="w-1/2 h-[90vh]">
          <img
            src="/wineglass.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col r w-1/2 px-25  mt-3">
        <div className="mb-5 text-gray-500 shadow rounded-lg p-4 text-sm">
            Note : Your password must be a combination of alphanumeric
            characters including a uppercase letter and a special character.
          </div>
          <div className="flex flex-col items-center gap-2 text-center ">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Enter the details below to reset your password
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-3 z-10">
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
            <div className="grid gap-3 z-10">
              <div className="flex items-center">
                <Label htmlFor="answer">What is your favourite Sports?</Label>
              </div>
              <Input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your security answer"
                required
              />
            </div>
            <div className="grid gap-3 z-10">
              <div className="flex items-center">
                <Label htmlFor="answer">New Password</Label>
              </div>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              onClick={(e) => handleForgotPassword(e)}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
