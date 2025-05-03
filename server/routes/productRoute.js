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
const { isUser, isAdmin } = require('../middleware/authMiddleware');

const productRouter = express.Router();

//routes

//create product
productRouter.post('/create-product', isAdmin, formidable(), createProductController);

//update product
productRouter.put('/update-product/:pid', isAdmin, formidable(), updateProductController);

//delete product
productRouter.delete('/delete-product/:pid', isAdmin, deleteProductController);

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
productRouter.get('/user-orders', isUser, userOrdersProductsController);

//get all orders
productRouter.get('/all-orders', isAdmin, allOrdersProductsController);

//update order status
productRouter.put('/update-order/:oid', isAdmin, updateOrderStatusProductController);







module.exports = productRouter;