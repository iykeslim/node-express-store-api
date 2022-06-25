const Product = require('../models/product')



const getAllProductsStatic = async (req, res) => {
    // reference only
    const search = 'ab'
    const products = await Product.find({
        // 'i' implies case insensitive
        // name: {$regex: search, $options: 'i'}
    })
    .sort('name')
    .select('name price')
    .limit(10)
    .skip(5)
    //.sort('-name price')
    res.status(200).json({products})
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
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
    if(numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
            )
            // those ops can only be performed on numeric values so...
            const options = ['price', 'rating'] // the only numeric values in our API
            filters = filters.split(',').forEach((item) => {
                const [field, operator, value] = item.split('-')
                if(options.includes(field)){
                    queryObject[field] = {[operator]: Number(value)}
                }
            })
            }
     console.log(queryObject)
    let result = Product.find(queryObject)
    // sort
    if(sort){
        // in order to be able to chain the sorting
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createdAt')
    }

    if(fields){
        const fieldsList = fields.split(",").join(" ");
        result = result.select(fieldsList);
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit



    const products = await result
    res.status(200).json({products, nbHits: products.length})
}


module.exports = {
    getAllProductsStatic,
    getAllProducts
}   