import React from "react";
import { useNavigate } from "react-router-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserDashboard from "../pages/UserDashboard";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("../utils/hooks/useAuth", () => ({
  useAuthStatus: jest.fn(() => true),
}));

jest.mock("../components/common/SideBar");
jest.mock("../pages/DeleteAccount");
jest.mock("../components/User/UserProfilePage");
jest.mock("../components/User/UserBookingHistory");
jest.mock("../components/User/UserComplaint");
jest.mock("../components/User/ReviewHistory");

describe("UserDashboard component", () => {
  useNavigate.mockImplementation(() => jest.fn());

  it("renders component", () => {
    render(<UserDashboard />);
  });
});
