const categorySchema = require('../db/categorySchema')
exports.getCategory=async()=>{
    try{
        const category=await categorySchema.find()
        return category
    }
    catch(e){
        throw Error('Error while get Category')
    }
}