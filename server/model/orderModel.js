const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    totalAmount: {
        type: Number,
        required: true
    },
    products: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        },
        quantity: {
            type: Number,
            default:0
        }
    }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    transactionId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "processing", "delivered","cancelled"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);