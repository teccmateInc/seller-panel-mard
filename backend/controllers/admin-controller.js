// Import User Model
const User = require('../models/user-model');
const {
    handleError,
    handleErrorWithStatus,
    strictValidArrayWithMinLength,
    generateValidationsErrors,
} = require('../helper/utils');

// Handle get Users actions
exports.GetUsers = async (_, res) => {
    try {
        const users = await User.find();
        if (strictValidArrayWithMinLength(users, 1)) {
            res.status(200).json({
                success: true,
                data: users,
            });
        } else {
            handleErrorWithStatus(res, 404, 'User not found!');
        }
    } catch (err) {
        handleError(res, 'Something wents wrong. Try again later!');
    }
};

// create new user
exports.CreateNewUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return handleErrorWithStatus(res, 200, 'User Name and password required!');
        }
        const user = await User.findOne({ username }).select('+password');
        if (user) {
            return handleErrorWithStatus(res, 200, 'Username is already exist!');
        } else {
            const user = await User.create({
                username, password,
            });
            user.save(async (err, user) => {
                if (err) handleError(res, err);
                else {
                    res.status(201).json({
                        success: true,
                        data: user,
                        message: 'User created succcessfully!',
                    });
                }
            })
        }
    } catch (err) {
        handleError(
            res,
            'User not created!',
            generateValidationsErrors(err));
    }
};
