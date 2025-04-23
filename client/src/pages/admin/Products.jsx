import Layout from "@/components/layout/Layout";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/product/getall-product?limit=50`
      );
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
      toast("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (pid) => {
    try {
      const { data } = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/product/delete-product/${pid}`
      );
      if(data.success){
        toast.success("Product deleted successfully");
        fetchProducts();

      }else{
        toast.error("Something unexpected happened");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while editing product");
    }
  };

  return (
    <Layout title="Dashboard-Manage Products">
      <SidebarLayout>
 
        <div className=" flex flex-col p-2 w-full bg-white items-center">
          <h1 className="text-2xl font-bold ">Products</h1>
          <h3 className="text-gray-600 text-sm pb-5">Review your products here</h3>
          {/* here come search bar */}
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-background">
                  <TableHead>Product name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="flex space-x-3 ">
                      <span className="border rounded-2xl p-1.5">
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_API
                          }/api/liquorhub/product/product-photo/${product._id}`}
                          alt={product.name}
                          className="aspect-square h-[35px] object-cover rounded-sm"
                        />
                      </span>
                      <span className="flex items-center text-m">
                        {product.name}
                      </span>
                    </TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.category?.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell className="w-[20%]">
                      <div className="space-x-3 flex justify-center ">
                        <Link to={`/dashboard/admin/product/${product.slug}`}>
                          <Button variant="outline">Edit</Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete product and remove product
                                data from our server.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={()=>handleDelete(product._id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
      </SidebarLayout>
    </Layout>
  );
};

export default Products;
