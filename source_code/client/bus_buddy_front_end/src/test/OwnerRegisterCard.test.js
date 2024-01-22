import React, { useContext } from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import OwnerRegisterCard from "../components/OwnerRegisterCard.jsx";
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

describe("OwnerRegisterCard component", () => {
  useContext.mockImplementation(() => jest.fn());
  const data = {
    first_name: "firstName",
    last_name: "lastName",
    email: "email@gmail.com",
    password: "Aa@12345",
    phone: "9876543210",
    company_name: "Company",
    aadhaar_no: 123456789012,
    msme_no: "UDYAN-123-1234",
    extra_charges: 10,
  };

  it("renders component", () => {
    mock.onPost("bus-owner/registration/", data).reply(201);

    render(<OwnerRegisterCard />);
  });
});
