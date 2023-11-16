import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import BusHome from "./components/BusOwnerUi/BusHome";
import AddBus from "./components/BusOwnerUi/Mybuses/AddBus";
import UpdateBus from "./components/BusOwnerUi/Mybuses/UpdateBus";
import ViewBus from "./components/BusOwnerUi/Mybuses/ViewBus";
import AddAmenities from "./components/BusOwnerUi/Mybuses/AddAmenities";
import UpdateAmenities from "./components/BusOwnerUi/Mybuses/UpdateAmenities";
import Addroutes from "./components/BusOwnerUi/MyRoutes/Addroutes";
import ViewRoutes from "./components/BusOwnerUi/MyRoutes/ViewRoutes";
import LoginPage from "./pages/LoginPage";
import RegisterUser from "./pages/RegisterUser";
import RegisterOwner from "./pages/RegisterOwner";
import UserDashboard from "./pages/UserDashboard";
import OwnerUpdateCard from "./components/OwnerUpdateCard";
import UpdateOwnerProfile from "./components/BusOwnerUi/UpdateOwnerProfile";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import UpdateForm from "./components/User/UpdateFormCard";
import Addtrips from "./components/BusOwnerUi/MyTrips/Addtrips";
import { NavbarLayout } from "./components/common/navbar/NavBarLayout";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<NavbarLayout />}>
          {/* pages which have navbar */}
          <Route index element={<LandingPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
          <Route path="/BusHome" element={<BusHome />} />
          <Route path="/Addbus" element={<AddBus />} />
          <Route path="/Updatebus" element={<UpdateBus />} />
          <Route path="/Viewbus" element={<ViewBus />} />
          <Route path="/Addamenities" element={<AddAmenities />} />
          <Route path="/Updateamenities" element={<UpdateAmenities />} />
          <Route path="/Addroutes" element={<Addroutes />} />
          <Route path="/ViewRoutes" element={<ViewRoutes />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="view-trips" element={<ViewRoutes />} />
          <Route path="add-trips" element={<Addtrips />} />
          <Route path="/update-owner" element={<OwnerUpdateCard />} />
          <Route path="/update-user" element={<UpdateForm />} />
          <Route path="/Update-Profile" element={<UpdateOwnerProfile />} />
        </Route>
         {/* pages which doesn't have navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-owner" element={<RegisterOwner />} />
        <Route path="/register-user" element={<RegisterUser />} />
      </Routes>
    </div>
  );
}

export default App;
