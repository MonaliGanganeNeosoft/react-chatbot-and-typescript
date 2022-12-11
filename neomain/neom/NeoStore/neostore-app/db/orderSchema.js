const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
    customer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userdata"
    },
    product_id:[],
    delivery_address:{
        type:Object,
        required:true
    },
    isDelivered:{
        type:Boolean,
        required:true
    },
    total_Productcost:{
        type:Number,
        required:true
    },
    order_date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Order',orderSchema);