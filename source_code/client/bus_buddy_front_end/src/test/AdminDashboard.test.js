import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import AdminDashboard from "../pages/AdminDashboard";
import { BrowserRouter, useLocation } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn().mockReturnValue({
    pathname: "/admin-dashboard/list-users",
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
      <AdminDashboard />
    </BrowserRouter>
  );
};

describe("SideBar component", () => {
  test("admin dashboard", () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText("List User"));
    fireEvent.click(screen.getByText("Profile"));
    fireEvent.click(screen.getByText("Bus Owner Approval"));
    fireEvent.click(screen.getByText("View Complaints"));
    fireEvent.click(screen.getByText("Coupons"));
  });

  test("admin dashboard bus owner", () => {
    renderDifferentOption("/admin-dashboard/list-busowners");
    renderDifferentOption("/admin-dashboard/view-complaints");
    renderDifferentOption("/admin-dashboard/create-coupon");
    renderDifferentOption("/admin-dashboard/show-coupon");
    renderDifferentOption("/admin-dashboard/view-profile/change-password");
    renderDifferentOption("/admin-dashboard/view-profile/update");
    renderDifferentOption("/admin-dashboard/view-profile");
    renderDifferentOption("/fdsffds/fdsf");
  });
  
  });
