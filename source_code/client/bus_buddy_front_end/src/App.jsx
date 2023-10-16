import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/BusOwner/Layout" 
import UserLayout from "./Components/User/UserLayout";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="user" element={<UserLayout />} />
      </Routes>
    </div>
  );
}

export default App;