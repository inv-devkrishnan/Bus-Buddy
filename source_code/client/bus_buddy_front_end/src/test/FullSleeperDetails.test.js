import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FullSleeperDetails from "../pages/AddSeatDetails/FullSleeperDetails";
import { AddSeatContextProvider } from "../utils/AddSeatContext";

jest.mock("../assets/sleeper.png");
jest.mock("../assets/selectedSleeper.png");
jest.mock("../assets/maleSleeper.png");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest
    .fn()
    .mockReturnValue({ state: { id: 1, bus_seat_type: 1 } }),
}));

describe("FullSleeperDetails component", () => {
  it("renders card", () => {
    render(
      <AddSeatContextProvider>
        <FullSleeperDetails />
      </AddSeatContextProvider>
    );
  });
});
