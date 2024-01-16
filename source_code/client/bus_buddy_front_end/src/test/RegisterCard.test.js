import React, { useContext } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RegisterCard from "../components/User/RegisterCard";
import { openAxiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));
jest.mock("react-bootstrap/Card");

let mock;

beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("RegisterCard component", () => {
  useContext.mockImplementation(() => jest.fn());
  const data = {
    first_name: "firstName",
    last_name: "lastName",
    email: "email@gmail.com",
    password: "Aa@12345",
    phone: "9876543210",
  };

  it("renders component", () => {
    render(<RegisterCard />);
    mock.onPost("user/registration/", data).reply(201);
  });
});
