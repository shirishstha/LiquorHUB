//external module
const express = require('express');

//local module
const {registerController,loginController, forgotPasswordController, updateProfileController}= require('../controller/authController');


//middlewares
const { isUser, isAdmin } = require('../middleware/authMiddleware');

const authrouter= express.Router();

authrouter.post('/register', registerController);
authrouter.post('/login', loginController);
authrouter.post('/forgot-password',forgotPasswordController);
authrouter.put('/update-profile/:uid', isUser, updateProfileController );


//private routes
authrouter.get('/user-auth', isUser, (req,res)=>{
    res.status(200).send({
        ok:true
    })

})

//admin routes 
authrouter.get('/admin-auth', isAdmin, (req, res) =>{
    res.status(200).send({
        ok:true
    })
});


module.exports =authrouter;