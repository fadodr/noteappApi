exports.catchallerror = (error, res) => {
    if(!error.status_code) {
        error.status_code = 500
    }
    res.status(error.status_code).json({
        error : error.message
    })
}

exports.newerror = (message, code) => {
    const error = new Error(message)
    error.status_code = code
    throw error
}