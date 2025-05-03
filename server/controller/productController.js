//core module
const fs = require('fs');

// external module
const slugify = require("slugify");

//local module
const productModel = require('../model/productModel');
const categoryModel = require('../model/categoryModel');
const orderModel = require('../model/orderModel');
const isValidUpdates = require('../helpers/updateOrderHelper');



//create product
const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.fields;
        const { photo } = req.files;

        //data validation
        if (!name) return res.status(400).send({ message: 'Name is required' });
        if (!description) return res.status(400).send({ message: 'Description is required' });
        if (!price) return res.status(400).send({ message: 'Price is required' });
        if (!quantity) return res.status(400).send({ message: 'Quantity is required' });
        if (!category) return res.status(400).send({ message: 'Category is required' });
        if (photo && photo.size > 1048576) return res.status(400).send({ message: 'Image should be of less than 1MB' });

        const existing = await productModel.findOne({ slug: slugify(name) });
        if (existing) {
            return res.status(402).send({
                success: false,
                message: "The product already existed"
            });
        }

        const product = await new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(201).send({
            success: true,
            message: 'Product created successfully',
            product
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while creating product'
        })
    }
}

//update product 
const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.fields;
        const { photo } = req.files;

        //data validation
        if (!name) return res.status(400).send({ message: 'Name is required' });
        if (!description) return res.status(400).send({ message: 'Description is required' });
        if (!price) return res.status(400).send({ message: 'Price is required' });
        if (!quantity) return res.status(400).send({ message: 'Quantity is required' });
        if (!category) return res.status(400).send({ message: 'Category is required' });
        if (photo && photo.size > 1048576) return res.status(400).send({ message: 'Image should be of less than 1MB' });

        const product = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true })

        if (!product) {
            return res.status(404).send({ message: 'Product doesnot exists' });
        }
        if (photo) {
            try {
                product.photo.data = fs.readFileSync(photo.path);
                product.photo.contentType = photo.type;

            } catch (error) {
                return res.status(500).send({ message: 'Error reading image file' });
            }
        }

        await product.save();
        res.status(200).send({
            success: true,
            message: 'Product updated successfully',
            product
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while updating product',
            error
        })
    }
}

//delete product 
const deleteProductController = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productModel.findByIdAndDelete(pid).select('-photo');
        if (!product) {
            res.status(404).send({ message: 'Couldnot find the product' });
        }
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error occured deleting a product',
            error
        })
    }
}

//get all products
const getAllProductController = async (req, res) => {
    try {

        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 3;
        const skip = (page - 1) * limit;

        const products = await productModel
            .find({})
            .populate('category')
            .select('-photo')
            .skip(skip)
            .limit(limit)


        const totalProducts = await productModel.countDocuments();
        const hasMore = skip + products.length < totalProducts;

        res.status(200).send({
            success: true,
            hasMore: hasMore,
            message: 'Product list fetch success',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error occcured while getting all products ',
            error
        })

    }
}

//get a product 
const getProductController = async (req, res) => {
    try {
        const { slug } = await req.params;
        const product = await productModel.findOne({ slug }).select('-photo').populate('category');
        res.status(200).send({
            success: true,
            message: 'Product fetch successful',
            product
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Product fetch failed',
            error
        })
    }

}

//get image of a product
const getImageProductController = async (req, res) => {
    try {
        const { pid } = req.params;
        //validate null and undefined or invalid id
        if (!pid || !pid.match(/^[0-9a-fA-F]{24}$/)) {
            console.log("Invalid PID:", pid);
            return res.status(400).json({ message: "Invalid product ID format" });
        }
        const product = await productModel.findById(pid).select('photo');
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.send(product.photo.data);
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error fetching image of product' });
    }
}

//search product
const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await productModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ]

            })
            .select('-photo')
            .populate('category');
        res.json(result);

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error searching product",
            error
        })
    }
}

//related product controller
const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        if (!pid || !cid) {
            console.log("No pid found");
            return
        }
        const products = await productModel
            .find({
                category: cid,
                _id: { $ne: pid }
            })
            .select('-photo')
            .limit(3)
            .populate("category");

        res.status(200).send({
            success: true,
            message: "Related product fetch success",
            products
        });

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'Error fetching similar products '
        })
    }
}


//get category wise products
const categoryProductsController = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne({ slug }).select('_id');
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "No category found"
            })
        }
        const categoryProducts = await productModel.find({ category: category._id }).populate("category").select("-photo").limit(10);
        if (categoryProducts) {
            res.status(200).send({
                success: true,
                message: "Category wise products fetch success",
                categoryProducts
            })
        } else {
            console.log("error");
            res.status(500).send({
                message: "Something went wrong",
                success: false
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching category products"
        })
    }
}

// get single product order controller
const orderProductsController = async (req, res) => {
    try {
        const { oid } = req.params;
        const order = await orderModel
            .findOne({ _id: oid })
            .populate("user", "name email address")
            .populate({
                path: "products._id",
                select: "-photo",
                populate: {
                    path: "category",
                    select:"name _id"
                }
            });

        if (!order) {
            return res.status(404).send({
                success: false,
                message: "No order found"
            })
        }

        res.status(200).send({
            success: true,
            message: " Order fetch success",
            order
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting order"
        })
    }
}

//get user's orders controller
const userOrdersProductsController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ user: req.user?._id })
            .populate("user", "name email address")
            .populate({
                path: "products._id",
                select: "-photo",
                populate: {
                    path: "category",
                    select:"name _id"
                }
            });

        if (orders.length === 0) {
            return res.status(200).send({
                success: false,
                message: "No order found for this user"
            })
        }

        res.status(200).send({
            success: true,
            message: " All order fetch success",
            orders
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting order"
        })
    }
}

//get all orders controller
const allOrdersProductsController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("user", "name email address")
            .populate("products._id", "-photo")
            .populate({
                path:"products._id",
                select:"-photo",
                populate:{
                   path:"category" ,
                   select:"name _id"
                }
            })

        if (orders.length === 0) {
            return res.status(200).send({
                success: false,
                message: "No orders found"
            })
        }

        res.status(200).send({
            success: true,
            message: " All order fetch success",
            orders
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting order"
        })
    }
}

// update order status
const updateOrderStatusProductController = async (req, res) => {
    try {
        const { oid } = req.params;
        const {newStatus} = req.body;
        const order = await orderModel.findById(oid);
        if (!order) return res.status(404).send({ message: 'Order not found', success:false });

        const currentStatus = order.status;

        if(!isValidUpdates(currentStatus, newStatus)){
            return res.status(400).send({
                success: false,
                message:`Invalid status update from ${currentStatus} to ${newStatus}`
            });
        }

        order.status = newStatus;
        await order.save();

        res.status(200).send({
            success: true,
            message: "Order status updated successfully",
            order
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating order status"
        })
    }

}



exports.createProductController = createProductController;
exports.updateProductController = updateProductController;
exports.deleteProductController = deleteProductController;
exports.getAllProductController = getAllProductController;
exports.getProductController = getProductController;
exports.getImageProductController = getImageProductController;
exports.searchProductController = searchProductController;
exports.relatedProductController = relatedProductController;
exports.categoryProductsController = categoryProductsController;

exports.orderProductsController = orderProductsController;
exports.userOrdersProductsController = userOrdersProductsController;
exports.allOrdersProductsController = allOrdersProductsController;
exports.updateOrderStatusProductController = updateOrderStatusProductController;
