import Layout from "@/components/layout/Layout";
import SidebarLayout from "@/components/layout/SidebarLayout";
import axios from "axios";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const status = ["processing", "delivered", "cancelled"];
  const [openRow, setOpenRow] = useState(null);
  const navigate = useNavigate();

  const getAllOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/liquorhub/product/all-orders`
      );
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error("Something unexpected happen");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occured fetching all orders");
    }
  };

  useEffect(() => {
    if (auth?.token) getAllOrders();
  }, [auth?.token]);

  const handleStatusChange = async (oid, newStatus) => {
    try {
      const {data} = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/liquorhub/product/update-order/${oid}`,{newStatus});
      if(data.success){
        setOrders((prevOrders)=>
           prevOrders.map((order)=>
             order._id === data.order.id ? data.order : order
          )
        )
        getAllOrders();
        toast.success("Status updated successfully");
      }
      
    } catch (error) {
      if(error.response.status === 400){
        console.log(error.response.data);
        toast.error(error.response.data.message);
      }else{
      console.log(error);
      toast.error("Error updating status");
      }
    }
  };
  return (
    <Layout title="Dashboard-All orders">
      <SidebarLayout>
        <div className="w-full h-[100%]">
          <div className="flex flex-col w-full items-center ">
            <h1 className=" text-2xl font-bold  ">All orders</h1>
            <h3 className="text-gray-500 text-sm pb-2">View all orders here</h3>
            <div className="flex p-6 shadow rounded-lg w-[90%] ">
              <Table >
                <TableHeader>
                  <TableRow >
                    <TableHead className="w-[10%] justify-center">S.no</TableHead>
                    <TableHead className="justify-center">Ref id</TableHead>
                    <TableHead className="justify-center">
                      Status
                    </TableHead>
                    <TableHead className="justify-center">Created</TableHead>
                    <TableHead className="justify-center">Amount</TableHead>
                    <TableHead className="w-[20%] items-center">Action</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders &&
                    orders.map((order, index) => (
                      <TableRow
                        className="h-12 "
                        key={order._id}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{order.transactionId}</TableCell>
                        <TableCell>
                          <Popover
                            openDelay={30}
                            closeDelay={50}
                            open={openRow === order._id}
                            onOpenChange={(open) => setOpenRow(open ? order._id : null)}
                          >
                            <PopoverTrigger asChild>
                              <Button variant="ghost" className="font-normal bg-white hover:bg-white hover:cursor-pointer dark:bg-[#0d1117]">
                                {order.status}
                                <ChevronDown />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Command>
                                {status.map((s) => (
                                  <CommandList key={s}>
                                    <AlertDialog>
                                      <AlertDialogTrigger>
                                        <CommandItem>{s}</CommandItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Are you absolutely sure?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This action will update the user's
                                            order status.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>{
                                              setOpenRow(null);
                                              handleStatusChange(order._id, s)
                                            }}
                                          >
                                            Continue
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </CommandList>
                                ))}
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>Rs.{order.totalAmount}</TableCell>
                        <TableCell><Button variant="outline" className="font-normal hover:bg-white hover:dark:bg-black/30" 
                                        onClick={()=>navigate(`/dashboard/admin/order-detail/${order._id}`)}>
                                          View details
                                    </Button></TableCell>
                      </TableRow>
                      )
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </Layout>
  );
};

export default AllOrders;
