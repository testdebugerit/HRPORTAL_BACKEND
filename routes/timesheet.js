import express from "express";
import {
  createTimsesheet,
  gettimsesheet,
} from "../controllers/timsesheet.controller.js";

const router = express.Router();

router.post("/createsheet", createTimsesheet);
router.get("/", gettimsesheet);
export default router;
