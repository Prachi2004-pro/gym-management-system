const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please Provide a Username'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please Provide a email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please Provide a Password']
    },
    isVerfied: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
}, {timestamps: true})

module.exports = mongoose.model('User', UserSchema)