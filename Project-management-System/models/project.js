const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Active", "Completed", "On Hold"],
    default: "Active",
  },
});

module.exports = mongoose.model("Project", projectSchema);
