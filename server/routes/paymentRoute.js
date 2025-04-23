const express = require('express');
const { initiatePayment, verifyPayment } = require('../controller/paymentController');
const { requireSignin } = require('../middleware/authMiddleware');

const payRouter = express.Router();

// routes
payRouter.post("/pay", requireSignin, initiatePayment);
payRouter.get("/verify/:oid", verifyPayment);


module.exports = payRouter;