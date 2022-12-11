const productModel = require('../db/productSchema')
const productService = require('../services/productService')
const GET_PRODUCT = async (req, res) => {
    try {
        const Product = await productService.getProduct()
        return res.status(200).json({ data: Product })
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
}
const FILTER_PRODUCT = async (req, res) => {
    try {
        const Product = await productService.getProduct()
        if (req.body.category_name != '' && req.body.color_name == '') {
            let filterData = Product.filter(pro => pro.category_id.category_name == req.body.category_name);
            return res.status(200).json({ data: filterData })
        }
        else if (req.body.category_name == '' && req.body.color_name != '') {
            let filterData = Product.filter(pro => pro.color_id.color_name == req.body.color_name);
            return res.status(200).json({ data: filterData })
        }
        else {
            let filterData = Product.filter(pro => pro.color_id.color_name == req.body.color_name && pro.category_id.category_name == req.body.category_name);
            return res.status(200).json({ data: filterData })
        }
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await productModel.find({})
    //     .populate(["category_id","color_id"])
    //     .then(product=>{
    //     if(req.body.category_name!='' &&req.body.color_name==''){
    //         let filterData=product.filter(pro => pro.category_id.category_name==req.body.category_name);
    //         console.log(filterData);
    //        DATA=filterData
    //         res.status(200).json({data:filterData})
    //     }
    //     else if(req.body.category_name=='' &&req.body.color_name!=''){
    //         let filterData=product.filter(pro => pro.color_id.color_name==req.body.color_name);
    //         console.log(filterData);
    //         DATA=filterData
    //         res.status(200).json({data:filterData})
    //     }
    //     else{
    //         let filterData=product.filter(pro => pro.color_id.color_name==req.body.color_name && pro.category_id.category_name==req.body.category_name);
    //         DATA=filterData
    //         console.log(filterData);
    //         res.status(200).json({data:filterData})
    //     }
    //     })
}
const GET_POPULAR_PRODUCT = async (req, res) => {
    try {
        const Product = await productService.getProduct()
        let filterData = Product.filter(pro => pro.product_rating >= 4)
        return res.status(200).json({ data: filterData })
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await productModel.find({})
    //     .populate(["category_id", "color_id"])
    //     .then(product => {
    //         let filterData = product.filter(pro => pro.product_rating >= 4)
    //         res.status(200).json({ data: filterData })
    //     })
}
const SET_RATING = async (req, res) => {
    try {
        console.log('inside set rating');
        console.log(req.body.product_id);
        console.log(req.body.product_rating);
        const Product = await productService.setrating(req.body.product_id, req.body.product_rating)
        return res.status(200).json({ err: 0, msg: 'Rating change sucessfully' })
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
    // await productModel.updateOne({ _id: req.body.product_id }, { $set: { product_rating: req.body.product_rating } }, (err) => {
    //     if (err) {
    //         res.status(400).json({ err: 1, msg: 'Unable to change rating' })
    //     }
    //     else {
    //         res.status(200).json({ err: 0, msg: 'Rating change sucessfully' })
    //     }
    // })
}
module.exports = { GET_PRODUCT, FILTER_PRODUCT, GET_POPULAR_PRODUCT, SET_RATING }