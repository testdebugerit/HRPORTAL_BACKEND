import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import UserToken from "../models/UserToken.js";
import nodemailer from "nodemailer";

export const register = async (req, res, next) => {
  //return next(CreateError(500, "my error"));
  const role = await Role.find({ role: "User" });
  const salt = await bcrypt.genSalt(10);
  const hashPassowrd = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.userName,
    email: req.body.email,
    password: hashPassowrd,
    roles: role,
  });
  await newUser.save();
  return res.status(200).json(" USER registered");
  //return next(CreateSuccess(200, "my USER REGI"));
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate(
      "roles",
      "role"
    );
    const { roles } = user;
    if (!user) {
      return res.status(400).send("not found");
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).send("incorrect passowed");
    } //return res.status(200).send("login");

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, roles: roles },
      process.env.JWT_SECRET
    );

    res.cookie("acces_token", token, { httpOnly: true }).status(200).json({
      status: 200,
      message: "login suces",
      data: user,
    }); //return next(CreateSuccess(200, "my LOGIN SUC"));
  } catch (error) {
    return res.status(500).send("wrong");
  }
};

export const registerAdmin = async (req, res, next) => {
  //return next(CreateError(500, "my error"));
  const role = await Role.find({});
  const salt = await bcrypt.genSalt(10);
  const hashPassowrd = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.userName,
    email: req.body.email,
    password: hashPassowrd,
    isAdmin: true,
    roles: role,
  });
  await newUser.save();
  return res.status(200).send(" ADMIN registered");
  //return next(CreateSuccess(200, "my USER REGI"));
};

export const sendEmail = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: { $regex: "^" + email + "$", $options: "i" },
  });
  if (!user) {
    return next(CreateError(404, "user not found to reset the email"));
  }
  const payload = {
    email: user.email,
  };
  const expiryTime = 300;
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiryTime,
  });

  const newToken = new UserToken({
    userId: user._id,
    token: token,
  });

  const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anuy89019@gmail.com",
      pass: "qumr fnnv ioia ekeu",
    },
  });
  let mailDetails = {
    from: "anuy89019@gmail.com",
    to: email,
    subject: "Reset Password",
    html: `<html>
      <head>
        <title>Reset Password:Request</title>
      </head>
      <body>
      <h1>Passowrd reset</h1>
      <p>Dear ${user.username},</p>
      <p>we have recevied your password reset request to proceed click on button below</p>
      <a href=${process.env.LIVE_URL}/reset/${token}>
      <button style="background-color: #4CAF50; color:white;
      padding:14px 20px; border:none; cursor:pointer; border-radius:4px;">Reset</button>
      <p> do it in 5 min</p>
      <p > thank you</p>
      </body>
    </html>
 `,
  };
  mailTransporter.sendMail(mailDetails, async (err, data) => {
    if (err) {
      console.log(err);
      return next(CreateError(400, "something went wrong"));
    } else {
      await newToken.save();
      return next(CreateSuccess(200, "email sent successfully"));
    }
  });
};

export const resetPassword = (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) return next(CreateError(500, "reset link req"));
    else {
      const response = data;
      const user = await User.findOne({
        email: { $regex: "^" + response.email + "$", $options: "i" },
      });
      const salt = await bcrypt.genSalt(10);
      const encryptPassword = await bcrypt.hash(newPassword, salt);
      user.password = encryptPassword;
      try {
        const updatedUser = await User.findOneAndUpdate(
          {
            _id: user._id,
          },
          { $set: user },
          { new: true }
        );
        return next(CreateSuccess(200, "password reset successfull"));
      } catch (error) {
        return next(CreateError(500, "something went wrong"));
      }
    }
  });
};
