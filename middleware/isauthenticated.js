const jwt = require('jsonwebtoken')
const err = require('../util/error')

const isauth = async (req, res, next) => {
    const tokenheader = req.get('Authorization')
    try {
        if(!tokenheader){
            err.newerror('Token is  missing', 400)
        }
        const token = tokenheader.split(' ')[1]
        const user = await jwt.verify(token, process.env['JWT_SECRETKEY'])
        if(!user){
            err.newerror('You are not logged in', 401)
        }
        next()
    }
    catch(error){
        err.catchallerror(error, res)
    }
}

module.exports = isauth