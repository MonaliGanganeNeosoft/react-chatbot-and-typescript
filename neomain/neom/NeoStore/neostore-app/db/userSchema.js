const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        
    },
    mobileno:{
        type:Number
    },
    profilepic:{
        type:String
    },
    Address:[
        {Address_id:{type:Number},address:{type:String,unique:true},PinCode:{type:Number},City:{type:String},State:{type:String},Country:{type:String}}
    ],
    soical:{
        type:Boolean,
        required:true
    }
})
module.exports=mongoose.model("userdata",userSchema)