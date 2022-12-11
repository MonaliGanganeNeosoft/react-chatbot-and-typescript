const userSchema = require("../db/userSchema")

exports.addUser=async(query)=>{
    try{
        let UserData=userSchema(query)
        const user=await UserData.save()
        return user
    }
    catch(e){
        throw Error('Error while Add user')
    }
}
exports.findquery=async(query)=>{
    try{
        const user=await userSchema.find(query)
        return user
    }
    catch(e){
        throw Error('Error while Login')
    }
}

exports.updatequery=async(query,value)=>{
    try{
        const update=await userSchema.updateMany(query,value)
        return update
    }
    catch(e){
        throw Error('Error while Forget Password')
    }
}

exports.editadress=async(query,value1,value2)=>{
    try{
        const update=await userSchema.updateMany(query,value1,value2)
        return update
    }
    catch(e){
        throw Error('Error while Forget Password')
    }
}