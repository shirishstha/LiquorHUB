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
import { Link, useParams } from "react-router-dom";
const AdminOrderDetails = () => {
  const params = useParams();
  const { oid } = params;
  const [order, setOrder] = useState({});
  const getOrderDetails = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/liquorhub/product/order/${oid}`
      );
      if (data.success) {
        console.log(data);
        setOrder(data.order);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error getting order details");
    }
  };
  useEffect(() => {
    getOrderDetails();
  }, [params.oid]);

  const calcItemTotal = (quantity, price) => {
    return quantity * price;
  };

  const calcTotalAmount = () => {
    const total = order?.products?.reduce(
      (sum, product) => sum + product.quantity * product._id.price,
      0
    );
    return total;
  };
  const shipping = 200;
  const grandTotal = calcTotalAmount() + shipping;
  return (
    <Layout title="Order Details">
      <SidebarLayout>
        {order ? (
          <div className="flex flex-col h-[100%] w-[100%] p-6 items-center">
            <div className="flex h-[10%  w-full justify-between items-center pb-5">
              <h1 className="text-xl font-medium">
                Order #{order.transactionId} -{order.user?.name}
              </h1>
              <h3 className="text-gray-500">
                Placed on {new Date(order?.createdAt)?.toLocaleDateString()}
              </h3>
            </div>

            <div className="flex flex-col h-[60%]  w-full shadow rounded-lg p-3 mr-3">
              <div className="flex w-full pb-5 p-3">
                <div className="flex flex-col w-[15%]">
                  <h1 className="font-medium">Shipping Address</h1>
                  <h2 className="text-gray-500">{order?.user?.address}</h2>
                </div>
                <div className="flex flex-col items-center w-[85%]">
                  <h1 className="font-medium">Billing Address</h1>
                  <h2 className="text-gray-500">same as shipping address</h2>
                </div>
              </div>
              <hr />
              {/* for table */}
              <div className="my-8">
                <h2 className="font-medium pb-2">Order Details</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order?.products?.map((product) => (
                      <TableRow key={product._id._id}>
                        <TableCell>
                          <img
                            className="h-[50px]  object-contain aspect-square"
                            src={`${
                              import.meta.env.VITE_BACKEND_API
                            }/api/liquorhub/product/product-photo/${
                              product?._id._id
                            }`}
                            alt={product._id.name}
                          />
                        </TableCell>
                        <TableCell>{product._id.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product._id.price}</TableCell>
                        <TableCell>
                          {calcItemTotal(product.quantity, product._id.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="shadow rounded-lg p-3 w-full mr-3 mt-3 space-y-3">
              <div className="flex justify-between ">
                <span>Subtotal</span>
                <span>Rs.{calcTotalAmount()}</span>
              </div>
              <div className="flex justify-between ">
                <span>Shipping</span>
                <span>Rs.{shipping}</span>
              </div>
              <div className="flex justify-between ">
                <span>Discount</span>
                <span>Rs.0</span>
              </div>

              <hr />

              <div className="flex justify-between font-medium ">
                <span>Total</span>
                <span>Rs.{grandTotal}</span>
              </div>
            </div>
          </div>
        ) : (
          <h1 className="text-center">No order found !</h1>
        )}
      </SidebarLayout>
    </Layout>
  );
};

export default AdminOrderDetails;
