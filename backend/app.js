const express = require('express')
const body = require('body-parser')
const path = require('path')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const cookieParser = require('cookie-parser')
const { url } = require('./config/db.config')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || 5000
let server = require('http').createServer(app)

//connect to database
const connectDB = async () => {
    try {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully!');
        server.listen(port, () => console.log(`Listening on port ${port}`))
    } catch (err) {
        console.log('Server Not Responding ...', err)
    }
}

connectDB()

app.use(body.json())
app.use(body.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors()) // it enables all cors requests

//Sanitize The Data
app.use(mongoSanitize())

//Set Security headers
app.use(helmet())

//Prevent XSS attacks
app.use(xss())

//Routes
const apiRoutes = require('./api-routes')
app.use('/api', apiRoutes)

// Handle invalid OR 404 request
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Invalid Request!',
    });
});
