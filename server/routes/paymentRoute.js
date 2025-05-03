const express = require('express');
const { initiatePayment, verifyPayment } = require('../controller/paymentController');
const { isUser } = require('../middleware/authMiddleware');

const payRouter = express.Router();

// routes
payRouter.post("/pay", isUser, initiatePayment);
payRouter.get("/verify/:oid", verifyPayment);


module.exports = payRouter;