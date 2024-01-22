import React, { useContext } from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Ownerprofile from "../components/BusOwnerUi/Ownerprofile";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));
jest.mock("react-bootstrap/Card");

describe("Ownerprofile component", () => {
  const data = {
    first_name: "firstName",
    last_name: "lastName",
    email: "email@gmail.com",
    password: "Aa@12345",
    phone: "9876543210",
    company_name: "Company",
  };

  it("renders component", () => {
    useContext.mockImplementation(() => jest.fn());

    mock.onGet("bus-owner/update-profile").reply(200, data);

    render(<Ownerprofile />);
  });
});
