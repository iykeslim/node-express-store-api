const Product = require('../models/product')



const getAllProductsStatic = async (req, res) => {
    // reference only
    const search = 'ab'
    const products = await Product.find({
        // 'i' implies case insensitive
        name: {$regex: search, $options: 'i'}
    })
    res.status(200).json({products})
}

const getAllProducts = async (req, res) => {
    const {featured, company, name} = req.query
    const queryObject = {}

    if(featured){
        // in order to avoid error with queries without values in our api
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = { $regex: name, $options: "i" };
    }
    console.log(queryObject)
    const products = await Product.find(queryObject)
    res.status(200).json({products, nbHits: products.length})
}


module.exports = {
    getAllProductsStatic,
    getAllProducts
}   