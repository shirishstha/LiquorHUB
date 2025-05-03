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
  BarChart,
  Bar,
  AreaChart,
  Area,
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

const AdminDashboard = () => {
  const [orderData, setOrderData] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [itemSales, setItemSales] = useState([]);
  const [mostSold, setMostSold] = useState([]);
  const [mostCatSold, setMostCatSold] = useState([]);
  const [lowstock, setLowstock] = useState([]);

  const [auth] = useAuth();
  const success = ["success", "delivered"];
  const getUserOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/liquorhub/product/all-orders`
      );
      if (data.success) {
        //for calculating total sales
        const totalAmount = data?.orders?.reduce((acc, order) => {
          if (success.includes(order.status)) {
            acc += order.totalAmount;
          }
          return acc;
        }, 0);
        setTotalSales(totalAmount);

        //for graph chart
        const filteredOrder = data?.orders
          ?.filter((order) => success.includes(order.status))
          .map((order) => ({
            date: order.updatedAt.split("T")[0],
            amount: order.totalAmount,
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setOrderData(filteredOrder);

        //for most sales list
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
        const topsales = Object.values(repeatCount)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        setMostSold(topsales);

        //category wise sales rank
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
        setMostCatSold(topOrdersByCategory);

        //top sold product's amount
        let totalSumOfAProduct = {};
        data?.orders?.forEach((order) => {
          if (success.includes(order.status)) {
            order?.products?.forEach((product) => {
              const pid = product._id._id;
              const acc = product.quantity * product._id.price;
              if (totalSumOfAProduct[pid]) {
                totalSumOfAProduct[pid].total += acc;
              } else {
                totalSumOfAProduct[pid] = {
                  total: acc,
                  name: product._id.name,
                };
              }
            });
          }
        });
        let rankOfSingleProductSales = Object.values(totalSumOfAProduct)
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

          console.log(rankOfSingleProductSales);
        setItemSales(rankOfSingleProductSales);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error getting user orders");
    }
  };

  //fetching all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/product/getall-product?limit=100`
      );
      if (data.success) {
        const filteredStock = data?.products?.filter(
          (product) => product?.quantity < 5
        );
        setLowstock(filteredStock);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong fetching or filtering  products");
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getUserOrders();
      getAllProducts();
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
              <h3 className="text-gray-600  text-sm">
                Here are all your business reports
              </h3>
            </div>

            <div className="flex shadow rounded-md p-3 w-[28%] bg-gray-50">
              <span className="flex items-center my-5 p-2 bg-white rounded-full">
                <Package2 color="black" />
              </span>
              <div className="p-2 ">
                <h1 className="text-3xl ">Rs.{totalSales}</h1>
                <h2 className="  text-xs text-gray-600">Total Sales</h2>
              </div>
            </div>

            <h1 className="text-xl mb-1">Sales Chart </h1>
            <ResponsiveContainer height={300}>
              <AreaChart data={orderData}>
                <XAxis dataKey="date" minTickGap={32} tickMargin={10} />
               
                <Area  type="monotone" dataKey="amount" stroke="#525252" fill="#F5F5F5" strokeWidth={0.3} fillOpacity={0.8} />
                <Tooltip />
         
              </AreaChart>
            </ResponsiveContainer>

            {/* Most ordered products section */}
            <div className="">
              <div className="p-2 py-2 ">
                <h1 className="text-xl "> Top Ordered</h1>
                <h3 className="text-gray-600 pb-2 text-sm ">
                  Most ordered items list
                </h3>
              </div>

              <Table className="w-[60%] ">
                <TableHeader>
                  <TableRow className="hover:bg-white">
                    <TableHead className="w-[30%] text-gray-800">SN.</TableHead>
                    <TableHead className="w-[50%] text-gray-800">
                      Name of Product
                    </TableHead>
                    <TableHead className="w-[20%] text-gray-800">
                      Ordered times
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mostSold?.map((product, index) => (
                    <TableRow key={product.name}>
                      <TableCell className="text-sm">{index + 1}</TableCell>
                      <TableCell className="text-sm ">{product.name}</TableCell>
                      <TableCell className="text-center">
                        {product.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-10 py-2 ">
                <h1 className="text-xl "> Most Revenue</h1>
                <h3 className="text-gray-600 pb-2 text-sm ">
                  Highest revenue generated according to product 
                </h3>
              </div>
              <ResponsiveContainer width="120%" height={300} className="mt-0 ">
                <BarChart data={itemSales}>
                  <Tooltip cursor={false}/>
                  <XAxis dataKey="name"  className="text-sm" />
                  <YAxis />
                  <Bar
                    dataKey="total"
                    barSize={25}
                    fill="#CDCDCF"
                    fillOpacity={1}
                    stroke="#525252"
                    strokeWidth={0.2}
                  />
                </BarChart>
                <div className="flex space-x-1 justify-center">
                  <div className="w-[10px] h-[10px] bg-[#CDCDCF]" />
                  <p className=" text-sm pr-2 text-gray-600 ">Total Sales</p>
                </div>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-span-1 px-2 text-gray-800">
            <h1 className="text-xl p-2"> Top Orders by Category</h1>

            <Table className="w-[100%] ">
              <TableHeader>
                <TableRow className="hover:bg-white">
                  <TableHead className="w-[80%] text-gray-800 ">
                    Category
                  </TableHead>
                  <TableHead className="w-[20%] text-gray-800 text-center">
                    Ordered times
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostCatSold?.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="text-sm ">{product.name}</TableCell>
                    <TableCell className="text-center">
                      {product.count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h1 className="text-xl p-2 pt-20 "> Low Stock Summary</h1>
            <Table className="w-[100%] ">
              <TableHeader>
                <TableRow className="hover:bg-white">
                  <TableHead className="w-[70%] text-gray-800">
                    Product
                  </TableHead>
                  <TableHead className="w-[30%] text-gray-800 text-center">
                    Stock
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowstock?.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="text-sm ">{product.name}</TableCell>
                    <TableCell className="text-center">
                      {product.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarLayout>
    </Layout>
  );
};

export default AdminDashboard;
