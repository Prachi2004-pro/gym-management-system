const express = require("express");
const userRouter = express.Router();
const mongoose = require('mongoose');
const { signup, login, verifyEmail, sendVerifyEmailAgain, getUserInfo } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

userRouter.post("/signup", signup );

userRouter.post("/login", login);

userRouter.get("/verify/:token", verifyEmail);

userRouter.post("/send-verification-Link", sendVerifyEmailAgain);

userRouter.get("/getUserData", authMiddleware, getUserInfo);

module.exports = userRouter;