const express=require('express');
const mongoose=require('mongoose');
const connectDB = require('./config/db');
const cors=require('cors')
const PORT=8899;
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors())
//load routes
connectDB()
const userRoutes=require('./routes/userRoutes')
const productRoutes=require('./routes/productRoutes')
const categoryRoutes=require('./routes/categoryRoutes')
const colorRoutes=require('./routes/colorRoutes')
const orderRoutes=require('./routes/orderRoutes')
const socialRoutes=require('./routes/socialRoutes')
const cartRoutes=require('./routes/cartRoutes')
app.use("/api/user",userRoutes)
app.use("/api/product",productRoutes)
app.use("/api/category",categoryRoutes)
app.use("/api/color",colorRoutes)
app.use("/api/order",orderRoutes)
app.use("/api/social",socialRoutes)
app.use("/api/cart",cartRoutes)


app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Work on ${PORT}`);
})