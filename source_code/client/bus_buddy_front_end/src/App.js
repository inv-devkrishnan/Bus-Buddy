import React from "react";
import { Routes, Route } from "react-router-dom";
import ViewSeatDetails from "./pages/ViewSeatDetails";
import AddSeatDetails from "./pages/AddSeatDetails";
import FullSeaterDetails from "./pages/FullSeaterDetails";
import SingleSeaterDoubleSleeperDetails from "./pages/SingleSeaterDoubleSleeperDetails";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AddSeatDetails />} />
        <Route path="/full-seater-details" element={<FullSeaterDetails />} />
        <Route
          path="/single-seater-double-sleeper-details"
          element={<SingleSeaterDoubleSleeperDetails />}
        />
        <Route path="user" element={<ViewSeatDetails />} />
      </Routes>
    </div>
  );
}

export default App;
