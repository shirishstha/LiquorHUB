import Layout from "@/components/layout/Layout";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { useAuth } from "@/context/auth";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (auth?.user) {
      setAddress(auth.user.address);
      setName(auth.user.name);
      setPhone(auth.user.phone);
    }
  }, [auth]);

  useEffect(()=>{
    if(auth){
      localStorage.setItem("auth",JSON.stringify(auth));
    }  
   
  },[auth])

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/auth/update-profile/${auth?.user?._id}`,
        { name, address, phone }
      );
      if (data.success) {
        toast.success("Profile updated successfully");
        setAuth({
          ...auth,
          user: {
            ...auth.user,
            name: data.updatedUser.name,
            address: data.updatedUser.address,
            phone: data.updatedUser.phone,
          },
        });
     
      } else {
        toast.error("Profile update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating profile");
    }
  };



  return (
      <Layout title="Dashboard-Manage Profile">
        <SidebarLayout>
        
          <div className="flex flex-col  px-28  w-full mt-10">
            <div className="flex flex-col  text-center ">
              <h1 className="text-2xl font-bold">Manage Profile</h1>
              <p className="text-muted-foreground text-sm ">
                Edit your profile details here.
              </p>
            </div>
            <div className=" grid gap-4 w-[60%] ml-auto mr-auto">
              <div className="grid gap-3 z-0">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={auth?.user?.email}
                  disabled
                />
              </div>
              <div className="grid gap-3 z-0">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3 z-0">
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
              <div className="grid gap-3 z-0">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98********"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer dark:bg-[#161b22] hover:dark:bg-[#1c2128] dark:text-white"
                onClick={() => handleUpdate()}
              >
                Update
              </Button>
            </div>
          </div>
        </SidebarLayout>
      </Layout>
  );
};

export default Profile;
