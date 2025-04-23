import axios from 'axios';
import React, { useEffect, useState } from 'react'

const useCategory = () => {
    const [categories, setCategories] = useState([]);

    //get categorires
    const getCategories = async () =>{
        try {
            const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/liquorhub/category/getall-category`);
            if(data.success){
                setCategories(data.category);
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getCategories()
    },[])
    
    return categories
  
}

export default useCategory
