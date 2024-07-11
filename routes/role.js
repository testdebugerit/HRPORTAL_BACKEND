import express from "express";

import {
  createRole,
  deleteRole,
  getAllRole,
  updateRole,
} from "../controllers/role.controller.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();
//create a new role in db
router.post("/create", verifyAdmin, createRole);
//update
router.put("/update/:id", verifyAdmin, updateRole);
//get all roles
router.get("/getAll", getAllRole);

//delete role
router.delete("/deleteRole/:id", deleteRole);

export default router;
