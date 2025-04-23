import { useSearch } from "@/context/search";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SearchForm = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!values.keyword){
      return toast.error("Enter something to search",{position:"top-right"});
    }
    try{
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/liquorhub/product/search/${values.keyword}`);
      if(data){
        setValues({...values, results: data });
        navigate('/search');

      }

    }catch (error) {
        console.log(error);
    }
  }
  return (
    <form className="flex space-x-2" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Search products"
        value={values.keyword}
        onChange={(e) => setValues({...values, keyword: e.target.value})}
        className="w-xs"
      />
      <Button variant="outline" className="font-normal" type="submit">Search</Button>
    </form>
  );
};

export default SearchForm;
