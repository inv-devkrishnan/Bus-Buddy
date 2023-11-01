import React from "react";
import { Route, Routes } from "react-router-dom";

import BusHome from "./components/Bus_Ui/BusHome";
import AddBus from "./components/Bus_Ui/AddBus";
import DeleteBus from "./components/Bus_Ui/DeleteBus";
import UpdateBus from "./components/Bus_Ui/UpdateBus";
import ViewBus from "./components/Bus_Ui/ViewBus";
import AddAmenities from "./components/Bus_Ui/AddAmenities";
import UpdateAmenities from "./components/Bus_Ui/UpdateAmenities";

import Addroutes from "./components/route_ui/Addroutes";
import Deleteroutes from "./components/route_ui/Deleteroutes";
import Updateroutes from "./components/route_ui/updateroutes";
import Viewroutes from "./components/route_ui/viewroutes";

import LoginPage from "./pages/LoginPage";
import RegisterUser from "./pages/RegisterUser";
import RegisterOwner from "./pages/RegisterOwner";
import UserDashboard from "./pages/UserDashboard";

import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
        <Routes>
          <Route path="/" element={<BusHome />} />
          <Route path="/Addbus" element={<AddBus />} />
          <Route path="/Deletebus" element={<DeleteBus />} />
          <Route path="/Updatebus" element={<UpdateBus />} />
          <Route path="/Viewbus" element={<ViewBus />} />
          <Route path="/Addamenities" element={<AddAmenities />} />
          <Route path="/Updateamenities" element={<UpdateAmenities />} />

          <Route path="/Addroutes" element={<Addroutes />} />
          <Route path="/Deleteroutes" element={<Deleteroutes />} />
          <Route path="/Updateroutes" element={<Updateroutes />} />
          <Route path="/Viewroutes" element={<Viewroutes />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-owner" element={<RegisterOwner />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />




        </Routes>
  );
}

export default App;
