import HeroCarousel from "@/components/Carousel";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    name: "All category",
    _id: "1",
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  //get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/category/getall-category`
      );
      if (data.success) {
        setCategories(() => [
          ...data.category,
          { name: "All category", _id: "1" },
        ]);
      } else {
        toast.error("Something unexpected happened");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching categories");
    }
  };
  //get all products
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/product/getall-product?page=${page}&limit=4`
      );
      if (data.success) {
        setProducts((products) => [...products, ...data.products]);
        setHasMore(data.hasMore);  
        setLoading(false);
      } else {
        toast.error("Something unexpected happened");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error getting products");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [page]);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [products, selectedCategory]);

  //handle filter
  const handleFilter = () => {
    if (selectedCategory?._id === "1") {
      return setFilteredProducts(products);
    } else {
      const filter = products.filter(
        (product) => product.category?._id === selectedCategory?._id
      );
      setFilteredProducts(filter);
    }
  };

  return (
    <Layout title="LiquorHub-offers">
      
      {/* carosel section */}
      <div className=" flex justify-center ">
        <HeroCarousel />
      </div>

      <h1 className="text-center text-3xl font-bold mt-[20px]">Our Products</h1>
      <div className="flex flex-col  items-end px-5">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="flex w-[15%]">
            <Button variant="outline">{selectedCategory.name}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder="Select Category" />
              <CommandList>
                <CommandEmpty>No category found</CommandEmpty>
                {categories?.map((category) => (
                  <CommandItem
                    key={category._id}
                    onSelect={() => {
                      setSelectedCategory(category);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={`${
                        selectedCategory._id === category._id
                          ? "opacity-90"
                          : "opacity-0"
                      }`}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <ProductCard products={filteredProducts} />
      <InfiniteScroll
        dataLength={filteredProducts.length}
        next={() => {
          if (!loading) setPage((prevPage) => prevPage + 1);
        }}
        hasMore={hasMore}
        loader={loading && <Spinner />}
        endMessage={
          <p className="text-center mt-4">All products are fetched.</p>
        }
      />
    </Layout>
  );
};

export default Homepage;
