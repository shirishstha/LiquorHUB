//external module
const express = require('express');


//local modules
const { requireSignin, isAdmin } = require('../middleware/authMiddleware');
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
categoryRouter.post('/create-category', requireSignin, isAdmin, createCategoryController);

//update category
categoryRouter.put('/update-category/:cid', requireSignin, isAdmin, updateCategoryController);

//delete category
categoryRouter.delete('/delete-category/:cid', requireSignin, isAdmin, deleteCategoryController);

//get all categories
categoryRouter.get('/getall-category', getAllCategoryController);

//get a single category
categoryRouter.get('/get-category/:slug', getCategoryController);




module.exports = categoryRouter;