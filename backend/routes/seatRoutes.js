const express = require("express");
const Seat = require("../models/Seat");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const seats = await Seat.find().sort({ seatNumber: 1 });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/seats/:seatNumber", async (req, res) => {
  try {
    const seatNumber = parseInt(req.params.seatNumber);
    const seat = await Seat.findOne({ seatNumber });

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.json(seat);
  } catch (error) {
    console.error("Error fetching seat:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/seats/:seatNumber", async (req, res) => {
  try {
    const seatNumber = parseInt(req.params.seatNumber);
    const updatedData = req.body;

    // Find and update the seat
    const seat = await Seat.findOneAndUpdate(
      { seatNumber },
      { $set: updatedData },
      { new: true, runValidators: true } // Return updated seat & validate data
    );

    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.json({ message: "Seat updated successfully", seat });
  } catch (error) {
    console.error("Error updating seat:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/check-fees", async (req, res) => {
  try {
    const today = new Date();

    const seats = await Seat.find({ feeSubmissionDate: { $ne: null } });

    let updatedStudents = [];

    for (let seat of seats) {
      const feeDate = new Date(seat.feeSubmissionDate);
      const timeDifference = today - feeDate;
      const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

      if (daysDifference > 30 && seat.paymentStatus !== "Pending") {
        seat.paymentStatus = "Pending";
        await seat.save();
        updatedStudents.push(seat.studentName);
      }
    }

    res.json({ message: "Payment status updated", students: updatedStudents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
