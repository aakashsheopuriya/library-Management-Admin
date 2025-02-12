const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const seatRoutes = require("./routes/seatRoutes");
const Seat = require("./models/Seat");

dotenv.config();
connectDB();

const initializeSeats = async () => {
  const seatCount = await Seat.countDocuments();
  if (seatCount === 0) {
    let seats = [];
    for (let i = 1; i <= 106; i++) {
      seats.push({ seatNumber: i });
    }
    await Seat.insertMany(seats);
    // console.log("Initialized 106 seats in the database.");
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
