const express = require('express')
const router = express.Router()
const usercontroller = require('../controller/usercontroller')

router.post('/register', usercontroller.register_user)
router.post('/login', usercontroller.login_user)
router.post('/forgetpassword', usercontroller.forgetpassword)
router.post('/resetpassowrd', usercontroller.reset_password)
router.post('/refreshtoken', usercontroller.refresh_token)


module.exports = router;