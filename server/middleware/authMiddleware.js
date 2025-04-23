const JWT = require("jsonwebtoken");
const userModel = require("../model/userModel");

const requireSignin = async (req, res, next) =>{
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
        next();
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
        const user = await userModel.findById(req.user._id);
        if(user.role != 1){
               return res.status(401).send({
                message: "User is not authorized"
            })
        }else{
            next();
        }


        
    } catch (error) {
        res.status(500).send({
            message:"Error generated in admin check middleware",
            error
        })
        
    }
}

exports.requireSignin=requireSignin;
exports.isAdmin=isAdmin;