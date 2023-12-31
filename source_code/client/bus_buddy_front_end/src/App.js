import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import { SeatContextProvider } from "./utils/SeatContext";
import { AddSeatContextProvider } from "./utils/AddSeatContext";

import BusHome from "./components/BusOwnerUi/BusHome";
import AddBus from "./components/BusOwnerUi/MyBuses/AddBus";
import UpdateBus from "./components/BusOwnerUi/MyBuses/UpdateBus";
import ViewBus from "./components/BusOwnerUi/MyBuses/ViewBus";
import AddAmenities from "./components/BusOwnerUi/MyBuses/AddAmenities";
import UpdateAmenities from "./components/BusOwnerUi/MyBuses/UpdateAmenities";
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
import PaymentPage from "./pages/PaymentPage";
import DeleteAccountPage from "./pages/DeleteAccount";
import ChangePassword from "./pages/ChangePassword";
import { NavbarLayout } from "./components/common/navbar/NavBarLayout";
import UpdateTrips from "./components/BusOwnerUi/MyTrips/UpdateTrips";
import Addtrips from "./components/BusOwnerUi/MyTrips/Addtrips";
import Addrecurringtrip from "./components/BusOwnerUi/MyTrips/Addrecurringtrip";
import SearchTrips from "./pages/SearchTrips";
import NotFoundPage from "./pages/error_pages/NotFoundPage";
import CreateCoupon from "./components/admin/coupon/CreateCoupon";
import ProfileView from "./components/admin/ProfileView";
import ViewComplaints from "./components/common/view_complaints/ViewComplaints";
import ListCoupon from "./components/admin/coupon/ListCoupon";
import ListUsers from "./components/admin/ListUsers";

function App() {
  return (
    <SeatContextProvider>
      <AddSeatContextProvider>
        <Routes>
          <Route path="/" element={<NavbarLayout />}>
            {/* pages which have navbar */}
            <Route index element={<LandingPage />} />
            <Route path="/delete-account" element={<DeleteAccountPage />} />
            <Route path="/change-password" element={<ChangePassword />} />

            <Route path="/admin-dashboard" element={<AdminDashboard />}>
              <Route
                path="/admin-dashboard/view-profile"
                element={<ProfileView />}
              />
              <Route
                path="/admin-dashboard/create-coupon"
                element={<CreateCoupon />}
              />
              <Route
                path="/admin-dashboard/show-coupon"
                element={<ListCoupon />}
              />
              <Route
                path="/admin-dashboard/view-complaints"
                element={<ViewComplaints />}
              />
              <Route
                path="/admin-dashboard/list-busowners"
                element={<ListUsers busApproval={true} />}
              />
              <Route
                path="/admin-dashboard/list-users"
                element={<ListUsers busApproval={false} />}
              />
            </Route>

            <Route path="/BusHome" element={<BusHome />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/traveller-data" element={<TravellerDetail />} />
            <Route path="/update-owner" element={<OwnerUpdateCard />} />
            <Route path="/Addbus" element={<AddBus />} />
            <Route path="/Updatebus" element={<UpdateBus />} />
            <Route path="/Viewbus" element={<ViewBus />} />
            <Route path="/Addamenities" element={<AddAmenities />} />
            <Route path="/Updateamenities" element={<UpdateAmenities />} />
            <Route path="/Addroutes" element={<Addroutes />} />
            <Route path="/ViewRoutes" element={<ViewRoutes />} />
            <Route path="/view-trips" element={<ViewRoutes />} />
            <Route path="/update-trips" element={<UpdateTrips />} />
            <Route path="/add-trips" element={<Addtrips />} />
            <Route path="/add-recurring-trips" element={<Addrecurringtrip />} />
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
            <Route path="/search-trip" element={<SearchTrips />} />
            <Route path="/not-found" element={<NotFoundPage />} />
          </Route>
          {/* pages which don't have navbar */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-owner" element={<RegisterOwner />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AddSeatContextProvider>
    </SeatContextProvider>
  );
}

export default App;
