const User = require('../model/userschema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const randomatic = require('randomatic')
const ForgetPassword = require('../model/forgetpwdschema')
const err = require('../util/error')

exports.register_user = async (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    try {
        const existinguser = await User.findOne({email : email})
        if(existinguser){
            err.newerror('User already exist', 409)
        }
        const hashpwd = await bcrypt.hash(password, 10)
        const createdUser = new User({
            name,
            email,
            password : hashpwd
        });
        
        await createdUser.save()
        res.status(201).json({
            message : "New user created",
            createdUser: createdUser
        })
    }
    catch(error){
        err.catchallerror(error, res)
    }
}

exports.login_user = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    try {
        const existinguser = await User.findOne({email : email})
        if(!existinguser) {
            err.newerror('Invalid login credentials', 422)
        }

        const isequal = await bcrypt.compare(password, existinguser.password)
        if(!isequal){
            err.newerror('Invalid login credentials', 422)
        }
            const token = await jwt.sign({id : existinguser._id, email : existinguser.email}, process.env['JWT_SECRETKEY'], {expiresIn: parseInt(process.env['TOKEN_LIFE'])})
            res.status(201).json({
                message : 'You are logged in',
                tokendata : {
                    token,
                    expireIn: new Date( new Date().getTime() + parseInt(process.env['TOKEN_LIFE'])* 1000).toUTCString()
                },
                user : existinguser
            })
        }
    catch(error){
        err.catchallerror(error, res)
    }
}

exports.forgetpassword = async (req, res, next) => {
    const email = req.body.email
    try {
        const existinguser = await User.findOne({email : email})
        if(!existinguser) {
            err.newerror('User does not exist', 404)
        }

        const randonNumber = randomatic('Aa0', 15)
        const forgetpassword = new ForgetPassword({
            email : existinguser.email,
            token : randonNumber
        })

        await forgetpassword.save()
        res.status(201).json({
            message: 'You can now use the token below to reset your password',
            email : forgetpassword.email,
            token : forgetpassword.token
        })
    }
    catch(error){
        err.catchallerror(error, res)
    }
}

exports.reset_password = async (req, res, next) => {
    const password = req.body.password
    const token = req.body.token
    try{
        const user = await ForgetPassword.findOne({token : token})
        if(!user){
            err.newerror('User does not exist', 404)
        }

        const existinguser = await User.findOne({email : user.email})
        const hashpwd = await bcrypt.hash(password , 10)
        await User.updateOne({_id : existinguser._id}, { $set : { name : existinguser.name, email : existinguser.email, password: hashpwd}})
        res.status(200).json({
            message : "Your password have been changed successfully"
        })
    }
    catch(error){
        err.catchallerror(error, res)
    }
}

exports.refresh_token = async (req, res, next) => {
    const tokenheader = req.get('Authorization')
    try {
        if(!tokenheader){
            err.newerror('Token is missing',400)
        }
        const token = tokenheader.split(' ')[1]
        const user = await jwt.verify(token , process.env['JWT_SECRETKEY'])
        const newtoken = await jwt.sign({id : user.id, email : user.email}, process.env['JWT_SECRETKEY'], {expiresIn : parseInt(process.env['TOKEN_LIFE'])})
        const existinguser = await User.findOne({email : user.email})
        res.status(201).json({
            message : "token refreshed successfully",
            tokendata : {
                token : newtoken,
                expiresIn : new Date ( new Date ().getTime() + parseInt(process.env['TOKEN_LIFE']) * 1000).toUTCString()
            },
            user : existinguser
        })
    }
    catch(error){
        err.catchallerror(error, res)
    }
}