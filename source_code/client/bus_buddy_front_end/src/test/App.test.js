import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";

jest.mock("../components/BusOwnerUi/BusHome");
jest.mock("../components/BusOwnerUi/MyBuses/AddBus");
jest.mock("../components/BusOwnerUi/MyBuses/UpdateBus");
jest.mock("../components/BusOwnerUi/MyBuses/ViewBus");
jest.mock("../components/BusOwnerUi/MyBuses/AddAmenities");
jest.mock("../components/BusOwnerUi/MyBuses/UpdateAmenities");
jest.mock("../components/BusOwnerUi/MyRoutes/Addroutes");
jest.mock("../components/BusOwnerUi/MyRoutes/ViewRoutes");
jest.mock("../pages/LoginPage");
jest.mock("../pages/RegisterUser");
jest.mock("../pages/RegisterOwner");
jest.mock("../pages/UserDashboard");
jest.mock("../pages/AdminDashboard");
jest.mock("../pages/LandingPage");
jest.mock("../pages/AddSeatDetails/FullSleeperDetails");
jest.mock("../components/OwnerUpdateCard");
jest.mock("../components/BusOwnerUi/UpdateOwnerProfile");
jest.mock("../components/User/TravellerDetail");
jest.mock("../pages/PaymentPage");
jest.mock("../pages/DeleteAccount");
jest.mock("../pages/ChangePassword");
jest.mock("../components/common/navbar/NavBarLayout");
jest.mock("../components/BusOwnerUi/MyTrips/UpdateTrips");
jest.mock("../components/BusOwnerUi/MyTrips/Addtrips");
jest.mock("../components/BusOwnerUi/MyTrips/Addrecurringtrip");
jest.mock("../pages/SearchTrips");
jest.mock("../pages/error_pages/NotFoundPage");
jest.mock("../components/admin/coupon/CreateCoupon");
jest.mock("../components/admin/profile/ProfileView");
jest.mock("../components/common/view_complaints/ViewComplaints");
jest.mock("../components/admin/coupon/ListCoupon");
jest.mock("../components/admin/ListUsers");
jest.mock("../components/admin/profile/AdminProfile");
jest.mock("../components/admin/profile/UpdateProfile");

describe("App Component", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });
});
