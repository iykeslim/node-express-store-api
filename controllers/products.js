const Product = require('../models/product')



const getAllProductsStatic = async (req, res) => {
    // reference only
    const search = 'ab'
    const products = await Product.find({
        // 'i' implies case insensitive
        // name: {$regex: search, $options: 'i'}
    }).sort('-name price')
    res.status(200).json({products})
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort} = req.query
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
    // console.log(queryObject)
    let result = Product.find(queryObject)
    if(sort){
        // in order to be able to chain the sorting
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createdAt')
    }
    const products = await result
    res.status(200).json({products, nbHits: products.length})
}


module.exports = {
    getAllProductsStatic,
    getAllProducts
}   