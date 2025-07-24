const userModel = require("../models/userModel");
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const businessInfoModel = require("../models/businessInfoModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const FORNTEND_URL = process.env.DOMAIN;

// Register New Business
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      username: username,
      verifyToken: crypto.randomBytes(32).toString("hex"),
      verifyTokenExpiry: Date.now() + 3600000, // Token expires in 1 hour
    });

    // Create Token
    const token = jwt.sign(
      { email: result.email, _id: result._id },
      process.env.TOKEN_SECRET
    );

    // Send Verification Email
    sendVerificationEmail(email, result.verifyToken);

    res.status(201).json({
      message: "User created successfully, Check your email for verification",
      token: token,
      user: result,
    });
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
};

// Send Verification Email
const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  const verificationLink = `${FORNTEND_URL}/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Click the link below to verify your email:</p>
           <a href="${verificationLink}">${verificationLink}</a>
           <p>This link will expire in 1 hour.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await userModel.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerfied = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send Verification Email Again
const sendVerifyEmailAgain = async (req, res) => {
  const { email } = req.body;
  try {
    // Find User
    const User = await userModel.findOne({ email: email });

    if (!User) {
      return res.status(400).json({ message: "Your Email is Not Registered!" });
    }

    if (User.isVerfied) {
      return res.status(200).json({
        message: "Your email is already verified. You can login now.",
      });
    }

    const { verifyToken, verifyTokenExpiry } = User;
    if (verifyTokenExpiry > Date.now()) {
      sendVerificationEmail(email, verifyToken);
      return res.status(200).json({
        message: "Verification email sent successfully",
      });
    } else {
      // Generate verification token
      User.verifyToken = crypto.randomBytes(32).toString("hex");
      User.verifyTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
      await User.save();

      // Send verification email
      sendVerificationEmail(email, User.verifyToken);

      return res.status(200).json({
        message: "Verification email sent successfully.",
        user: User,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Business
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // if Userexist
    const User = await userModel.findOne({ email: email });
    if (!User) {
      return res.status(400).json({ message: "User Does not Exists!" });
    }

    // Check Password is Valid
    const validPassword = await bcryptjs.compare(password, User.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect Email or Password" });
    }

    // Generate Token
    const token = jwt.sign(
      { _id: User._id, email: User.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    // Find the BusinessInfo document for the authenticated user
    const businessInfo = await businessInfoModel.findOne({ user: User._id });
    if (!businessInfo) {
      return res.status(200).json({
        message: "Business Info not found for this user.",
        token: token,
      });
    }

    res.status(200).json({
      message: "User Loggedin successfully",
      token: token,
      businessID: businessInfo._id || null,
      user: User,
    });
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
};

// Get User Info
const getUserInfo = async (req, res) => {
  try {
    const userId = req.user._id; // Get logged-in user ID from middleware

    // Find User
    const User = await userModel.findOne({ _id: userId });

    if (!User) {
      return res.status(400).json({ message: "User Does not Exists!" });
    }

    const { email, username, isVerfied, createdAt, _id } = User;

    return res.status(200).json({
      user: {
        email,
        username,
        isVerfied,
        createdAt,
        _id,
      },
    });
  } catch (error) {
    res.json({ message: error.message, status: 500 });
  }
};

module.exports = {
  signup,
  login,
  verifyEmail,
  sendVerifyEmailAgain,
  getUserInfo,
};
