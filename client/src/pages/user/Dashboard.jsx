import Layout from "@/components/layout/Layout";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { useAuth } from "@/context/auth";
import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  Tooltip,
  Line,
  YAxis,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package2 } from "lucide-react";
import { useTheme } from "@/context/theme";

const Dashboard = () => {
  const [orderData, setOrderData] = useState([]);
  const [totalPurchase, setTotalPurchase] = useState([]);
  const [mostPurchased, setMostPurchased] = useState([]);
  const [mostCatPurchased, setMostCatPurchased] = useState([]);

  const [auth] = useAuth();
  const success = ["success", "processing", "delivered", "shipped"];
  const [theme] = useTheme();

  const getUserOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/liquorhub/product/user-orders`
      );
      if (data.success) {
        //for calculating total purchase
        const totalAmount = data?.orders?.reduce((acc, order) => {
          if (success.includes(order.status)) {
            acc += order.totalAmount;
          }
          return acc;
        }, 0);
        setTotalPurchase(totalAmount);

        //for graph chart
        const filteredOrder = data?.orders
          ?.filter((order) => success.includes(order.status))
          .map((order) => ({
            date: order.updatedAt.split("T")[0],
            amount: order.totalAmount,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setOrderData(filteredOrder);

        //for most purchase list
        let repeatCount = {};
        data?.orders?.forEach((order) => {
          if (success.includes(order.status)) {
            order?.products?.forEach((product) => {
              const pid = product._id._id;
              if (repeatCount[pid]) {
                repeatCount[pid].count++;
              } else {
                repeatCount[pid] = {
                  count: 1,
                  name: product._id.name,
                };
              }
            });
          }
        });
        const topPurchase = Object.values(repeatCount)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        setMostPurchased(topPurchase);

        //category wise purchase rank
        let repeatCatCount = {};
        data?.orders?.forEach((order) => {
          if (success.includes(order.status)) {
            order?.products?.forEach((product) => {
              const cid = product._id.category._id;
              if (repeatCatCount[cid]) {
                repeatCatCount[cid].count++;
              } else {
                repeatCatCount[cid] = {
                  name: product._id.category.name,
                  count: 1,
                };
              }
            });
          }
        });

        const topOrdersByCategory = Object.values(repeatCatCount)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        setMostCatPurchased(topOrdersByCategory);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error getting user orders");
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getUserOrders();
    }
  }, [auth?.token]);

  return (
    <Layout title="Dashboard">
      <SidebarLayout>
        <div className="grid grid-cols-4 w-full mt-2">
          <div className="flex flex-col space-y-10 w-full px-5 col-span-3">
            {/* chart section */}
            <div>
              <h1 className="text-2xl font-semibold">
                Welcome back, {auth.user.name}!
              </h1>
              <h3 className="text-gray-600  dark:text-gray-500 text-sm">
                Here are all your purchase reports
              </h3>
            </div>

            <div className="flex shadow dark:shadow-gray-900 rounded-md p-3 w-[28%] dark:bg-[#161b22] ">
              <span className="flex items-center my-5 p-2 bg-gray-50 dark:bg-[#0d1117] rounded-full">
                <Package2 />
              </span>
              <div className="p-2">
                <h1 className="text-3xl ">
                  Rs.{`${orderData.length > 0 ? totalPurchase : "0"}`}
                </h1>
                <h2 className="  text-xs text-gray-600 dark:text-gray-500">Total Purchase</h2>
              </div>
            </div>

            <h1 className="text-xl mb-1">Purchase Chart </h1>

            {orderData.length > 0 ? (
              <div className="h-[140%] dark:bg-[#0d1117] ">
                <ResponsiveContainer>
                  <LineChart data={orderData}>
                    <XAxis dataKey="date" minTickGap={32} tickMargin={10} />
                    <YAxis tickMargin={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',  
                        border: '1px solid #2c2c2c',
                        borderRadius: '8px',
                        padding: '10px',
                      }}
                      labelStyle={{
                        color: '#fafafa',
                        marginBottom: '4px',
                      }}
                      itemStyle={{
                        color: '#fafafa',
                      }}
                    />

                    <Line type="monotone" dataKey="amount" stroke={`${theme === 'dark' ? '#fafafa' : '#191919'} `} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-50 text-gray-500">
                You will see your purchase chart here once you successfully
                place a order.
              </div>
            )}

            {/* Most ordered products section */}
            <div className="">
              <div className="p-2 py-2 ">
                <h1 className="text-xl "> Top Ordered</h1>
                <h3 className="text-gray-600 pb-2 text-sm dark:text-gray-500">
                  Most ordered items list
                </h3>
              </div>

              {orderData.length > 0 ? (
                <Table className="w-[60%]">
                  <TableHeader>
                    <TableRow className="hover:bg-white hover:dark:bg-[#0d1117]">
                      <TableHead className="w-[30%] ">SN.</TableHead>
                      <TableHead className="w-[50%] ">
                        Name of Product
                      </TableHead>
                      <TableHead className="w-[20%]">Ordered times</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mostPurchased?.map((product, index) => (
                      <TableRow key={product.name}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm ">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {product.count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="h-50 text-gray-500">
                  You will see your top ordered items here once you successfully
                  place a order.{" "}
                </div>
              )}
            </div>
          </div>
          <div className="col-span-1 px-2">
            <h1 className="text-xl p-2"> Top Orders by Category</h1>

            <Table className="w-[100%] ">
              <TableHeader>
                <TableRow className="hover:bg-white hover:dark:bg-[#0d1117]">
                  <TableHead className="w-[50%] ">Category</TableHead>
                  <TableHead className="w-[20%]">Ordered times</TableHead>
                </TableRow>
              </TableHeader>
              {orderData.length > 0 ? (
                <TableBody>
                  {mostCatPurchased?.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell className="text-sm ">{product.name}</TableCell>
                      <TableCell className="text-center">
                        {product.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <div className="h-50 text-gray-500 w-full">
                  Nothing to display
                </div>
              )}
            </Table>

          </div>
        </div>
      </SidebarLayout>
    </Layout>
  );
};

export default Dashboard;
