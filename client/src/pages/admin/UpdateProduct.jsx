import Layout from "@/components/layout/Layout";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UpdateProduct = () => {
  const [categories, setcategories] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(null);
  const [photo, setPhoto] = useState();
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [id, setId] = useState();
  const [shipping, setShipping] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  //get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/category/getall-category`
      );
      if (data.success) {
        setcategories(data.category);
      } else {
        toast("Unexpected happen getting category");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong getting all category");
    }
  };

  useEffect(() => {
    getAllCategory();
    getProduct();
  }, []);

  //single product details
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/product/get-product/${params.slug}`
      );
      console.log(data);
      if(data.success){
        setName(data.product.name);
        setPrice(data.product.price);
        setQuantity(data.product.quantity);
        setCategory(data.product.category);
        setDescription(data.product.description);
        setShipping(data.product.shipping);
        setId(data.product._id);

      }else{
        toast.error("Unexpected happen")
      }
    } catch (error) {
      console.log(error);
      toast.error("Error getting a product");
    }
  };

  //update product
  const handleUpdateProduct = async () => {
    if (!name || !description || !category || !price || !quantity) {
      return toast.error("All fields are required");
    }
    if (photo?.size > 1000000) {
      return toast.error("Image size must be less than 1MB");
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      {photo && formData.append("photo", photo)}
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("category", category?._id);
      formData.append("shipping", shipping);

      const { data } = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/product/update-product/${id}`,
        formData
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/dashboard/admin/products");
      } else {
        toast.error("Something unexpected happened");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating product");
    }
  };
  return (
    <div>
      <Layout title="Dashboard-Update Products">
        <SidebarLayout>
          <div className="w-[100%] flex flex-col items-center pb-5  ">
            <h1 className="text-2xl font-bold">Update Product</h1>
            <h3 className="text-gray-600 text-sm">Edit your product here</h3>
            <Tabs defaultValue="general" className="w-[60%]  mt-5 ">
              <TabsList className="w-full">
                <TabsTrigger value="general">General Info</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
              </TabsList>
              <TabsContent
                value="general"
                className=" shadow-md rounded-lg p-6"
              >
                <Label className="text-md">Information</Label>
                <h3 className="text-gray-500 text-sm ">
                  Add product's genereal information here
                </h3>
                <div className="space-y-5 mt-5">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Enter product's name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      placeholder="Enter price here"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      placeholder="Enter quantity here"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  {/* for selecting category */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-48 text-gray-800">
                        {category?.name || "Choose category"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent>
                      <Command>
                        <CommandInput></CommandInput>
                        <CommandList>
                          <CommandEmpty>No category found</CommandEmpty>
                          {categories.map((cat) => (
                            <CommandGroup key={cat._id}>
                              <CommandItem onSelect={() => setCategory(cat)}>
                                {cat.name}
                              </CommandItem>
                            </CommandGroup>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </TabsContent>
              <TabsContent value="image" className="shadow-md rounded-lg p-5 ">
                <Label className="text-md">Image section</Label>
                <h3 className="text-gray-500 text-sm ">
                  Add product's image here
                </h3>
                {/* for displaying selected image */}

                  <div className="flex justify-center my-5">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_API}/api/liquorhub/product/product-photo/${id}`}
                      alt="image"
                      className=" h-[230px] object-cover"
                    />
                  </div>
            
                <Input
                  type="file"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </TabsContent>

              <TabsContent
                value="description"
                className="shadow-md rounded-lg p-5"
              >
                <Label className="text-md">Description</Label>

                <h3 className="text-gray-500 text-sm ">
                  Add product's description here
                </h3>
                <div className="py-5 space-y-5">
                  {/* for other details */}

                  <Textarea
                    placeholder="Describe about product"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-52"
                  />
                  <div className="flex space-x-5 ">
                    <Label>Shipping</Label>
                    <RadioGroup
                      className="flex"
                      value={shipping}
                      onValueChange={(value) => setShipping(value)}
                    >
                      <RadioGroupItem value={true} />
                      <Label className="text-sm text-gray-800">Yes</Label>
                      <RadioGroupItem value={false} />
                      <Label className="text-sm  text-gray-800">No</Label>
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button onClick={handleUpdateProduct} className="mt-5">Update Product</Button>
          </div>
        </SidebarLayout>
      </Layout>
    </div>
  );
};

export default UpdateProduct;
