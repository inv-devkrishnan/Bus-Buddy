import React from "react";
import { useLocation } from "react-router-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FullSleeperDetails from "../pages/AddSeatDetails/FullSleeperDetails";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { Grid } from "@mui/material";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Grid: jest.fn(),
}));

describe("FullSleeperDetails component", () => {
  useLocation.mockImplementation(() => jest.fn());
  Grid.mockImplementation(() => jest.fn());

  it("renders card", () => {
    render(
      <AddSeatContextProvider>
        <FullSleeperDetails />
      </AddSeatContextProvider>
    );
  });
});
