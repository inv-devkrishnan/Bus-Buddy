import React from "react";
import { useNavigate } from "react-router-dom";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AddRouteCard from "../components/AddRouteCard";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("../assets/route.jpg");

describe("AddRouteCard component", () => {
  useNavigate.mockImplementation(() => jest.fn());

  it("renders card", () => {
    render(<AddRouteCard />);
  });
});
