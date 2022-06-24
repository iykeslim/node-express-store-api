require('dotenv').config()
require('express-async-errors')


//Async errors imports

const express = require('express')
const app = express()

const connectDB = require('./db/connect')
// require router
const productsRouter = require('./routes/products')


const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')


// Middlewares
app.use(express.json())

// Routes

app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>')
})

// Product Routes
app.use('/api/v1/products', productsRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)


const port = process.env.PORT || 3000

const start = async () => {
    try {
        // connect db
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()