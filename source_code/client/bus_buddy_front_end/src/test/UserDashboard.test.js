import React from "react";
import { useNavigate } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserDashboard from "../pages/UserDashboard";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("../utils/hooks/useAuth", () => ({
  useAuthStatus: jest.fn(() => true),
}));

jest.mock("../pages/DeleteAccount");
jest.mock("../components/User/UserProfilePage");
jest.mock("../components/User/UserBookingHistory");
jest.mock("../components/User/UserComplaint");
jest.mock("../components/User/ReviewHistory");

describe("UserDashboard component", () => {
  useNavigate.mockImplementation(() => jest.fn());

  it("renders component", () => {
    render(<UserDashboard />);
    const profileButton = screen.getByText("My Profile");
    fireEvent.click(profileButton)
    const tripButton = screen.getByText("My Trips");
    fireEvent.click(tripButton)
    const reviewButton = screen.getByText("My Reviews");
    fireEvent.click(reviewButton)
    const complaintButton = screen.getByText("Register Complaint");
    fireEvent.click(complaintButton)
    const deleteButton = screen.getByText("Delete Account");
    fireEvent.click(deleteButton)

  });
});
