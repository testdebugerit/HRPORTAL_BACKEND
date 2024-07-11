import Timesheet from "../models/Timesheet.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

export const createTimsesheet = async (req, res, next) => {
  try {
    //if (req.body.timesheet && req.body.timsesheet !== "") {
    const newTimesheet = new Timesheet(req.body);
    await newTimesheet.save();
    return next(CreateSuccess(200, "timsesheet created"));
    // } else {
    //   return res.status(400).send("bad request");
    // }
  } catch (error) {
    return res.status(500).send("server error");
  }
};
export const gettimsesheet = async (req, res, next) => {
  try {
    const timesheet = await Timesheet.find();
    // return {status:200,data:timesheet}
    return next(CreateSuccess(200, "all timsesheet entered", timesheet));
  } catch (error) {
    // return {status:500,message:error.message}
    return next(CreateError(500, "internal error"));
  }
};
