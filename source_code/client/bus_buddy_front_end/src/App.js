import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

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
import ProfileView from "./components/admin/profile/ProfileView";
import ViewComplaints from "./components/common/view_complaints/ViewComplaints";
import ListCoupon from "./components/admin/coupon/ListCoupon";
import ListUsers from "./components/admin/ListUsers";
import AdminProfile from "./components/admin/profile/AdminProfile";
import UpdateProfile from "./components/admin/profile/UpdateProfile";
import Passengerlist from "./components/BusOwnerUi/MyTrips/Passengerlist";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavbarLayout />}>
        {/* pages which have navbar */}
        <Route index element={<LandingPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route
            path="/admin-dashboard/view-profile"
            element={<AdminProfile />}
          >
            <Route index element={<ProfileView />} />
            <Route
              path="/admin-dashboard/view-profile/update"
              element={<UpdateProfile />}
            ></Route>
            <Route
              path="/admin-dashboard/view-profile/change-password"
              element={<ChangePassword />}
            ></Route>
          </Route>
          <Route
            path="/admin-dashboard/create-coupon"
            element={<CreateCoupon />}
          />
          <Route path="/admin-dashboard/show-coupon" element={<ListCoupon />} />
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
        <Route path="/full-sleeper-details" element={<FullSleeperDetails />} />
        <Route path="/Update-Profile" element={<UpdateOwnerProfile />} />
        <Route path="/search-trip" element={<SearchTrips />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="/passengers-list" element={<Passengerlist/>}/>
      </Route>
      {/* pages which don't have navbar */}
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-user" element={<RegisterUser />} />
      <Route path="/register-owner" element={<RegisterOwner />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
