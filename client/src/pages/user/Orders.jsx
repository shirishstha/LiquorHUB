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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const navigate = useNavigate();

  //get user's orders
  const getUserOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/liquorhub/product/user-orders`
      );
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occured getting order details");
    }
  };

  useEffect(() => {
    if (auth?.token) getUserOrders();
  }, [auth?.token]);
  return (
    <div>
      <Layout title="Dashboard-User Orders">
        <SidebarLayout>
          <div className="w-full h-[100%]">
            <div className="flex flex-col w-full items-center ">
              <h1 className="text-center text-2xl font-bold ">My orders</h1>
              <h3 className="text-gray-600 text-sm pb-3">View your all orders here</h3>
              <div className="flex p-6 shadow rounded-lg w-[90%] ">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S.no</TableHead>
                      <TableHead>Ref id</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders &&
                      orders.map((order, index) => (
                        <TableRow
                          className="h-12 cursor-pointer"
                          key={order._id}
                          onClick={() =>
                            navigate(`/dashboard/user/order/${order._id}`)
                          }
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{order.transactionId}</TableCell>
                          <TableCell>
                            <span
                              className={`p-1.5 rounded-lg ${
                                order.status === "delivered"
                                  ? "dark:bg-green-900 bg-green-100"
                                  : order.status === "cancelled" ? "dark:bg-red-900 bg-red-100": "dark:bg-yellow-900 bg-yellow-100"
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>Rs.{order.totalAmount}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <h1 className="text-center text-lg p-5 text-gray-400">{orders.length < 1? "You don't have any orders.":''}</h1>
            </div>
          </div>
        </SidebarLayout>
      </Layout>
    </div>
  );
};

export default Orders;
