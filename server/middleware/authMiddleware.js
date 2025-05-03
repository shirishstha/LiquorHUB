const JWT = require("jsonwebtoken");
const userModel = require("../model/userModel");

const isUser = async (req, res, next) =>{
    try {
        const authHeader = req.headers?.authorization;
        if(!authHeader){
            return res.status(401).send({
                ok:false,
                message:"Authorization header missing"
            })
        }
        const token = authHeader.split(" ")[1];
        const decode = await JWT.verify(token , process.env.JWT_KEY);
        req.user = decode ;
        const user = await userModel.findById(req.user._id);
        if(user.role === 1){
            return res.status(401).send({
                ok:false,
                message:"Only users are allowed to access this route"
            }) 
        }else{
            next();
        }

    } catch (error) {
        console.log(error);
        if(error.name === "TokenExpiredError"){
            return res.status(401).send({
                ok:false,
                message:"Token expired"
            })
        }
        return res.status(401).send({
            ok:false,
            message:'Invalid token'
        })
    }
}

const isAdmin = async (req, res, next) =>{
    try {
        const authHeader = req.headers?.authorization;
        if(!authHeader){
            return res.status(401).send({
                ok:false,
                message:"Authorization header missing"
            })
        }
        const token = authHeader.split(" ")[1];
        const decode = await JWT.verify(token , process.env.JWT_KEY);
        req.user = decode ;
        const user = await userModel.findById(req.user._id);
        if(user.role === 1){
            next();     
        }else{
            return res.status(401).send({
                ok:false,
                message:"Only admins are allowed to access this route"
            }) 
            
        }

    } catch (error) {
        console.log(error);
        if(error.name === "TokenExpiredError"){
            return res.status(401).send({
                ok:false,
                message:"Token expired"
            })
        }
        return res.status(401).send({
            ok:false,
            message:'Invalid token'
        })
    }
}

exports.isUser=isUser;
exports.isAdmin=isAdmin;