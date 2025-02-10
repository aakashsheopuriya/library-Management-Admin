import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChair, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Header from "./Header";
import StudentDetail from "./StudentDetail";

const SeatList = () => {
  const [seats, setSeats] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  const getSeatClasses = (seat) => {
    if (!seat?.studentName)
      return "bg-gray-700/20 text-gray-300 border-gray-500 shadow-gray-500/30";
    if (seat.paymentStatus === "Paid")
      return "bg-green-500/20 text-green-300 border-green-400 shadow-green-500/30";
    if (seat.paymentStatus === "Pending")
      return "bg-red-500/20 text-red-300 border-red-400 shadow-red-500/30";
    return "";
  };

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/seats`
        );
        setSeats(response.data);
      } catch (error) {
        setError("Error fetching seats.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();

    const checkFees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/seats/check-fees`
        );
        {response.data.students.length>0 &&
        alert(`Pending Payments:  ${response.data.students}`)}
      } catch (error) {
        console.error("Error fetching fee data:", error);
        return [];
      }
    };
    checkFees();
  }, []);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setShowDetails(true);
  };

  const closeSeatDetail = () => {
    setSelectedSeat(null);
  };

  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
        <div className="w-16 h-16 border-4 border-t-transparent border-b-transparent border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const arrangedSeats = [
    [1, 2, 3, null, 4, 5, 6, 7, 8],
    [16, 15, 14, null, 13, 12, 11, 10, 9],
    [17, 18, 19, null, 20, 21, 22, 23, 24],
    [32, 31, 30, null, 29, 28, 27, 26, 25],
    [33, 34, 35, null, null, 36, 37, 38, 39],
    [46, 45, 44, null, null, 43, 42, 41, 40],
    [47, 48, 49, null, null, 50, 51, 52, 53],
    [null, null, null, null, null, 57, 56, 55, 54],
    [65, 64, 63, null, 62, 61, 60, 59, 58],
    [66, 67, 68, null, 69, 70, 71, 72, 73],
    [81, 80, 79, null, 78, 77, 76, 75, 74],
    [82, 83, 84, null, 85, 86, 87, 88, 89],
    [97, 96, 95, null, 94, 93, 92, 91, 90],
    [98, 99, 100, null, 101, 102, 103, 104, 105],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex flex-col items-center py-6">
      <Header />
      <div className="hidden md:block  flex-col gap-4 mt-8 ">
        {arrangedSeats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 justify-center">
            {row.map((seatNumber, index) => {
              if (seatNumber === null) {
                return <div key={index} className="w-20 "></div>;
              }
              const seat = seats.find((s) => s.seatNumber === seatNumber);
              return (
                <div
                  key={`${rowIndex}-${seatNumber}`}
                  className={`w-20 h-20 flex flex-col justify-center items-center rounded-lg shadow-lg my-2 p-2 border backdrop-blur-lg bg-opacity-20 transition-transform transform hover:scale-105
                    ${getSeatClasses(seat)}
                    `}
                  onClick={() => handleSeatClick(seat)}
                >
                  <FaChair className="text-2xl mb-1" />
                  <h3 className="text-sm font-semibold">{seatNumber}</h3>
                  {seat?.studentName ? (
                    <FaCheckCircle className="text-green-400" />
                  ) : (
                    <FaTimesCircle className="text-red-400" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="md:hidden flex flex-col gap-2 mt-8">
        {arrangedSeats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2  justify-center flex-wrap">
            {row.map((seatNumber, index) => {
              if (seatNumber === null) {
                return <div key={index} className="w-8"></div>;
              }
              const seat = seats.find((s) => s.seatNumber === seatNumber);
              return (
                <div
                  key={`${rowIndex}-${seatNumber}`}
                  className={`w-9 h-9 my-1  flex justify-center items-center rounded-md shadow-md border backdrop-blur-lg bg-opacity-20 text-white text-sm md:w-20 md:h-20 md:text-base transition-transform transform hover:scale-105 ${getSeatClasses(
                    seat
                  )}`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seatNumber}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {selectedSeat && (
        <StudentDetail seat={selectedSeat} closeDetail={closeSeatDetail} />
      )}
    </div>
  );
};

export default SeatList;
