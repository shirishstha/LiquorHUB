// external module
const express = require('express');
const formidable = require('express-formidable');

const {
    createProductController,
    updateProductController,
    deleteProductController,
    getAllProductController,
    getProductController,
    getImageProductController,
    searchProductController,
    relatedProductController,
    categoryProductsController,
    orderProductsController,
    userOrdersProductsController,
    allOrdersProductsController,
    updateOrderStatusProductController,
} = require('../controller/productController');
const { requireSignin, isAdmin } = require('../middleware/authMiddleware');

const productRouter = express.Router();

//routes

//create product
productRouter.post('/create-product', requireSignin, isAdmin, formidable(), createProductController);

//update product
productRouter.put('/update-product/:pid', requireSignin, isAdmin, formidable(), updateProductController);

//delete product
productRouter.delete('/delete-product/:pid', requireSignin, isAdmin, deleteProductController);

//get all products
productRouter.get('/getall-product', getAllProductController);

//get a product
productRouter.get('/get-product/:slug', getProductController);

//get product's image
productRouter.get('/product-photo/:pid', getImageProductController);

//search product
productRouter.get('/search/:keyword',searchProductController);

//similar product 
productRouter.get('/related-product/:pid/:cid', relatedProductController);

//get category wise product
productRouter.get('/category-product/:slug',categoryProductsController);

//get single order
productRouter.get('/order/:oid',orderProductsController);

//get user's orders
productRouter.get('/user-orders', requireSignin, userOrdersProductsController);

//get all orders
productRouter.get('/all-orders', requireSignin, isAdmin, allOrdersProductsController);

//update order status
productRouter.put('/update-order/:oid', requireSignin, isAdmin, updateOrderStatusProductController);







module.exports = productRouter;