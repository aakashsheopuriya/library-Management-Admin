import React from "react";
import SeatList from "./componentes/SeatList";
import { Route, Router, Routes } from "react-router-dom";
import EditSeat from "./componentes/EditSeat";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<SeatList />} />
        <Route path="/edit/:seatNumber" element={<EditSeat />} />
      </Routes>
    </>
  );
};

export default App;
