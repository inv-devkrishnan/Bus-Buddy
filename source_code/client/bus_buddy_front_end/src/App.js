import React from "react";
import { Routes, Route } from "react-router-dom";
import ViewSeatDetails from "./pages/ViewSeatDetails";
import FullSleeperDetails from "./pages/AddSeatDetails/FullSleeperDetails";
import FullSeaterDetails from "./pages/AddSeatDetails/FullSeaterDetails";
import SingleSeaterDoubleSleeperDetails from "./pages/AddSeatDetails/SingleSeaterDoubleSleeperDetails";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<FullSleeperDetails />} />
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
