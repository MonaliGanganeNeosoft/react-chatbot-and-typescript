const productSchema = require('../db/productSchema')
exports.getProduct = async () => {
    try {
        const product = await productSchema.find().populate(["category_id", "color_id"])
        return product
    }
    catch (e) {
        throw Error('Error while get product')
    }
}
exports.setrating = async (product_id, product_rating) => {
    try {
        const product = await productSchema.updateOne({ _id: product_id }, { $set: { product_rating: product_rating } })
        return product
    }
    catch (e) {
        console.log(product_id);
        throw Error('Unable to change rating')
    }
}
