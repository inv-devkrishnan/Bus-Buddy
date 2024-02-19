import React from "react";
import { useLocation, BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserDashboard from "../pages/UserDashboard";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn().mockReturnValue({
    pathname: "/user-dashboard/profile",
  }),
}));

const renderDifferentOption = (pathname) => {
  useLocation.mockImplementation(
    jest.fn().mockReturnValue({
      pathname: pathname,
    })
  );
  render(
    <BrowserRouter>
      <UserDashboard />
    </BrowserRouter>
  );
};

describe("UserDashboard component", () => {
  it("renders component", () => {
    jest.mock("../utils/hooks/useAuth", () => ({
      useAuthStatus: jest.fn(() => true),
    }));
    render(
      <BrowserRouter>
        <UserDashboard />
      </BrowserRouter>
    );
    const profileButton = screen.getByText("My Profile");
    fireEvent.click(profileButton);
    const tripButton = screen.getByText("My Trips");
    fireEvent.click(tripButton);
    const reviewButton = screen.getByText("My Reviews");
    fireEvent.click(reviewButton);
    const complaintButton = screen.getByText("Register Complaint");
    fireEvent.click(complaintButton);
    const deleteButton = screen.getByText("Delete Account");
    fireEvent.click(deleteButton);
  });

  test("user dashboard", () => {
    renderDifferentOption("/user-dashboard/profile");
    renderDifferentOption("/user-dashboard/profile/edit");
    renderDifferentOption("/user-dashboard/profile/change-password");
    renderDifferentOption("/user-dashboard/my-trips");
    renderDifferentOption("/user-dashboard/delete");
    renderDifferentOption("/user-dashboard/complaint");
    renderDifferentOption("/user-dashboard/review");
    renderDifferentOption("/fdsffds/fdsf");
  });

  it("renders component unauthorised", () => {
    jest.mock("../utils/hooks/useAuth", () => ({
      useAuthStatus: jest.fn(() => false),
    }));
    render(
      <BrowserRouter>
        <UserDashboard />
      </BrowserRouter>
    );
  });

  it("renders component unauthorised 1", () => {
    localStorage.setItem("user_role", 1);
    jest.mock("../utils/hooks/useAuth", () => ({
      useAuthStatus: jest.fn(() => true),
    }));
    render(
      <BrowserRouter>
        <UserDashboard />
      </BrowserRouter>
    );
  });
});
