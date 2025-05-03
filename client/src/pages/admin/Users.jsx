import Layout from "@/components/layout/Layout";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const getUserList = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/liquorhub/user/list`
      );
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error gettting users list");
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <div>
      <Layout title="Dashboard-Users">
        <SidebarLayout>
          <div className="w-full h-screen flex flex-col items-center">
            <h1 className="text-2xl font-bold ">User Details </h1>
            <h3 className="text-gray-600 text-sm">Analyze system users here</h3>
            <div className="w-[100%] p-5 ">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.no</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="flex justify-center items-center">Role</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user, index) => (
                    <TableRow className="h-10" key={user._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user?.name}</TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell className="flex justify-center">
                        <span
                          className={`text-center rounded-xl text-xs font-medium p-1.5 ${
                            user?.role === 1 ? "bg-black/80 text-white" : "border"
                          } w-17`}
                        >{`${user?.role === 1 ? "Admin" : "Customer"}`}</span>
                      </TableCell>
                      <TableCell>{user?.orderCount}</TableCell>
                      <TableCell>{user?.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SidebarLayout>
      </Layout>
    </div>
  );
};

export default Users;
