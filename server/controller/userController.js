// local module
const userModel = require('../model/userModel');

const getUserListController = async (req, res) =>{
    try {
        const users = await userModel
        .aggregate([
            {
                $lookup:{
                    from:"orders",
                    localField: "_id",
                    foreignField : "user",
                    as: "orders"

                }
            },
            {
                $project: {
                    email: 1,
                    name: 1,
                    address: 1,
                    phone: 1,
                    role: 1,
                    orderCount: {$size: "$orders"}
                }

            }
        ]);
        
        if(users.length < 1){
            return res.status(200).send("No users found at the moment");
        } 
        res.status(200).send({
            success: true,
            message: 'User list fetch success',
            users
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: true,
            message: "Unable to get users list"
        })
    }
}



exports.getUserListController = getUserListController;
