import React from "react";
import { render } from "@testing-library/react";
import AdminDashboard from "./AdminDashboard";
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

describe("SideBar component", () => {
  test("admin dashboard", () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  });

  test("admin dashboard bus owner", () => {
    useLocation.mockImplementation(
      jest.fn().mockReturnValue({
        pathname: "/admin-dashboard/list-busowners",
      })
    );
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  });

  test("admin dashboard complaints", () => {
    useLocation.mockImplementation(
      jest.fn().mockReturnValue({
        pathname: "/admin-dashboard/view-complaints",
      })
    );
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  });
  test("admin dashboard create-coupon", () => {
    useLocation.mockImplementation(
      jest.fn().mockReturnValue({
        pathname: "/admin-dashboard/create-coupon",
      })
    );
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  });
});
