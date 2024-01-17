import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserProfilePage from "../components/User/UserProfilePage";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

jest.mock("../assets/update.png");
jest.mock("../pages/ChangePassword");
jest.mock("../components/User/UpdateFormCard");
describe("UserProfilePage component", () => {
  it("renders card", async () => {
    const data = {
      first_name: "firstName",
      last_name: "lastName",
      email: "email@gmail.com",
      phone: "9876543210",
    };
    mock.onGet("user/update-profile").reply(200, data);
    render(<UserProfilePage setUserName={jest.fn()} />);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const passwordButton = screen.getByText("Change password");
    fireEvent.click(passwordButton);

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);
  });

  it("renders card catch error", () => {
    mock.onGet("user/update-profile").reply(400);
    render(<UserProfilePage setUserName={jest.fn()} />);
  });
});
