const mongoose=require('mongoose');
const colorSchema=new mongoose.Schema({
    color_name:{
        type:String,
        required:true,
        unique:true,
    },
    color_code:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Color',colorSchema);