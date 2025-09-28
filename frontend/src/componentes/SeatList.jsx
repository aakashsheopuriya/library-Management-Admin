import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import StudentDetail from "./StudentDetail";
import { useLocation } from 'react-router-dom';

const SeatList = () => {
  const location = useLocation();
  const [seatMap, setSeatMap] = useState(new Map());
  const [error, setError] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const savedRoom = localStorage.getItem("room");
  const [room, setRoom] = useState(savedRoom || location.state?.room || "1");

  const getSeatClasses = (seat) => {
    if (!seat?.studentName)
      return "bg-gray-700/20 text-gray-300 border-gray-500 shadow-gray-500/30";
    if (seat.paymentStatus === "Paid")
      return "bg-green-500/20 text-green-300 border-green-400 shadow-green-500/30";
    if (seat.paymentStatus === "Pending")
      return "bg-red-500/20 text-red-300 border-red-400 shadow-red-500/30";
    return "";
  };

  const fetchSeats = async (roomNumber) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seats?room=${roomNumber}`
      );
      const seatList = response.data;
      const map = new Map();
      seatList.forEach((seat) => map.set(seat.seatNumber, seat));
      setSeatMap(map);
      setError(null);
    } catch (err) {
      setError("Error fetching seats.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkFees = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seats/check-fees`
      );
      const students = response.data.students;
      if (students.length > 0) {
        toast.warn(`Pending Payments: ${students.join(", ")}`);
      }
    } catch (err) {
      console.error("Fee check error:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("room", room);
    fetchSeats(room);
    checkFees();
  }, [room]);

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
  };

  const closeSeatDetail = () => {
    setSelectedSeat(null);
  };

  // ======= Room Structures =======
  const arrangedSeatsRoom1 = [
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

  const arrangedSeatsRoom2 = [
    [106, 107, 108, null, null, 214, 215, 216, 217],
    [111, 110, 119, null, 213, 212, 211, 210, 209],
    [112, 113, 114, null, 204, 205, 206, 207, 208],
    [117, 116, 115, null, 203, 202, 201, 200, 199],
    [118, 119, 120, null, 194, 195, 196, 197, 198],
    [123, 122, 121, null, 193, 192, 191, 190, 189],
    [124, 125, 126, null, 184, 185, 186, 187, 188],
    [129, 128, 127, null, null, 183, 182, 181, 180],
    [130, 131, 132, null, null, 176, 177, 178, 179],
    [135, 134, 133, null, null, 175, 174, 173, 172],
    [136, 137, 138, null, null, 168, 169, 170, 171],
    [141, 140, 139, null, 167, 166, 165, 164, 163],
    [142, 143, 144, null, 158, 159, 160, 161, 162],
    [147, 146, 145, null, 157, 156, 155, 154, 153],
    [null, null, null, null, 148, 149, 150, 151, 152],
  ];

  const getArrangedSeats = () => {
    return room === "1" ? arrangedSeatsRoom1 : arrangedSeatsRoom2;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold text-gray-300 mt-6">
            Oops! Something went wrong.
          </h1>
          <p className="text-gray-400 mt-2">{ error }</p>
        </div>
      </div>
    );
  }

  return (
    <>
      { loading && seatMap.size === 0 && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
          <div className="w-16 h-16 border-4 border-t-transparent border-b-transparent border-white rounded-full animate-spin"></div>
        </div>
      ) }

      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex flex-col items-center py-6">
        <Header />
        <ToastContainer />

        {/* Room Selector */ }
        <div className="flex gap-4 my-6">
          <button
            onClick={ () => setRoom("1") }
            className={ `px-5 py-2 rounded-md font-semibold backdrop-blur-md border border-gray-500/40 text-gray-300 transition-all duration-300 shadow-md ${room === "1"
              ? "bg-white/10 text-white border-white/50 shadow-lg scale-105"
              : "bg-gray-700/20 hover:bg-gray-700/40 hover:text-white"
              }` }
          >
            Room 1
          </button>

          <button
            onClick={ () => setRoom("2") }
            className={ `px-5 py-2 rounded-md font-semibold backdrop-blur-md border border-gray-500/40 text-gray-300 transition-all duration-300 shadow-md ${room === "2"
              ? "bg-white/10 text-white border-white/50 shadow-lg scale-105"
              : "bg-gray-700/20 hover:bg-gray-700/40 hover:text-white"
              }` }
          >
            Room 2
          </button>
        </div>



        {/* Seats Grid */ }
        <div className="relative flex flex-col gap-2 mt-4">
          {/* Subtle loader overlay */ }
          { loading && seatMap.size > 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full rounded-lg backdrop-blur-sm"></div>
            </div>
          ) }

          { getArrangedSeats().map((row, rowIndex) => (
            <div key={ rowIndex } className="flex gap-2 justify-center flex-wrap">
              { row.map((seatNumber, index) => {
                if (seatNumber === null) return <div key={ index } className="w-9" />;
                const seat = seatMap.get(seatNumber);
                return (
                  <div
                    key={ `${rowIndex}-${seatNumber}` }
                    className={ `cursor-pointer w-9 h-9 my-1 flex justify-center items-center rounded-md shadow-md border backdrop-blur-lg bg-opacity-20 text-white text-sm transition-transform transform hover:scale-105 ${getSeatClasses(seat)}` }
                    onClick={ () => handleSeatClick(seat) }
                  >
                    { seatNumber }
                  </div>
                );
              }) }
            </div>
          )) }
        </div>

        { selectedSeat && (
          <StudentDetail seat={ selectedSeat } closeDetail={ closeSeatDetail } />
        ) }
      </div>
    </>
  );
};

export default SeatList;
