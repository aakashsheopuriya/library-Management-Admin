import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // for navigating to the edit page

const StudentDetail = ({ seat, closeDetail }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50 ">
      <div className="bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] w-96 p-6 rounded-lg shadow-xl backdrop-blur-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">
            Seat {seat.seatNumber} Details
          </h2>
          <FaTimesCircle
            className="text-white cursor-pointer"
            size={24}
            onClick={closeDetail}
          />
        </div>
        <div className="text-white space-y-4">
          <p>
            <strong>Student Name:</strong> {seat.studentName || "Not Assigned"}
          </p>
          <p>
            <strong>Email ID:</strong> {seat.email || "Not Available"}
          </p>
          <p>
            <strong>Phone Number:</strong> {seat.phone || "Not Available"}
          </p>
          <p>
            <strong>Address:</strong> {seat.address || "Not Available"}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            {!seat.studentName ? "Not Available" : seat.paymentStatus}
          </p>
          <p>
            <strong>Description:</strong> {seat.description || "No Description"}
          </p>
          {/* <p>
            <strong>Payment History:</strong>{" "}
            {seat.paymentHistory || "No History"}
          </p> */}
        </div>
        <button
          onClick={() => navigate(`/edit/${seat.seatNumber}`)}
          className="mt-4 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default StudentDetail;
