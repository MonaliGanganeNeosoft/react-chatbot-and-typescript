const  colorService  = require('../services/colorService')
const GET_COLOR=async(req,res)=>{
    try {
        const Color = await colorService.getColor()
        return res.status(200).json({ data: Color })
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
}
module.exports={GET_COLOR}