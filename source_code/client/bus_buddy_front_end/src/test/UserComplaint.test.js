import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserComplaint from "../components/User/UserComplaint";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

jest.mock("../assets/images/couponOther.png");

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("UserComplaint component", () => {
  it("renders card", () => {
    render(<UserComplaint />);
  });

  it("renders card then", () => {
    mock.onGet("user/list-complaints/").reply(200, { data: "" });
    render(<UserComplaint />);

    const responseTab = screen.getByText("View Response");
    fireEvent.click(responseTab);
  });
  it("renders card complaint tab", () => {
    render(<UserComplaint />);

    const formTab = screen.getByText("Complaint Form");
    fireEvent.click(formTab);
  });

  it("renders card response tab", () => {
    mock.onGet("user/list-complaints/");
    render(<UserComplaint />);

    const responseTab = screen.getByText("View Response");
    fireEvent.click(responseTab);
  });
});
