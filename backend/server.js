const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const seatRoutes = require("./routes/seatRoutes");
const Seat = require("./models/Seat");

dotenv.config();
connectDB();

const initializeSeats = async () => {
  try {
    // Count how many seats are in DB
    const seatCount = await Seat.countDocuments();

    if (seatCount === 0) {
      // First time setup → create all 218 seats
      let seats = [];
      for (let i = 1; i <= 218; i++) {
        seats.push({ seatNumber: i });
      }
      await Seat.insertMany(seats);
      console.log("Initialized 218 seats (Room 1 + Room 2).");
    } else {
      // DB already has seats → check if Room 2 seats are missing
      const existingSeats = await Seat.find({}, "seatNumber");
      const existingSeatNumbers = existingSeats.map((s) => s.seatNumber);

      let newSeats = [];
      for (let i = 107; i <= 218; i++) {
        if (!existingSeatNumbers.includes(i)) {
          newSeats.push({ seatNumber: i });
        }
      }

      if (newSeats.length > 0) {
        await Seat.insertMany(newSeats);
        console.log(`Added ${newSeats.length} seats for Room 2.`);
      }
    }
  } catch (error) {
    console.error("Error initializing seats:", error);
  }
};

initializeSeats();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/seats", seatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
