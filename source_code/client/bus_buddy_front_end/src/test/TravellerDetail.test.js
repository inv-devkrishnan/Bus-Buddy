import React from "react";
import { useNavigate } from "react-router-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TravellerDetail from "../components/User/TravellerDetail";
import { UserContextProvider } from "../components/User/UserContext";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("TravellerDetail component", () => {
  useNavigate.mockImplementation(() => jest.fn());

  it("renders component", () => {
    render(
      <UserContextProvider>
        <TravellerDetail />
      </UserContextProvider>
    );
  });
});
