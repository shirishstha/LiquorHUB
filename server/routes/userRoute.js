const express = require('express');
const { isAdmin } = require('../middleware/authMiddleware');
const { getUserListController } = require('../controller/userController');


const userRouter = express.Router();

// routes
userRouter.get('/list', isAdmin, getUserListController); 

module.exports = userRouter;