import React from "react";
import { Routes, Route } from "react-router-dom";
import ViewSeatDetails from "./Pages/ViewSeatDetails";
import AddSeatDetails from "./Pages/AddSeatDetails";

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<AddSeatDetails/>}/>
        <Route path="user" element={<ViewSeatDetails />} />
      </Routes>
    </div>
  );
}

export default App;