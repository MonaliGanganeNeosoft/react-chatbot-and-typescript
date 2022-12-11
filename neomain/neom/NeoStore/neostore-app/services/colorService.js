const colorSchema = require('../db/colorSchema');
exports.getColor=async()=>{
    try{
        const color=await colorSchema.find()
        return color
    }
    catch(e){
        throw Error('Error while get Color')
    }
}