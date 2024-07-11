import express from "express";
import {
  login,
  register,
  registerAdmin,
  resetPassword,
  sendEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

//register
router.post("/register", register);

//login
router.post("/login", login);

//register as admin
router.post("/register-admin", registerAdmin);

//send reset email

router.post("/send-email", sendEmail);

//send reset email
router.post("reset-password", resetPassword);
export default router;
