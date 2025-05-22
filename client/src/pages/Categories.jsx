import Layout from "@/components/layout/Layout";
import useCategory from "@/hooks/useCategory";
import React from "react";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title="Liquorhub-All Categories">
      <div className="flex w-full justify-center mt-10 ">
        <div className="flex h-full space-x-8">
          {categories?.map((cat) => (
            <Link
              to={`/category/${cat.slug}`}
              key={cat._id}
              className=" flex items-center justify-center w-50 bg-black/1  dark:shadow-gray-900 shadow-md h-50 hover:shadow-xl"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
