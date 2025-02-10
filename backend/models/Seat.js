const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true, unique: true },
  studentName: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending", "Not Available"],
    default: "Not Available",
  },
  feeSubmissionDate: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.setFullYear(now.getFullYear() + 10)); 
    },
  }, 
  description: { type: String, default: "" },
});

module.exports = mongoose.model("Seat", seatSchema);
