const express = require("express");
const Seat = require("../models/Seat");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { room } = req.query; // read ?room=1 or ?room=2
    let seats;

    if (room === "1") {
      seats = await Seat.find({
        seatNumber: { $gte: 1, $lte: 105 },
      }).sort({ seatNumber: 1 });
    } else if (room === "2") {
      seats = await Seat.find({
        seatNumber: { $gte: 106, $lte: 218 },
      }).sort({ seatNumber: 1 });
    } else {
      seats = await Seat.find().sort({ seatNumber: 1 });
    }
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

router.put("/empty/:seatId", async (req, res) => {
  try {
    const { seatId } = req.params;

    // Find and update the seat
    const updatedSeat = await Seat.findByIdAndUpdate(
      seatId,
      {
        studentName: "",
        email: "",
        phone: "",
        address: "",
        paymentStatus: "Not Available",
        feeSubmissionDate: null,
        description: "",
      },
      { new: true } // Returns the updated document
    );

    if (!updatedSeat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res
      .status(200)
      .json({ message: "Seat emptied successfully", seat: updatedSeat });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
