import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const CategoryProducts = () => {
  const [categoryProducts, setCategoryProducts] = useState([]);

  const params = useParams();
  const getCategoryProducts = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/product/category-product/${params.slug}`
      );
      if (data.success) {
        setCategoryProducts(data.categoryProducts);
      } else {
        toast.error("Something unexpected happened");
      }
    } catch (error) {
      console.log(error);
      toast("Error getting category product");
    }
  };

  useEffect(() => {
    getCategoryProducts();
  }, [params]);
  return (
    <Layout title={`Category-${params.slug}`}>
      {categoryProducts && <ProductCard products={categoryProducts} />}
    </Layout>
  );
};

export default CategoryProducts;
