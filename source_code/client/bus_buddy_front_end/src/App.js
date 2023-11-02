import React from "react";
import { Routes, Route } from "react-router-dom";
import ViewSeatDetails from "./pages/ViewSeatDetails";
import AddSeatDetails from "./pages/AddSeatDetails";
import FullSeaterDetails from "./pages/FullSeaterDetails"

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<AddSeatDetails/>}/>
      <Route path="/full-seater-details" element={<FullSeaterDetails/>}/>
        <Route path="user" element={<ViewSeatDetails />} />
      </Routes>
    </div>
  );
}

export default App;