const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const { jwtSecret } = require('../config/jwt.config');
const { handleErrorWithStatus } = require('../helper/utils');

// Check whether the user is logged in OR Not
exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;
    console.log(token)
    if (!token) {
        res.status(403).json({
            success: false,
            message: 'You are not logged in!',
        });
    } else {
        const decodedData = jwt.verify(token, jwtSecret);
        req.user = await User.findById(decodedData.id);
        next();
    }
};

// Check who has the access for making requests
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            handleErrorWithStatus(res, 401, `User not exist!`);
        } else if (!roles.includes(req.user.role)) {
            handleErrorWithStatus(res, 403, `Access Denied!`);
        } else next();
    };
};
