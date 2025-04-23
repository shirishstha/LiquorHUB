import Layout from "@/components/layout/Layout";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const CreateCategory = () => {
  const [categories, setcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const buttonRef = useRef(null);

  //get all category
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

  //create category
  const handleCreateCategory = async () => {
    try {
      const { data } = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/category/create-category`,
        { name }
      );
      if (data.success) {
        toast.success("Category created successfully");
        getAllCategory();
      } else {
        toast.error("Something unexpected happen creating category");
      }
    } catch (error) {
      if (error.response?.status == 400) {
        toast.error("Category already existed");
      } else {
        console.log(error);
        toast.error("Error creating category");
      }
    }
  };

  //handle edit category
  const handleEditCategory = async () => {
    if (!updatedName) {
      return toast.error("Enter the name");
    }
    try {
      const { data } = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/category/update-category/${selectedCategory._id}`,
        { name: updatedName }
      );

      if (data.success) {
        toast.success("Category updated successfully");
        getAllCategory();

        //used to close the dialoge
        buttonRef.current.click();
      }
    } catch (error) {
      if (error.response?.status == 400) {
        toast.error("Category cannot be found");
      } else {
        console.log(error);
        toast.error("Error editing category");
      }
    }
  };

  //handle delete category
  const handleDeleteCategory = async (cid) => {
    try {
      const { data } = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_API
        }/api/liquorhub/category/delete-category/${cid}`
      );

      if (data.success) {
        toast.success(data.message);
        getAllCategory();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occured deleting category");
    }
  };
  return (
    <div>
      <Layout title="Dashboard-Create Category">
        <SidebarLayout>
          <div className="w-full flex flex-col items-center pt-2">
            <h1 className="text-black text-2xl font-bold ">Category</h1>
            <h3 className="text-gray-500 text-sm pb-2">
              Manage all your categories
            </h3>
            <div className="w-[80%] p-4 ">
              <div className="flex justify-center space-x-4  pb-3">
                <Input
                  placeholder="Category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-[60%]"
                />
                <Button onClick={handleCreateCategory}>Add</Button>
              </div>
              <Table>
                <TableCaption>All your categories</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className=" pl-5">Category</TableHead>
                    <TableHead className="flex justify-center items-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories &&
                    categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell className="w-[80%]">
                          {category.name}
                        </TableCell>
                        <TableCell className="space-x-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setUpdatedName(category.name);
                                }}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit category</DialogTitle>
                                <DialogDescription>
                                  You can edit the name of the category here.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex space-x-3 py-3">
                                <Label>Name</Label>
                                <Input
                                  placeholder="Category name"
                                  value={updatedName}
                                  onChange={(e) =>
                                    setUpdatedName(e.target.value)
                                  }
                                />
                              </div>

                              <div className="flex justify-between">
                                <DialogClose asChild>
                                  <Button
                                    className="w-[40%]"
                                    variant="secondary"
                                    ref={buttonRef}
                                  >
                                    Close
                                  </Button>
                                </DialogClose>
                                <Button
                                  onClick={() => {
                                    handleEditCategory();
                                  }}
                                  className="w-[40%]"
                                >
                                  Update
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="secondary"
                            size="sm"
                            className="hover:bg-white"
                            onClick={() => handleDeleteCategory(category?._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SidebarLayout>
      </Layout>
    </div>
  );
};

export default CreateCategory;
