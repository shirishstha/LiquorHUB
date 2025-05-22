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
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

const CreateProduct = () => {
  const [categories, setcategories] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(null);
  const [photo, setPhoto] = useState();
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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
  }, []);

  //create product
  const handleCreateProduct = async () => {
    if (!name || !description || !category || !photo || !price || !quantity) {
      return toast.error("All fields are required");
    }
    if (photo?.size > 1000000) {
      return toast.error("Image size must be less than 1MB");
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("photo", photo);
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("category", category?._id);
      formData.append("shipping", shipping);

      const { data } = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/product/create-product`,
        formData
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/dashboard/admin/products");
      } else {
        toast.error("Something unexpected happened");
      }
    } catch (error) {
      if (error.response?.status === 402) {
        toast.error("Product is already in the list");
      } else {
        console.log(error);
        toast.error("Error creating product");
      }
    }
  };
  return (
    <div>
      <Layout title="Dashboard-Create Products">
        <SidebarLayout>
          <div className="w-[100%] flex flex-col items-center pb-5  ">
            <h1 className="text-2xl font-bold">Create Product</h1>
            <h3 className="text-gray-600 text-sm">Create your product here</h3>
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
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-48 text-gray-800 dark:text-white">
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
                              <CommandItem onSelect={() => {setCategory(cat);setOpen(false)}}>
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

                {photo ? (
                  <div className="flex justify-center my-5">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="image"
                      className=" h-[230px] object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-50 border my-9 w-full  justify-center items-center ">
                    <Plus className="  h-12 opacity-50  " />
                  </div>
                )}
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
                      <Label className="text-sm text-gray-800 dark:text-gray-100">Yes</Label>
                      <RadioGroupItem value={false} />
                      <Label className="text-sm  text-gray-800 dark:text-gray-100">No</Label>
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button onClick={handleCreateProduct} className="mt-5 dark:bg-[#161b22] dark:text-white hover:dark:bg-gray-800">Create Product</Button>
          </div>
        </SidebarLayout>
      </Layout>
    </div>
  );
};

export default CreateProduct;
