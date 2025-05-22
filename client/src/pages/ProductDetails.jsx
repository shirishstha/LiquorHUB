import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";
import axios from "axios";
import { ChevronDown, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [cart, setCart] = useCart();

  //get a product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/product/get-product/${params.slug}`
      );
      if (data.success) {
        setProduct(data.product);
      }
    } catch (error) {
      console.log(error);
      toast("Error fetching product details");
    }
  };
  useEffect(() => {
    getProduct();
  }, [params.slug]);

  useEffect(() => {
    if (product._id) {
      getSimilarProduct();
    }
  }, [product]);

  //get realted products
  const getSimilarProduct = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/product/related-product/${product?._id}/${
          product?.category?._id
        }`
      );
      if (data.success) {
        setSimilarProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title="LiquorHub-Product Detail">
      <div className="flex w-full  p-10 ">
        <div className="w-1/2 mt-10  p-1 flex justify-center ">
          {product?._id && (
            <img
              src={`${
                import.meta.env.VITE_BACKEND_API
              }/api/liquorhub/product/product-photo/${product?._id}`}
              alt={product?.name}
              className="h-90 object-contain rounded  "
            />
          )}
        </div>

        <div className="w-1/2 space-y-2 shadow-md dark:shadow-[#1c2128] p-3 rounded-lg ">
          <h3 className="bg-black dark:bg-[#161b22] w-40 text-white text-center rounded-xl">
            Premium collection
          </h3>
          <h1 className=" font-medium text-4xl  ">{product?.name}</h1>
          <h2 className="  text-xl text-gray-700 dark:text-gray-500">
            {product?.category?.name}
          </h2>
          <div className="min-h-48  border p-3 rounded-lg">
            {product?.description}
          </div>
          <div className="space-y-4 border p-2 rounded">
            <span className="p-4 text-xl text-gray-700 dark:text-gray-500">Price</span>
            <div className="flex justify-between mx-4 items-center">
              <span className="text-3xl font-medium">Rs. {product?.price}</span>
              <span>
                <Button
                  className="px-12 py-6 dark:bg-[#161b22] dark:text-white hover:dark:bg-[#1c2128]"
                  onClick={() => {
                    const existingItem = cart.find(
                      (item) => item._id === product._id
                    );

                    if (existingItem) {
                      toast.error("Item is already in the cart");
                      return;
                    }

                    const newCartItem = { ...product, quantity: 1 };
                    setCart([...cart, newCartItem]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, newCartItem])
                    );
                    toast.success("Item added to cart successfully");
                  }}
                >
                  <ShoppingCart /> Add to Cart
                </Button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="text-center ">
        <h1 className="text-3xl font-medium flex justify-center p-3">
          Similar Products{" "}
          <span className="flex items-center">
            <ChevronDown />
          </span>
        </h1>
        {similarProducts.length === 0 ? (
          <h1>No similar products found. </h1>
        ) : (
          <ProductCard products={similarProducts} />
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
