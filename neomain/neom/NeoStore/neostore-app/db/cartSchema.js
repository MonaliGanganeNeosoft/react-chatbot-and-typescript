const mongoose=require('mongoose');
const cartSchema=new mongoose.Schema({
    customer_id:{
        type:String,
        required:true
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        required:true
    },
    product_cost:{
        type:Number,
        required:true
    },
    total_Productcost:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model('Cart',cartSchema);