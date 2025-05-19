import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

const EditSeat = () => {
  const { seatNumber } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [seat, setSeat] = useState({
    studentName: "",
    email: "",
    phone: "",
    address: "",
    paymentStatus: "Pending",
    feeSubmissionDate: "",
    description: "",
  });

  useEffect(() => {
    const fetchSeat = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/seats/seats/${seatNumber}`
        );
        setSeat(response.data);
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };
    fetchSeat();
  }, [seatNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeat((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seats/seats/${seatNumber}`,
        seat
      );
      toast.success(`Updated Successfully`);
      navigate("/");
    } catch (error) {
      console.error("Error updating seat details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const emptySeat = async (seatId) => {
    console.log(seatId);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seats/empty/${seatId}`
      );
      console.log(response.data.message);
    } catch (error) {
      console.error(
        "Error emptying seat:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="min-h-screen  flex justify-center items-center bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#2c5364] px-4">
      <div className="w-full my-5 max-w-xl bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 text-white border border-gray-500/20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-300 hover:text-white mb-5 transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-3xl font-semibold text-center mb-6 tracking-wide">
          Edit Seat #{seatNumber}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Student Name</label>
            <input
              type="text"
              name="studentName"
              value={seat?.studentName}
              onChange={handleChange}
              placeholder="Enter student name"
              className="input-field rounded-md px-2 py-1 text-gray-800 bg-[#bfd5df]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={seat?.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="input-field rounded-md px-2 py-1 text-gray-800 bg-[#bfd5df]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={seat?.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="input-field rounded-md px-2 py-1 text-gray-800 bg-[#bfd5df]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={seat?.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="input-field rounded-md px-2 py-1 text-gray-800 bg-[#bfd5df]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Payment Status</label>
            <select
              name="paymentStatus"
              value={seat?.paymentStatus}
              onChange={handleChange}
              className="input-field rounded-md px-2 py-1 text-gray-800 bg-[#bfd5df]"
            >
              <option value="Not Available">select</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          {seat.paymentStatus == "Paid" ? (
            <div className="flex flex-col">
              <label className="text-gray-300  ">Fee Submission Date</label>
              <input
                type="date"
                required
                name="feeSubmissionDate"
                value={
                  seat.feeSubmissionDate
                    ? new Date(seat?.feeSubmissionDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="input-field rounded-md px-2 py-1 text-gray-800 bg-[#bfd5df]"
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <label className="text-gray-300  ">Fee Submission Date</label>
              <input
                disabled
                type="date"
                required
                name="feeSubmissionDate"
                value=''
                onChange={handleChange}
                className="cursor-not-allowed input-field rounded-md px-2 py-1 text-gray-800 bg-[#bfd5df]"
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={seat?.description}
              onChange={handleChange}
              placeholder="Enter additional details..."
              className="input-field h-28 rounded-md px-2 py-1 text-gray-800 bg-[#bfd5df]"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FaSave /> Save Changes
              </>
            )}
          </button>
          <hr />
          {/* <button onClick={() => emptySeat(seatNumber)}> Empty Seat</button> */}
        </form>
      </div>
    </div>
  );
};

export default EditSeat;
