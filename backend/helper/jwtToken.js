const { cookieExpire } = require('../config/cookie.config');

// Create JWT token
const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    // options for cookie
    const options = {
        expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    const data = user;
    delete data.password;
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        data,
        token,
    });
};

module.exports = sendToken;
