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

router.get("/:id", async (req, res) => {
  const seat = await Seat.findById(req.params.id);
  if (!seat) return res.status(404).json({ message: "Seat not found" });
  res.json(seat);
});

router.get("/seats/:seatNumber", async (req, res) => {
  try {
    const seatNumber = parseInt(req.params.seatNumber); // Convert seatNumber to number
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
    const seatNumber = parseInt(req.params.seatNumber); // Convert seatNumber to number
    const updatedData = req.body; // Data from frontend

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

// Utility function to check if a month has passed
// const hasOneMonthPassed = (lastPaymentDate) => {
//   if (!lastPaymentDate) return true; // If no payment date, mark as pending
//   const oneMonthAgo = new Date();
//   oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//   return new Date(lastPaymentDate) < oneMonthAgo;
// };

// API to update payment status and return pending students
// router.get("/update-payments", async (req, res) => {
//   try {
//     // console.log("Incoming request to update-payments"); 
//     const seats = await Seat.find(); // ✅ Should work fine
//     // console.log("Seats fetched:", seats.length);

//     let pendingStudents = [];

//     for (let seat of seats) {
//       if (hasOneMonthPassed(seat.feeSubmissionDate)) {
//         seat.paymentStatus = "Pending";
//         await seat.save();
//         pendingStudents.push(seat.studentName);
//       }
//     }

//     res.json({
//       message: "Payment statuses updated",
//       pendingStudents,
//     });
//   } catch (error) {
//     console.error("Error updating payments:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

module.exports = router;
