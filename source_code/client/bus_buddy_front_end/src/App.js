import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import { SeatContextProvider } from "./utils/SeatContext";
import { AddSeatContextProvider } from "./utils/AddSeatContext";

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
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import FullSleeperDetails from "./pages/AddSeatDetails/FullSleeperDetails";
import FullSeaterDetails from "./pages/AddSeatDetails/FullSeaterDetails";
import SingleSeaterDoubleSleeperDetails from "./pages/AddSeatDetails/SingleSeaterDoubleSleeperDetails";
import OwnerUpdateCard from "./components/OwnerUpdateCard";
import UpdateOwnerProfile from "./components/BusOwnerUi/UpdateOwnerProfile";
import TravellerDetail from "./components/User/TravellerDetail";
import DeleteAccountPage from "./pages/DeleteAccount";
import ChangePassword from "./pages/ChangePassword";
import { NavbarLayout } from "./components/common/navbar/NavBarLayout";

function App() {
  return (
    <SeatContextProvider>
      <AddSeatContextProvider>
        <Routes>
          <Route path="/" element={<NavbarLayout />}>
            {/* pages which have navbar */}
            <Route path="/update-owner" element={<OwnerUpdateCard />} />
            <Route path="/Addbus" element={<AddBus />} />
            <Route path="/Updatebus" element={<UpdateBus />} />
            <Route path="/Viewbus" element={<ViewBus />} />
            <Route path="/Addamenities" element={<AddAmenities />} />
            <Route path="/Updateamenities" element={<UpdateAmenities />} />
            <Route path="/Addroutes" element={<Addroutes />} />
            <Route path="/ViewRoutes" element={<ViewRoutes />} />
            <Route path="/view-trips" element={<ViewRoutes />} />
            <Route
              path="/full-sleeper-details"
              element={<FullSleeperDetails />}
            />
            <Route
              path="/full-seater-details"
              element={<FullSeaterDetails />}
            />
            <Route
              path="/single-seater-double-sleeper-details"
              element={<SingleSeaterDoubleSleeperDetails />}
            />
            <Route path="/Update-Profile" element={<UpdateOwnerProfile />} />
            <Route index element={<LandingPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/BusHome" element={<BusHome />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/traveller-data" element={<TravellerDetail />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-owner" element={<RegisterOwner />} />
        </Routes>
      </AddSeatContextProvider>
    </SeatContextProvider>
  );
}

export default App;
