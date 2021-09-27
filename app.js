const express = require('express')
const app = express()
const mongoose = require('mongoose')

const userrouutes = require('./routes/userroutes')
const noteroutes = require('./routes/noteroutes')
require('dotenv').config({path: __dirname + '/.env'})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/user', userrouutes)
app.use('/note',noteroutes)

app.use((req, res, next) => {
    const error = new Error('Page not found')
    error.status_code = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status_code).json({
        message : error.message
    })
})

mongoose.connect('mongodb+srv://'+process.env['DATABASE_USERNAME']+':'+process.env['DATABASE_PWD']+'@shop.kqlba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority').then((_) => {
    console.log('database connected')
}).catch((error) => {
    console.log('database connection failed')
})

module.exports = app;