import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/search";
import { PackageX } from "lucide-react";
import React from "react";

const Search = () => {
  const [values, setValues] = useSearch();
  return (
    <Layout title="LiquorHub-Search Results">
      {values.results?.length !== 0 ? (
        <ProductCard products={values.results} />
      ) : (
        <h1 className="flex  flex-col w-full  items-center space-y-5 text-md mt-[15%]">
       
            <PackageX  className="size-20"/>
            <span >No products matched your keywords</span>
            <span className="font-medium text-xl">Try another</span>
          
        </h1>
      )}
    </Layout>
  );
};

export default Search;
