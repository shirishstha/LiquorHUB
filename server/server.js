//external module
const express= require('express');
const dotenv= require('dotenv');
const cors = require('cors');

//local module
const  authrouter  = require('./routes/authRoute');
const connectDB = require('./utils/db');
const categoryRouter = require('./routes/categoryRoute');
const productRouter = require('./routes/productRoute');
const payRouter = require('./routes/paymentRoute');
const userRouter = require('./routes/userRoute');

//initialization of dotenv and app 
dotenv.config();
const app= express();

//database config
connectDB();

//middlewares
//for parsing json request & cors issue
app.use(cors());
app.use(express.json());

//routes
app.use("/api/liquorhub/auth", authrouter);
app.use("/api/liquorhub/category", categoryRouter);
app.use("/api/liquorhub/product", productRouter);
app.use("/api/liquorhub/payment", payRouter);
app.use("/api/liquorhub/user", userRouter);

//server listening 
PORT=process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Your app is running on http://localhost:${PORT}`);
})

