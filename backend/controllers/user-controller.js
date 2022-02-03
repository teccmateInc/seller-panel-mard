// Import User Model
const User = require('../models/user-model');
const {
    handleError,
    handleErrorWithStatus,
    strictValidObjectWithKeys,
    generateValidationsErrors,
} = require('../helper/utils');
const sendToken = require('../helper/jwtToken');

// user login
exports.UserLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return handleErrorWithStatus(res, 200, 'User Name and password required!');
        }
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return handleErrorWithStatus(res, 200, 'Invalid username or password!');
        }
        const passwordMatched = await user.comparePassword(password);
        if (!passwordMatched) {
            return handleErrorWithStatus(res, 200, 'Invalid username or password!');
        } else sendToken(user, 200, res);
    } catch (err) {
        console.log(err);
        if (strictValidObjectWithKeys(generateValidationsErrors(err))) {
            handleError(
                res,
                'Invalid username and password!',
                generateValidationsErrors(err),
            );
        } else {
            handleErrorWithStatus(
                res,
                404,
                'Something wents wrong. Try again later!',
            );
        }
    }
};

//update pasword
exports.UpdatePassword = async (req, res) => {
    try {
        const { password } = req.body
        let updatedPassword = {};
        if (!password) {
            return handleErrorWithStatus(res, 200, 'Password required!');
        }
        if (password < 8) {
            return handleErrorWithStatus(res, 200, 'Invalid password!');
        }
        updatedPassword = {
            password: await bcrypt.hash(password, 10),
        };
        let user = await User.findOne({ username: req.username }).select('-password');
        if (!user) {
            return handleErrorWithStatus(res, 200, 'User Not found!');
        }
        const passwordMatched = await user.comparePassword(password);
        if (!passwordMatched) {
            user = await User.findByIdAndUpdate(
                req._id,
                updatedPassword,
                { new: true, runValidators: true, useFindAndModify: false });
            res.status(200).json({
                success: true,
                message: 'Password Changes Successfully!',
            });
        } else handleErrorWithStatus(res, 200, 'Password is matched from your current password!', {}, 'info');;
    } catch (err) {
        handleError(res, 'Something wents wrong. Try again later!');
    }
}

// logout User
exports.logoutUser = async (req, res, next) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: 'Logged Out Successfully!',
        });
    } catch (err) {
        handleError(res, 'Something wents wrong. Try again later!');
    }
};
