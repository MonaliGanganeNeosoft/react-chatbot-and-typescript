
const orderSchema = require('../db/orderSchema')
exports.getOrder=async(query)=>{
    try{
        const order=await orderSchema.find(query)
        return order
    }
    catch(e){
        throw Error('Error while get order')
    }
}

exports.insertOrder=async(query)=>{
    try{
        let orderData=orderSchema(query)
        const order=await orderData.save()
        return order
    }
    catch(e){
        throw Error('email must be diffenet')
    }
}