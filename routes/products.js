const express = require('express')
const router = express.Router()


const {getAllProductsStatic, getAllProducts} = require('../controllers/products')

// ('/')<- this refers to the main route in app.js -> app.use('/api/v1/products')
router.route('/').get(getAllProducts)
router.route('/static').get(getAllProductsStatic);




module.exports = router
