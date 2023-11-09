import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import OwnerUpdateCard from "./components/OwnerUpdateCard";
import UpdateOwnerProfile from "./components/Bus_Ui/UpdateOwnerProfile";
import AddBus from "./components/Bus_Ui/AddBus";
import DeleteBus from "./components/Bus_Ui/DeleteBus";
import UpdateBus from "./components/Bus_Ui/UpdateBus";
import ViewBus from "./components/Bus_Ui/ViewBus";
import AddAmenities from "./components/Bus_Ui/AddAmenities";
import UpdateAmenities from "./components/Bus_Ui/UpdateAmenities";
import Addroutes from "./components/route_ui/Addroutes";
import Deleteroutes from "./components/route_ui/Deleteroutes";
import ViewRoutes from "./components/route_ui/ViewRoutes";

import LoginPage from "./pages/LoginPage";
import RegisterUser from "./pages/RegisterUser";
import RegisterOwner from "./pages/RegisterOwner";
import UserDashboard from "./pages/UserDashboard";
import UpdateForm from "./components/User/UpdateFormCard";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import ViewSeatDetails from "./pages/ViewSeatDetails";
import FullSleeperDetails from "./pages/AddSeatDetails/FullSleeperDetails";
import FullSeaterDetails from "./pages/AddSeatDetails/FullSeaterDetails";
import SingleSeaterDoubleSleeperDetails from "./pages/AddSeatDetails/SingleSeaterDoubleSleeperDetails";
import DeleteAccountPage from "./pages/DeleteAccount";
import ChangePassword from "./pages/ChangePassword";
import { SeatContextProvider } from "./utils/SeatContext";
import { AddSeatContextProvider } from "./utils/AddSeatContext";

function App() {
  return (
    <SeatContextProvider>
      <AddSeatContextProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/delete-account" element={<DeleteAccountPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/full-sleeper-details" element={<FullSleeperDetails />} />
          <Route path="/full-seater-details" element={<FullSeaterDetails />} />
          <Route
            path="/single-seater-double-sleeper-details"
            element={<SingleSeaterDoubleSleeperDetails />}
          />
          <Route path="/view-seats" element={<ViewSeatDetails />} />

          <Route path="/" element={<LandingPage />} />
          <Route path="/Addbus" element={<AddBus />} />
          <Route path="/Deletebus" element={<DeleteBus />} />
          <Route path="/Updatebus" element={<UpdateBus />} />
          <Route path="/Viewbus" element={<ViewBus />} />
          <Route path="/Addamenities" element={<AddAmenities />} />
          <Route path="/Updateamenities" element={<UpdateAmenities />} />
          <Route path="/Addroutes" element={<Addroutes />} />
          <Route path="/Deleteroutes" element={<Deleteroutes />} />
          <Route path="/ViewRoutes" element={<ViewRoutes />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/update-owner" element={<OwnerUpdateCard />} />
          <Route path="/register-owner" element={<RegisterOwner />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/update-user" element={<UpdateForm />} />
          <Route path="/Update-Profile" element={<UpdateOwnerProfile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </AddSeatContextProvider>
    </SeatContextProvider>
  );
}

export default App;
