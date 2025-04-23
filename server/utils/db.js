const mongoose = require("mongoose");

const connectDB = async() =>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URL);
        console.log('Mongo db database connected',conn.connection.host);
        
    } catch (error) {
        console.log("Mongo connection failed",error);  
    }
    
}

module.exports=connectDB;