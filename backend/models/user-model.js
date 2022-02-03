const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpires } = require('../config/jwt.config');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please Enter Your User Name'],
        maxLength: [11, 'User Name cannot exceed 11 characters'],
        minLength: [4, 'User Name should have more than 4 characters'],
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password'],
        minlength: 8,
        select: false,
        // validate: [validator.isStrongPassword, 'Please Enter a valid Password'],
    },
    role: {
        type: String,
        default: 'user',
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, jwtSecret, {
        expiresIn: jwtExpires,
    });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// return data without password
userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        let type = ret.role
        delete ret.password;
        delete ret.role;
        return { ...ret, type };
    },
});

module.exports = mongoose.model('User', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
};
