import mongoose, { Schema } from "mongoose";

const TimesheetSchema = mongoose.Schema({
  date: { type: Date, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  project: { type: String, required: true },
  task: { type: String, required: true },
  category: { type: String, required: true },
  user: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
});

export default mongoose.model("TimeSheet", TimesheetSchema);
