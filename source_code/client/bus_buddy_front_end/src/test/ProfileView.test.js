import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProfileView from "../components/admin/profile/ProfileView";
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});
jest.mock("../../../assets/images/adminProfileView.png");
describe("view profile", () => {
  test("render view profile", () => {
    let data = {
      first_name: "dev",
      last_name: "krishnan",
      email: "dev@123.com",
      phone: "1233553435",
    };
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <BrowserRouter>
        <ProfileView />
      </BrowserRouter>
    );
  });
  test("render view profile error", () => {
    mock.onGet(`adminstrator/update-profile/`).reply(400);
    render(
      <BrowserRouter>
        <ProfileView />
      </BrowserRouter>
    );
  });
  test("render view profile error 1", () => {
    mock.onGet(`adminstrator/update-profile/`).reply(401);
    render(
      <BrowserRouter>
        <ProfileView />
      </BrowserRouter>
    );
  });
  test("fire change password", async () => {
    let data = {
      first_name: "dev",
      last_name: "krishnan",
      email: "dev@123.com",
      phone: "1233553435",
    };
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <BrowserRouter>
        <ProfileView />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Change Password")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Change Password"));
    fireEvent.click(screen.getByText("Edit"));
  });
});
