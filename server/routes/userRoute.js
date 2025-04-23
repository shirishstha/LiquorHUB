const express = require('express');
const { requireSignin, isAdmin } = require('../middleware/authMiddleware');
const { getUserListController } = require('../controller/userController');


const userRouter = express.Router();

// routes
userRouter.get('/list', requireSignin, isAdmin, getUserListController); 

module.exports = userRouter;