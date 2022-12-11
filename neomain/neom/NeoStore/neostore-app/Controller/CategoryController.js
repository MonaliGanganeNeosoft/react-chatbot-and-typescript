const CategoryService = require('../services/categoryService')
const GET_CATEGORY = async (req, res) => {
    try {
        const Category = await CategoryService.getCategory()
        return res.status(200).json({ data: Category })
    }
    catch (e) {
        return res.status(400).json({ msg: e.message })
    }
}
module.exports = { GET_CATEGORY }