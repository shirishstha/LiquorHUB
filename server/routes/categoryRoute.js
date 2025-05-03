//external module
const express = require('express');


//local modules
const { isAdmin } = require('../middleware/authMiddleware');
const {
    createCategoryController,
    getAllCategoryController,
    getCategoryController,
    updateCategoryController,
    deleteCategoryController
} = require('../controller/categoryController');


const categoryRouter = express.Router();

//routes

//create category
categoryRouter.post('/create-category', isAdmin, createCategoryController);

//update category
categoryRouter.put('/update-category/:cid', isAdmin, updateCategoryController);

//delete category
categoryRouter.delete('/delete-category/:cid', isAdmin, deleteCategoryController);

//get all categories
categoryRouter.get('/getall-category', getAllCategoryController);

//get a single category
categoryRouter.get('/get-category/:slug', getCategoryController);




module.exports = categoryRouter;