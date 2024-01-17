import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BusHome from "../components/BusOwnerUi/BusHome";
import { MemoryRouter, useNavigate } from "react-router-dom";

jest.mock("../components/BusOwnerUi/Ownerprofile.jsx");
jest.mock("../components/BusOwnerUi/MyBuses/ViewBus");
jest.mock("../components/BusOwnerUi/MyRoutes/ViewRoutes");
jest.mock("../components/BusOwnerUi/MyTrips/ViewTrips");
jest.mock("../components/BusOwnerUi/MyReviews/ViewReviews.jsx");
jest.mock("../components/common/view_complaints/ViewComplaints.jsx");
jest.mock("../pages/DeleteAccount.jsx");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("../utils/hooks/useAuth", () => ({
  useAuthStatus: jest.fn(() => true),
}));
describe("ReviewHistory component", () => {
  useNavigate.mockImplementation(() => jest.fn());
  it("renders component",async () => {
    render(
      <MemoryRouter>
        <BusHome />
      </MemoryRouter>
    );
    await new Promise(resolve => setTimeout(resolve, 2000));

    const profileButton = screen.getByText("My Profile");
    fireEvent.click(profileButton);

    const busesButton = screen.getByText("My buses");
    fireEvent.click(busesButton);

    const routeButton = screen.getByText("My Routes");
    fireEvent.click(routeButton);

    const tripButton = screen.getByText("My Trips");
    fireEvent.click(tripButton);

    const reviewButton = screen.getByText("My Reviews");
    fireEvent.click(reviewButton);

    const accountButton = screen.getByText("Delete Account");
    fireEvent.click(accountButton);
    
    const complaintButton = screen.getByText("View Complaints");
    fireEvent.click(complaintButton);

  });
});
