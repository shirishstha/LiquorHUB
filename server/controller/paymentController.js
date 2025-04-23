const orderModel = require("../model/orderModel");
const crypto = require("crypto");
const productModel = require("../model/productModel");
const mongoose = require('mongoose');

const SECRET_KEY = "8gBm/:&EnhH.1/q";


const generateSignature = (totalAmount, transactionUuid, productCode) => {
    const inputString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const hmac = crypto.createHmac("sha256", SECRET_KEY);
    hmac.update(inputString);
    return hmac.digest("base64");
};

// initiate payment request to esewa

const initiatePayment = async (req, res) => {
    try {
        const { totalAmount, products, userId } = req.body;
        if (!totalAmount) {
            return res.status(400).send({
                success: false,
                message: "Missing required fields  "
            })
        }
        //fetch all the products
        const productIDs = products.map((item) => new mongoose.Types.ObjectId(item._id));
        const dbProducts = await productModel.find({ _id: { $in: productIDs } }).select('_id price quantity');


        //validate the stock item
        let insufficientStock = false;
        const updatedProducts = products.map((cartItem) => {
            const product = dbProducts.find((p) => p._id.toString() === cartItem._id.toString());

            //  if cart quantity exeeds the stock
            if (cartItem.quantity > product?.quantity) {
                insufficientStock = true;
                return;
            }
            return {
                ...cartItem,
                price: product ? product.price : 0
            };
        });

        //handleing insufficient stock
        if (insufficientStock) {
            return res.status(400).send({
                success: false,
                message: "Some items in your cart have insufficent stock"
            })
        }

        //calculate total amount
        const shipping = 200;
        const calcAmt = updatedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0) + shipping;
        if (totalAmount !== Number(calcAmt)) {
            return res.status(400).send({
                success: false,
                message: "Something wrong with total amount"
            })
        }


        //creating new order
        const newOrder = await new orderModel({ products: updatedProducts, totalAmount: Number(calcAmt), user: userId }).save();

        //fulfilling esewa parameters
        const transactionUuid = newOrder?._id;
        const productCode = "EPAYTEST";
        const signature = generateSignature(totalAmount, transactionUuid, productCode);

        const paymentData = {
            amount: calcAmt.toString(),
            failure_url: `http://localhost:5173/dashboard/user/payment/failed/${transactionUuid}`,
            product_delivery_charge: "0",
            product_service_charge: "0",
            product_code: productCode,
            signature: signature,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: `http://localhost:8080/api/liquorhub/payment/verify/${transactionUuid}`,
            tax_amount: 0,
            total_amount: calcAmt,
            transaction_uuid: transactionUuid
        };
        res.status(200).send({
            success: true,
            message: "Order created successfully",
            paymentData
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error creating order or payment failed",
            error
        });
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { data } = req.query;
        const { oid } = req.params;

        if (!oid || !data) {
            return res.send({
                success: false,
                message: "Incomplete data"
            })
        }

        let decodedData, refId;
        try {
            decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8')); //decoding of encoded data
            refId = decodedData.transaction_code.toString();

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Error pasrsing json data"
            })
        }

        if (decodedData.status === "COMPLETE") {
            const order = await orderModel.findByIdAndUpdate(oid, { transactionId: refId, status: "success" });
            const productIDs = order?.products.map((item) => new mongoose.Types.ObjectId(item._id));
            const productDB = await productModel.find({ _id: { $in: productIDs } }).select("_id quantity");

            const updatePromises = order?.products.map(async (item) => {
                const match = productDB.find((product) => product._id.toString() === item._id.toString());
                if (match) {
                    const updatedQuantity = match.quantity - item.quantity;
                    return productModel.findByIdAndUpdate(item._id, { quantity: updatedQuantity });

                }
            });

            //wait for all quantity to finish updates ie. handle async operation
            await Promise.all(updatePromises);
            res.redirect(`http://localhost:5173/dashboard/user/payment/success/${oid}`);

        } else {
            console.log("Verification failed");
            res.redirect(`http://localhost:5173/dashboard/user/payment/failed/${oid}`);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Payment verification failed",
        });
    }
};




exports.initiatePayment = initiatePayment;
exports.verifyPayment = verifyPayment;